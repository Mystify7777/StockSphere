package com.stocksphere.auth.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInMs,
        UUID userId,
        String name,
        String email,
        String role
) {
}
