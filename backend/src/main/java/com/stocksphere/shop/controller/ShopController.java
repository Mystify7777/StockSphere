package com.stocksphere.shop.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.shop.dto.CreateShopRequest;
import com.stocksphere.shop.dto.ShopResponse;
import com.stocksphere.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShopResponse>> createShop(@Valid @RequestBody CreateShopRequest request,
                                                                Authentication authentication) {
        ShopResponse created = shopService.createShop(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Shop created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShopResponse>>> getMyShops(Authentication authentication) {
        List<ShopResponse> shops = shopService.getMyShops(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Shops fetched successfully", shops));
    }
}
