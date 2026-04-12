package com.stocksphere.dashboard.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.dashboard.dto.DashboardSummaryResponse;
import com.stocksphere.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(Authentication authentication) {
        DashboardSummaryResponse summary = dashboardService.getSummary(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary fetched successfully", summary));
    }
}
