package com.stocksphere.product.dto;

import com.stocksphere.product.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        UUID shopId,
        String name,
        String sku,
        Integer qty,
        BigDecimal costPrice,
        BigDecimal sellingPrice,
        String category,
        Integer lowStockLimit,
        ProductStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
