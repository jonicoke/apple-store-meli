package store.apple.api.repository;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;

@Repository
public class MeLiTokenRepository {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MeLiTokenRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        String supabaseUrl = System.getenv("SUPABASE_URL");
        String secretKey = System.getenv("SUPABASE_SECRET_KEY");

        if (supabaseUrl == null || secretKey == null) {
            throw new IllegalStateException(
                    "Faltan SUPABASE_URL o SUPABASE_SECRET_KEY"
            );
        }

        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/rest/v1")
                .defaultHeader("apikey", secretKey)
                .defaultHeader("Authorization", "Bearer " + secretKey)
                .build();
    }

    public TokenState cargar() {
        try {
            String response = restClient.get()
                    .uri("/meli_tokens?id=eq.1&select=*")
                    .retrieve()
                    .body(String.class);

            JsonNode array = objectMapper.readTree(response);

            if (!array.isArray() || array.isEmpty()) {
                return null;
            }

            JsonNode row = array.get(0);

            return new TokenState(
                    row.path("access_token").asText(),
                    row.path("refresh_token").asText(),
                    Instant.parse(row.path("expires_at").asText())
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "No se pudieron cargar los tokens desde Supabase",
                    e
            );
        }
    }

    public void guardar(
            String accessToken,
            String refreshToken,
            Instant expiresAt
    ) {
        try {
            TokenPayload payload = new TokenPayload(
                    1L,
                    accessToken,
                    refreshToken,
                    expiresAt.toString()
            );

            restClient.post()
                    .uri("/meli_tokens?on_conflict=id")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Prefer", "resolution=merge-duplicates")
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

        } catch (Exception e) {
            throw new RuntimeException(
                    "No se pudieron guardar los tokens en Supabase",
                    e
            );
        }
    }

    public record TokenState(
            String accessToken,
            String refreshToken,
            Instant expiresAt
    ) {}

    private record TokenPayload(
            Long id,
            String access_token,
            String refresh_token,
            String expires_at
    ) {}
}