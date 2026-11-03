package store.apple.api.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import store.apple.api.dto.MeLiTokenResponse;
import store.apple.api.repository.MeLiTokenRepository;

import java.time.Instant;

@Service
public class MeLiTokenService {
    private final RestClient restClient;
    private final MeLiTokenRepository tokenRepository;
    
    private final String clientId;
    private final String clientSecret;

    private String accessToken;
    private String refreshToken;

    private Instant expiresAt;


    public MeLiTokenService(MeLiTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
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
        if (response.refreshToken() != null) {
            this.refreshToken = response.refreshToken();
        }
        this.expiresAt = Instant.now().plusSeconds(response.expiresIn() - 60);
        guardarTokens();
        System.out.println("Token renovado correctamente. Próxima renovación: " + expiresAt);
    }
    private void cargarTokens() {
        MeLiTokenRepository.TokenState state = tokenRepository.cargar();

        if (state != null) {
            this.accessToken = state.accessToken();
            this.refreshToken = state.refreshToken();
            this.expiresAt = state.expiresAt();

            System.out.println(
                    "Tokens de Mercado Libre cargados desde Supabase."
            );

            return;
        }

        // Primera ejecución
        this.accessToken = System.getenv("MELI_ACCESS_TOKEN");
        this.refreshToken = System.getenv("MELI_REFRESH_TOKEN");

        String expiresAtEnv = System.getenv("MELI_EXPIRES_AT");

        this.expiresAt = expiresAtEnv != null
                ? Instant.parse(expiresAtEnv)
                : Instant.now();

        if (refreshToken == null) {
            throw new IllegalStateException(
                    "Falta MELI_REFRESH_TOKEN"
            );
        }

        // Guardamos el estado inicial en Supabase
        tokenRepository.guardar(accessToken,refreshToken,expiresAt);
    }
    private void guardarTokens() {
        tokenRepository.guardar(
                accessToken,
                refreshToken,
                expiresAt
        );

        System.out.println(
                "Tokens guardados correctamente en Supabase."
        );
    }
}
