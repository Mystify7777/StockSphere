package com.stocksphere.stockmovement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "stock_movements", indexes = {
        @Index(name = "idx_stock_movements_shop_id_created_at", columnList = "shop_id,created_at")
})
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "shop_id", nullable = false)
    private UUID shopId;

    @Column(name = "product_id")
    private UUID productId;

    @Column(name = "product_name", nullable = false, length = 140)
    private String productName;

    @Column(nullable = false, length = 80)
    private String sku;

    @Column(name = "actor_email", nullable = false, length = 180)
    private String actorEmail;

    @Column(name = "movement_type", nullable = false, length = 40)
    private String movementType;

    @Column(name = "before_qty", nullable = false)
    private Integer beforeQty;

    @Column(name = "after_qty", nullable = false)
    private Integer afterQty;

    @Column(nullable = false)
    private Integer delta;

    @Column(nullable = false, length = 160)
    private String reason;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @jakarta.persistence.PrePersist
    public void prePersist() {
        createdAt = Instant.now();
    }
}