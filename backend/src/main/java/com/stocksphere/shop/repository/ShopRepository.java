package com.stocksphere.shop.repository;

import com.stocksphere.shop.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ShopRepository extends JpaRepository<Shop, UUID> {
    List<Shop> findByOwnerId(UUID ownerId);
}
