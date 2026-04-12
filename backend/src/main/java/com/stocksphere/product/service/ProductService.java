package com.stocksphere.product.service;

import com.stocksphere.product.dto.CreateProductRequest;
import com.stocksphere.product.dto.ProductResponse;
import com.stocksphere.product.dto.UpdateProductRequest;
import com.stocksphere.product.dto.UpdateStockRequest;
import com.stocksphere.product.entity.Product;
import com.stocksphere.product.entity.ProductStatus;
import com.stocksphere.product.repository.ProductRepository;
import com.stocksphere.shop.entity.Shop;
import com.stocksphere.shop.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final int DEFAULT_LOW_STOCK_LIMIT = 5;

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;

    public ProductResponse createProduct(String ownerEmail, CreateProductRequest request) {
        Shop shop = shopRepository.findByIdAndOwnerEmail(request.shopId(), ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found or access denied"));

        Product product = new Product();
        product.setShop(shop);
        product.setName(request.name().trim());
        product.setSku(request.sku().trim());
        product.setQty(request.qty());
        product.setPrice(request.price());
        product.setLowStockLimit(request.lowStockLimit() == null ? DEFAULT_LOW_STOCK_LIMIT : request.lowStockLimit());
        product.setStatus(resolveStatus(product.getQty()));

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public List<ProductResponse> getProducts(String ownerEmail,
                                             UUID shopId,
                                             String search,
                                             boolean lowStockOnly,
                                             String sort) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByShopIdAndShopOwnerEmailAndNameContainingIgnoreCase(shopId, ownerEmail, search.trim());
        } else {
            products = productRepository.findByShopIdAndShopOwnerEmail(shopId, ownerEmail);
        }

        if (lowStockOnly) {
            products = products.stream()
                    .filter(p -> p.getQty() <= p.getLowStockLimit())
                    .toList();
        }

        Comparator<Product> comparator = switch (sort == null ? "" : sort) {
            case "qtyAsc" -> Comparator.comparing(Product::getQty);
            case "qtyDesc" -> Comparator.comparing(Product::getQty).reversed();
            case "nameDesc" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER).reversed();
            case "nameAsc" -> Comparator.comparing(Product::getName, String.CASE_INSENSITIVE_ORDER);
            default -> Comparator.comparing(Product::getCreatedAt).reversed();
        };

        return products.stream()
                .sorted(comparator)
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse updateProduct(String ownerEmail, UUID productId, UpdateProductRequest request) {
        Product product = productRepository.findByIdAndShopOwnerEmail(productId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));

        product.setName(request.name().trim());
        product.setSku(request.sku().trim());
        product.setQty(request.qty());
        product.setPrice(request.price());
        product.setLowStockLimit(request.lowStockLimit() == null ? product.getLowStockLimit() : request.lowStockLimit());
        product.setStatus(resolveStatus(product.getQty()));

        Product updated = productRepository.save(product);
        return toResponse(updated);
    }

    public void deleteProduct(String ownerEmail, UUID productId) {
        Product product = productRepository.findByIdAndShopOwnerEmail(productId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));
        productRepository.delete(product);
    }

    public ProductResponse patchStock(String ownerEmail, UUID productId, UpdateStockRequest request) {
        Product product = productRepository.findByIdAndShopOwnerEmail(productId, ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));

        int newQty = product.getQty() + request.delta();
        if (newQty < 0) {
            throw new IllegalArgumentException("Stock cannot go below zero");
        }

        product.setQty(newQty);
        product.setStatus(resolveStatus(newQty));

        Product updated = productRepository.save(product);
        return toResponse(updated);
    }

    private ProductStatus resolveStatus(int qty) {
        return qty == 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE;
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getShop().getId(),
                product.getName(),
                product.getSku(),
                product.getQty(),
                product.getPrice(),
                product.getLowStockLimit(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
