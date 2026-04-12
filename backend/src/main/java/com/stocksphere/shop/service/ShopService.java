package com.stocksphere.shop.service;

import com.stocksphere.shop.dto.CreateShopRequest;
import com.stocksphere.shop.dto.ShopResponse;
import com.stocksphere.shop.dto.UpdateShopRequest;
import com.stocksphere.shop.entity.Shop;
import com.stocksphere.shop.repository.ShopRepository;
import com.stocksphere.user.entity.User;
import com.stocksphere.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopResponse createShop(String ownerEmail, CreateShopRequest request) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        Shop shop = new Shop();
        shop.setOwner(owner);
        shop.setName(request.name().trim());
        shop.setPublicStatus(Boolean.TRUE.equals(request.publicStatus()));

        Shop saved = shopRepository.save(shop);
        return toResponse(saved);
    }

    public List<ShopResponse> getMyShops(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found"));

        return shopRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ShopResponse updateShop(String ownerEmail, UUID shopId, UpdateShopRequest request) {
        Shop shop = shopRepository.findByIdAndOwnerEmail(shopId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found or access denied"));

        shop.setName(request.name().trim());
        if (request.publicStatus() != null) {
            shop.setPublicStatus(request.publicStatus());
        }

        Shop updated = shopRepository.save(shop);
        return toResponse(updated);
    }

    public void deleteShop(String ownerEmail, UUID shopId) {
        Shop shop = shopRepository.findByIdAndOwnerEmail(shopId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found or access denied"));
        shopRepository.delete(shop);
    }

    private ShopResponse toResponse(Shop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getOwner().getId(),
                shop.getName(),
                shop.isPublicStatus(),
                shop.getCreatedAt()
        );
    }
}
