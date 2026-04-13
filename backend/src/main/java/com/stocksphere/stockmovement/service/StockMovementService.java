package com.stocksphere.stockmovement.service;

import com.stocksphere.shop.repository.ShopRepository;
import com.stocksphere.stockmovement.dto.StockMovementResponse;
import com.stocksphere.stockmovement.entity.StockMovement;
import com.stocksphere.stockmovement.repository.StockMovementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;
    private final ShopRepository shopRepository;

    public void recordMovement(UUID shopId,
                               UUID productId,
                               String productName,
                               String sku,
                               String actorEmail,
                               String movementType,
                               int beforeQty,
                               int afterQty,
                               String reason) {
        StockMovement movement = new StockMovement();
        movement.setShopId(shopId);
        movement.setProductId(productId);
        movement.setProductName(productName);
        movement.setSku(sku);
        movement.setActorEmail(actorEmail);
        movement.setMovementType(movementType);
        movement.setBeforeQty(beforeQty);
        movement.setAfterQty(afterQty);
        movement.setDelta(afterQty - beforeQty);
        movement.setReason(reason);
        stockMovementRepository.save(movement);
    }

    public List<StockMovementResponse> getRecentMovements(String ownerEmail, UUID shopId) {
        shopRepository.findByIdAndOwnerEmail(shopId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found or access denied"));

        return stockMovementRepository.findTop20ByShopIdOrderByCreatedAtDesc(shopId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private StockMovementResponse toResponse(StockMovement movement) {
        return new StockMovementResponse(
                movement.getId(),
                movement.getShopId(),
                movement.getProductId(),
                movement.getProductName(),
                movement.getSku(),
                movement.getActorEmail(),
                movement.getMovementType(),
                movement.getBeforeQty(),
                movement.getAfterQty(),
                movement.getDelta(),
                movement.getReason(),
                movement.getCreatedAt()
        );
    }
}