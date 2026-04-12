package com.stocksphere.product.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateStockRequest(
        @NotNull(message = "Stock delta is required")
        Integer delta
) {
}
