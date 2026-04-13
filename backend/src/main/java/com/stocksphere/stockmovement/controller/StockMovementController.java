package com.stocksphere.stockmovement.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.stockmovement.dto.StockMovementResponse;
import com.stocksphere.stockmovement.service.StockMovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockMovementResponse>>> getRecentMovements(@RequestParam UUID shopId,
                                                                                        Authentication authentication) {
        List<StockMovementResponse> movements = stockMovementService.getRecentMovements(authentication.getName(), shopId);
        return ResponseEntity.ok(ApiResponse.success("Stock movements fetched successfully", movements));
    }
}