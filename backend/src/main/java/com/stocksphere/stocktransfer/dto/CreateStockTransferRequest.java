package com.stocksphere.stocktransfer.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record CreateStockTransferRequest(
        @NotNull(message = "productId is required") UUID productId,
        @NotNull(message = "fromShopId is required") UUID fromShopId,
        @NotNull(message = "toShopId is required") UUID toShopId,
        @NotNull(message = "quantity is required")
        @Positive(message = "quantity must be greater than 0") Integer quantity
) {
}
