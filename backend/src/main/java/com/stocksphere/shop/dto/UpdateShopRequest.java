package com.stocksphere.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateShopRequest(
        @NotBlank(message = "Shop name is required")
        @Size(max = 120, message = "Shop name can be at most 120 characters")
        String name,

        Boolean publicStatus
) {
}
