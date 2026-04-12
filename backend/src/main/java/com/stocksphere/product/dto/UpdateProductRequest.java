package com.stocksphere.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 140, message = "Product name can be at most 140 characters")
        String name,

        @NotBlank(message = "SKU is required")
        @Size(max = 80, message = "SKU can be at most 80 characters")
        String sku,

        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        Integer qty,

        @NotNull(message = "Cost price is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Cost price cannot be negative")
        BigDecimal costPrice,

        @NotNull(message = "Selling price is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Selling price cannot be negative")
        BigDecimal sellingPrice,

        @NotBlank(message = "Category is required")
        @Size(max = 100, message = "Category can be at most 100 characters")
        String category,

        @Min(value = 1, message = "Low stock limit must be at least 1")
        Integer lowStockLimit
) {
}
