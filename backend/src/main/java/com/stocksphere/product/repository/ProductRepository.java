package com.stocksphere.product.repository;

import com.stocksphere.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByShopIdAndShopOwnerEmail(UUID shopId, String ownerEmail);

    List<Product> findByShopIdAndShopOwnerEmailAndNameContainingIgnoreCase(UUID shopId, String ownerEmail, String name);

    Optional<Product> findByIdAndShopOwnerEmail(UUID id, String ownerEmail);
}
