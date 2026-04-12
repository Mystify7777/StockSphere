package com.stocksphere.dashboard.service;

import com.stocksphere.dashboard.dto.DashboardSummaryResponse;
import com.stocksphere.product.entity.Product;
import com.stocksphere.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;

    public DashboardSummaryResponse getSummary(String ownerEmail) {
        List<Product> products = productRepository.findByShopOwnerEmail(ownerEmail);

        long totalProducts = products.size();
        long lowStockCount = products.stream()
                .filter(p -> p.getQty() <= p.getLowStockLimit())
                .count();

        BigDecimal inventoryValue = products.stream()
                .map(this::inventoryValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal potentialRevenue = products.stream()
                .map(this::potentialRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal estimatedProfit = potentialRevenue.subtract(inventoryValue);

        return new DashboardSummaryResponse(
                totalProducts,
                lowStockCount,
                inventoryValue,
                potentialRevenue,
                estimatedProfit
        );
    }

    private BigDecimal inventoryValue(Product product) {
        return product.getCostPrice().multiply(BigDecimal.valueOf(product.getQty()));
    }

    private BigDecimal potentialRevenue(Product product) {
        return product.getSellingPrice().multiply(BigDecimal.valueOf(product.getQty()));
    }
}
