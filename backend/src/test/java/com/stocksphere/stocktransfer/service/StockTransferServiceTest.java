package com.stocksphere.stocktransfer.service;

import com.stocksphere.product.entity.Product;
import com.stocksphere.product.entity.ProductStatus;
import com.stocksphere.product.repository.ProductRepository;
import com.stocksphere.shop.entity.Shop;
import com.stocksphere.shop.repository.ShopRepository;
import com.stocksphere.stockmovement.entity.StockMovement;
import com.stocksphere.stockmovement.entity.StockMovementType;
import com.stocksphere.stockmovement.repository.StockMovementRepository;
import com.stocksphere.stocktransfer.dto.CreateStockTransferRequest;
import com.stocksphere.stocktransfer.dto.StockTransferResponse;
import com.stocksphere.user.entity.Role;
import com.stocksphere.user.entity.User;
import com.stocksphere.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class StockTransferServiceTest {

    @Autowired
    private StockTransferService stockTransferService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockMovementRepository stockMovementRepository;

    private String ownerEmail;
    private Shop shopA;
    private Shop shopB;
    private Shop foreignShop;

    @BeforeEach
    void setUp() {
        ownerEmail = "owner@test.com";

        User owner = new User();
        owner.setName("Owner");
        owner.setEmail(ownerEmail);
        owner.setPassword("encoded");
        owner.setRole(Role.ROLE_OWNER);
        owner = userRepository.save(owner);

        User anotherOwner = new User();
        anotherOwner.setName("Other Owner");
        anotherOwner.setEmail("other@test.com");
        anotherOwner.setPassword("encoded");
        anotherOwner.setRole(Role.ROLE_OWNER);
        anotherOwner = userRepository.save(anotherOwner);

        shopA = createShop(owner, "Shop A");
        shopB = createShop(owner, "Shop B");
        foreignShop = createShop(anotherOwner, "Foreign Shop");
    }

    @Test
    void transfer_success_createsAuditLogs_andUpdatesQuantities() {
        Product source = createProduct(shopA, "Rice", "SKU-1", 50);

        CreateStockTransferRequest request = new CreateStockTransferRequest(
                source.getId(),
                shopA.getId(),
                shopB.getId(),
                10
        );

        StockTransferResponse response = stockTransferService.transfer(request, ownerEmail);

        Product sourceAfter = productRepository.findById(source.getId()).orElseThrow();
        Product destinationAfter = productRepository.findById(response.destinationProductId()).orElseThrow();

        assertEquals(40, sourceAfter.getQty());
        assertEquals(10, destinationAfter.getQty());
        assertEquals(shopB.getId(), destinationAfter.getShop().getId());

        List<StockMovement> movements = stockMovementRepository.findAll();
        assertEquals(2, movements.size());
        assertTrue(movements.stream().anyMatch(m -> m.getMovementType() == StockMovementType.TRANSFER_OUT));
        assertTrue(movements.stream().anyMatch(m -> m.getMovementType() == StockMovementType.TRANSFER_IN));
    }

    @Test
    void transfer_insufficientStock_throws() {
        Product source = createProduct(shopA, "Rice", "SKU-1", 5);

        CreateStockTransferRequest request = new CreateStockTransferRequest(
                source.getId(),
                shopA.getId(),
                shopB.getId(),
                6
        );

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> stockTransferService.transfer(request, ownerEmail)
        );

        assertEquals("Insufficient stock", ex.getMessage());
        assertEquals(0, stockMovementRepository.count());
    }

    @Test
    void transfer_sameShopBlocked_throws() {
        Product source = createProduct(shopA, "Rice", "SKU-1", 5);

        CreateStockTransferRequest request = new CreateStockTransferRequest(
                source.getId(),
                shopA.getId(),
                shopA.getId(),
                2
        );

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> stockTransferService.transfer(request, ownerEmail)
        );

        assertEquals("Source and destination shop cannot be same", ex.getMessage());
        assertEquals(0, stockMovementRepository.count());
    }

    @Test
    void transfer_destinationMergeBySku_reusesExistingProduct() {
        Product source = createProduct(shopA, "Rice", "SKU-1", 50);
        Product destination = createProduct(shopB, "Rice", "SKU-1", 7);

        CreateStockTransferRequest request = new CreateStockTransferRequest(
                source.getId(),
                shopA.getId(),
                shopB.getId(),
                9
        );

        StockTransferResponse response = stockTransferService.transfer(request, ownerEmail);

        Product sourceAfter = productRepository.findById(source.getId()).orElseThrow();
        Product destinationAfter = productRepository.findById(destination.getId()).orElseThrow();

        assertEquals(destination.getId(), response.destinationProductId());
        assertEquals(41, sourceAfter.getQty());
        assertEquals(16, destinationAfter.getQty());

        long sameSkuInDest = productRepository.findByShopIdAndShopOwnerEmail(shopB.getId(), ownerEmail)
                .stream()
                .filter(p -> "SKU-1".equals(p.getSku()))
                .count();

        assertEquals(1, sameSkuInDest);
    }

    @Test
    void transfer_unauthorizedDestinationShopBlocked_throws() {
        Product source = createProduct(shopA, "Rice", "SKU-1", 20);

        CreateStockTransferRequest request = new CreateStockTransferRequest(
                source.getId(),
                shopA.getId(),
                foreignShop.getId(),
                5
        );

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> stockTransferService.transfer(request, ownerEmail)
        );

        assertEquals("Destination shop not found or access denied", ex.getMessage());
        assertEquals(0, stockMovementRepository.count());
    }

    private Shop createShop(User owner, String name) {
        Shop shop = new Shop();
        shop.setOwner(owner);
        shop.setName(name);
        shop.setPublicStatus(false);
        return shopRepository.save(shop);
    }

    private Product createProduct(Shop shop, String name, String sku, int qty) {
        Product product = new Product();
        product.setShop(shop);
        product.setName(name);
        product.setSku(sku);
        product.setQty(qty);
        product.setCostPrice(BigDecimal.valueOf(100));
        product.setSellingPrice(BigDecimal.valueOf(130));
        product.setCategory("General");
        product.setLowStockLimit(5);
        product.setStatus(qty == 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE);
        return productRepository.save(product);
    }
}
