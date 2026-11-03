package store.apple.api.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import store.apple.api.service.MeLiTokenService;

import java.util.List;

/****
 *  MeLiClient ¿Qué es y qué necesita?
 *  Es un Componente; necesita:
 *  1. Inicializar el RestClient
 *  2. en su constructor, buildear la url de la api con el header (su respectivo key/value)
 *  3. métodos de búsqueda (searchProducts) con sus queryParam y su path("/products/search")
 * **/
@Component
public class MeLiClient {
    private final RestClient restClient;
    private final MeLiTokenService tokenService;

    public MeLiClient(MeLiTokenService tokenService){
        this.tokenService = tokenService;
        this.restClient = RestClient.builder().baseUrl("https://api.mercadolibre.com").build();
    }
    public String searchProducts(String q) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/products/search")
                        .queryParam("status", "active")
                        .queryParam("site_id", "MLA")
                        .queryParam("limit", 20)
                        .queryParam("q", q)
                        .build())
                .header("Authorization", "Bearer " + tokenService.getAccessToken())
                .retrieve().body(String.class);
    }
    public String searchCategory(String q) {
        return restClient.get().uri(uriBuilder -> uriBuilder.path("/sites/MLA/domain_discovery/search")
                        .queryParam("q", q)
                        .build())
                .header("Authorization", "Bearer " + tokenService.getAccessToken())
                .retrieve().body((String.class));
    }
    public String searchProductsByCategory(String q, String categoryId) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/products/search")
                        .queryParam("status", "active")
                        .queryParam("site_id", "MLA")
                        .queryParam("q", q)
                        .queryParam("domain_id", categoryId)
                        .queryParam("limit", 30)
                        .build())
                .header("Authorization", "Bearer " + tokenService.getAccessToken())
                .retrieve().body(String.class);
    }
    public String getProduct(String productId) {
        return restClient.get()
                .uri("/products/{id}", productId)
                .header("Authorization", "Bearer " + tokenService.getAccessToken())
                .retrieve()
                .body(String.class);
    }
    public String getProductItems(String productId) {
        return restClient.get()
                .uri("/products/{id}/items", productId)
                .header("Authorization", "Bearer " + tokenService.getAccessToken())
                .retrieve()
                .body(String.class);
    }
}
