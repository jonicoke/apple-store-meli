package store.apple.api.dto;

import java.math.BigDecimal;
import java.util.Map;

public record ProductDTO(
        String id,
        String nombre,
        String imagen,
        BigDecimal precio,
        BigDecimal precioOriginal,
        String enlaceCompra,
        String categoria,
        Map<String, String> specs
) {}