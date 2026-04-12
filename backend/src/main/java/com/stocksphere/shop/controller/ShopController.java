package com.stocksphere.shop.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.shop.dto.CreateShopRequest;
import com.stocksphere.shop.dto.ShopResponse;
import com.stocksphere.shop.dto.UpdateShopRequest;
import com.stocksphere.shop.service.ShopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

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

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponse>> updateShop(@PathVariable UUID id,
                                                                @Valid @RequestBody UpdateShopRequest request,
                                                                Authentication authentication) {
        ShopResponse updated = shopService.updateShop(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Shop updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShop(@PathVariable UUID id,
                                                        Authentication authentication) {
        shopService.deleteShop(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Shop deleted successfully", null));
    }
}
