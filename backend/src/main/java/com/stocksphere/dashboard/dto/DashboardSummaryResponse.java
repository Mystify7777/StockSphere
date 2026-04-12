package com.stocksphere.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long totalProducts,
        long lowStockCount,
        BigDecimal inventoryValue,
        BigDecimal potentialRevenue,
        BigDecimal estimatedProfit
) {
}
