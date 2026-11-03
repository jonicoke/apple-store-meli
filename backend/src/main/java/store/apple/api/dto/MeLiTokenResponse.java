package store.apple.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MeLiTokenResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("token_type") String tokenType,
        @JsonProperty("expires_in") long expiresIn,
        String scope,
        @JsonProperty("user_id") Long userId,
        @JsonProperty("refresh_token") String refreshToken
) {
}
