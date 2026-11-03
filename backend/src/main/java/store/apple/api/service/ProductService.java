package store.apple.api.service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import store.apple.api.client.MeLiClient;
import store.apple.api.dto.ProductDTO;
import store.apple.api.dto.ProductDetailDTO;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class ProductService {
        private final MeLiClient meLiClient;
        private final ObjectMapper objectMapper;
        private final ExecutorService executor = Executors.newFixedThreadPool(8);
        private static final Set<String> SPECS_FILTRABLES = Set.of(
                "INTERNAL_MEMORY", "MAIN_COLOR", "RAM", "PROCESSOR_MODEL", "LINE",
                "RAM_MEMORY_MODULE_TOTAL_CAPACITY", "SSD_DATA_STORAGE_CAPACITY"
        );

        public ProductService(MeLiClient meLiClient, ObjectMapper objectMapper) {
        this.meLiClient = meLiClient;
        this.objectMapper = objectMapper;
        }

        /**
         * Búsqueda libre.
         *
         * Ejemplo:
         * "MacBook Pro"
         * "iPhone 17"
         * "AirPods"
         *
         * Devuelve ProductDTO igual que la búsqueda por categoría.
         */
        @Cacheable(value = "productosPorCategoria", key = "'busqueda-' + #query", unless = "#result == null || #result.isEmpty()")
        public List<ProductDTO> searchProducts(String query) {
                try {
                        String json = meLiClient.searchProducts(query);
                        JsonNode results = objectMapper.readTree(json).path("results");
                        return procesarProductos(results);
                } catch (Exception e) {
                        throw new RuntimeException("Error al buscar productos en Mercado Libre",e);
                }       
        }

        /**
         * Busca la categoría/domain correspondiente a una búsqueda.
         */
        public String searchCategory(String query) {
                return meLiClient.searchCategory(query);
        }

        /**
         * Lista de productos de una categoría, con su precio real.
         * 1. Pide a ML los productos de catálogo (sin precio).
         * 2. Por cada uno busca el precio con obtenerPrecio().
         * 3. Descarta los que no tienen precio y corta al llegar a 10.
         */

        @Cacheable(value = "productosPorCategoria", key = "#query + '-' + #categoryId",unless = "#result == null || #result.isEmpty()")
        public List<ProductDTO> searchProductsByCategory(String query,String categoryId) {
                try {
                        String json = meLiClient.searchProductsByCategory(query,categoryId);

                        JsonNode results = objectMapper.readTree(json).path("results");

                        return procesarProductos(results);

                } catch (Exception e) {
                        throw new RuntimeException("Error al procesar productos de Mercado Libre", e);
                }
        }
        /**
         * Convierte los resultados de Mercado Libre en ProductDTO.
         *
         * Los precios se consultan en paralelo porque /products/search
         * no devuelve el precio real de cada publicación.
         */
        private List<ProductDTO> procesarProductos(JsonNode results) {
                List<CompletableFuture<ProductDTO>> tareas =new ArrayList<>();

                for (JsonNode producto : results) {
                        CompletableFuture<ProductDTO> tarea =CompletableFuture.supplyAsync(() -> {

                                String id = producto.path("id").asText();
                                String nombre = producto.path("name").asText();
                                String imagen = producto
                                                .path("pictures")
                                                .path(0)
                                                .path("url")
                                                .asText(null);

                                String categoria = producto.path("domain_id").asText(null);
                                String enlace = "https://www.mercadolibre.com.ar/p/" + id;
                                Precio precio = obtenerPrecio(id);

                                if (precio == null) return null;
                                        return new ProductDTO(id, nombre, imagen, precio.actual(), precio.original(), enlace, categoria, leerSpecs(producto));
                                }, executor);

                        tareas.add(tarea);
                }
                return tareas.stream().map(CompletableFuture::join).filter(Objects::nonNull).limit(20).toList();
        }
     
        /**
         * Detalle completo de un producto.
         */
        @Cacheable(value = "productosPorCategoria", key = "'detalle-' + #id")
        public ProductDetailDTO getProductDetail(String id) {
                try {
                        JsonNode p = objectMapper.readTree(meLiClient.getProduct(id));

                        // Imágenes
                        List<String> imagenes = new ArrayList<>();

                        for (JsonNode pic : p.path("pictures")) {
                                imagenes.add(pic.path("url").asText());
                        }

                        // Especificaciones
                        List<ProductDetailDTO.Spec> specs = new ArrayList<>();

                        for (JsonNode attr : p.path("attributes")) {
                                String valor = attr.path("value_name").asText("");
                                if (valor.isBlank()) continue;
                                specs.add(new ProductDetailDTO.Spec(attr.path("name").asText(), valor));
                                if (specs.size() >= 12) break; // Limitar a 12 especificaciones
                        }
                        Precio precio = obtenerPrecio(id);

                        return new ProductDetailDTO(
                                id,
                                p.path("name").asText(),
                                imagenes,
                                p.path("short_description")
                                        .path("content")
                                        .asText(""),
                                specs,
                                precio != null
                                        ? precio.actual()
                                        : null,
                                precio != null
                                        ? precio.original()
                                        : null,
                                "https://www.mercadolibre.com.ar/p/"
                                        + id,
                                p.path("domain_id").asText(null)
                        );
                } catch (Exception e) {
                        throw new RuntimeException("Error al obtener el detalle del producto", e);
                }
        }

        /**
         * Representa precio actual + precio original.
         */
        private record Precio(BigDecimal actual, BigDecimal original) {}

        private Precio obtenerPrecio(String id) {
                try {
                        JsonNode items = objectMapper.readTree(meLiClient.getProductItems(id)).path("results");

                        for (JsonNode item : items) {
                                if (!"new".equals(item.path("condition").asText())) continue;
                                if (!item.path("price").isNumber()) continue;

                                BigDecimal original = item.path("original_price").isNumber()
                                        ? item.path("original_price").decimalValue() : null;
                                return new Precio(item.path("price").decimalValue(), original);
                        }
                        return null;

                } catch (HttpClientErrorException.NotFound e) {
                        return null;   // 404 = sin publicaciones activas, es normal: no se loguea
                } catch (Exception e) {
                        System.out.println("ERROR precio " + id + ": " + e.getMessage());
                        return null;
                }
        }
    private Map<String, String> leerSpecs(JsonNode producto) {
        Map<String, String> specs = new HashMap<>();
        for (JsonNode attr : producto.path("attributes")) {
            String valor = attr.path("value_name").asText("");
            if (!valor.isBlank()) specs.put(attr.path("id").asText(), valor);
        }
        return specs;
    }
}