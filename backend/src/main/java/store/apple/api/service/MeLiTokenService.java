package store.apple.api.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import store.apple.api.dto.MeLiTokenResponse;
import tools.jackson.databind.ObjectMapper;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

@Service
public class MeLiTokenService {
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private final String clientId;
    private final String clientSecret;

    private String accessToken;
    private String refreshToken;

    private Instant expiresAt;

    private static final Path TOKEN_FILE = Paths.get("data", "meli_token.json");

    public MeLiTokenService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.clientId = System.getenv("MELI_CLIENT_ID");
        this.clientSecret = System.getenv("MELI_CLIENT_SECRET");
        this.restClient = RestClient.builder().baseUrl("https://api.mercadolibre.com").build();

        if (clientId == null || clientSecret == null) {
            throw new IllegalStateException(
                    "Faltan variables de entorno de Mercado Libre"
            );
        }
        cargarTokens();
    }
    public synchronized String getAccessToken() {
        if (accessToken == null || tokenExpirado()) {
            renovarToken();
        }
        return accessToken;
    }
    private boolean tokenExpirado() {
        return Instant.now().isAfter(expiresAt);
    }
    private void renovarToken() {
        System.out.println("Renovando token de Mercado Libre...");

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("grant_type", "refresh_token");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", refreshToken);

        MeLiTokenResponse response = restClient.post().uri("/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(MeLiTokenResponse.class);
        if (response == null || response.accessToken() == null) {
            throw new RuntimeException("No se pudo renovar el token de MeLi");
        }
        this.accessToken = response.accessToken();
        this.refreshToken = response.refreshToken();
        this.expiresAt = Instant.now().plusSeconds(response.expiresIn() - 60);
        guardarTokens();
        System.out.println("Token renovado correctamente. Próxima renovación: " + expiresAt);
    }
    private void cargarTokens() {

        try {

            if (Files.exists(TOKEN_FILE)) {

                String json = Files.readString(TOKEN_FILE);
                TokenState state = objectMapper.readValue(json, TokenState.class);
                this.accessToken = state.accessToken();
                this.refreshToken = state.refreshToken();
                this.expiresAt = Instant.parse(state.expiresAt());

                System.out.println("Tokens de Mercado Libre cargados desde archivo.");
                return;
            }

            this.accessToken =
                    System.getenv("MELI_ACCESS_TOKEN");

            this.refreshToken = System.getenv("MELI_REFRESH_TOKEN");

            String expiresAtEnv = System.getenv("MELI_EXPIRES_AT");

            this.expiresAt = expiresAtEnv != null ? Instant.parse(expiresAtEnv) : Instant.now();

            if (refreshToken == null) {
                throw new IllegalStateException("Falta MELI_REFRESH_TOKEN");
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudieron cargar los tokens de Mercado Libre", e);
        }
    }
    private void guardarTokens() {
        try {
            Files.createDirectories(TOKEN_FILE.getParent());
            System.out.println(
                    "Guardando token en: " + TOKEN_FILE.toAbsolutePath()
            );
            TokenState state = new TokenState(accessToken, refreshToken, expiresAt.toString());

            String json = objectMapper.writeValueAsString(state);

            Files.writeString(TOKEN_FILE, json);
        } catch (Exception e) {
            throw new RuntimeException(
                    "No se pudieron guardar los tokens de Mercado Libre", e);
        }
    }
    private record TokenState(String accessToken, String refreshToken, String expiresAt) {}
}
