package com.stocksphere.stockmovement.repository;

import com.stocksphere.stockmovement.entity.StockMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findTop20ByShopIdOrderByCreatedAtDesc(UUID shopId);

    Page<StockMovement> findByShopIdOrderByCreatedAtDesc(UUID shopId, Pageable pageable);
}