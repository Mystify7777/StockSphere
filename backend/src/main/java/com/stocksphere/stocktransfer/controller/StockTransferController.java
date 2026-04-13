package com.stocksphere.stocktransfer.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.stocktransfer.dto.CreateStockTransferRequest;
import com.stocksphere.stocktransfer.dto.StockTransferResponse;
import com.stocksphere.stocktransfer.service.StockTransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock-transfers")
@RequiredArgsConstructor
public class StockTransferController {

    private final StockTransferService stockTransferService;

    @PostMapping
    public ResponseEntity<ApiResponse<StockTransferResponse>> transfer(@Valid @RequestBody CreateStockTransferRequest request,
                                                                       Authentication authentication) {
        StockTransferResponse response = stockTransferService.transfer(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Stock transferred successfully", response));
    }
}
