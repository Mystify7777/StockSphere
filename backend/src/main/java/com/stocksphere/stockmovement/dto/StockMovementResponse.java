package com.stocksphere.stockmovement.dto;

import java.time.Instant;
import java.util.UUID;

public record StockMovementResponse(
        UUID id,
        UUID shopId,
        UUID productId,
        String productName,
        String sku,
        String actorEmail,
        String movementType,
        Integer beforeQty,
        Integer afterQty,
        Integer delta,
        String reason,
        Instant createdAt
) {
}