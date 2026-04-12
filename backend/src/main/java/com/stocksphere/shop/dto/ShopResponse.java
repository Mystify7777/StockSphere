package com.stocksphere.shop.dto;

import java.time.Instant;
import java.util.UUID;

public record ShopResponse(
        UUID id,
        UUID ownerId,
        String name,
        boolean publicStatus,
        Instant createdAt
) {
}
