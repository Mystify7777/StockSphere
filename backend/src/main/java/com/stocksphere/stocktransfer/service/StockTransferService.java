package com.stocksphere.stocktransfer.service;

import com.stocksphere.product.entity.Product;
import com.stocksphere.product.entity.ProductStatus;
import com.stocksphere.product.repository.ProductRepository;
import com.stocksphere.shop.entity.Shop;
import com.stocksphere.shop.repository.ShopRepository;
import com.stocksphere.stockmovement.entity.StockMovementType;
import com.stocksphere.stockmovement.service.StockMovementService;
import com.stocksphere.stocktransfer.dto.CreateStockTransferRequest;
import com.stocksphere.stocktransfer.dto.StockTransferResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class StockTransferService {

    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final StockMovementService stockMovementService;

    @Transactional
    public StockTransferResponse transfer(CreateStockTransferRequest request, String ownerEmail) {
                if (request.quantity() == null || request.quantity() <= 0) {
                        throw new IllegalArgumentException("Quantity must be greater than zero");
                }

        if (request.fromShopId().equals(request.toShopId())) {
            throw new IllegalArgumentException("Source and destination shop cannot be same");
        }

        Shop fromShop = shopRepository.findByIdAndOwnerEmail(request.fromShopId(), ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Source shop not found or access denied"));

        Shop toShop = shopRepository.findByIdAndOwnerEmail(request.toShopId(), ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Destination shop not found or access denied"));

        Product sourceProduct = productRepository
                .findByIdAndShopIdAndShopOwnerEmail(request.productId(), fromShop.getId(), ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Source product not found or access denied"));

        if (sourceProduct.getQty() < request.quantity()) {
            throw new IllegalArgumentException("Insufficient stock");
        }

        Product destinationProduct = productRepository
                .findByShopIdAndSku(toShop.getId(), sourceProduct.getSku())
                .orElseGet(() -> createDestinationCopy(sourceProduct, toShop));

        int sourceQtyBefore = sourceProduct.getQty();
        int destinationQtyBefore = destinationProduct.getQty();

        int sourceQtyAfter = sourceQtyBefore - request.quantity();
        int destinationQtyAfter = destinationQtyBefore + request.quantity();

        sourceProduct.setQty(sourceQtyAfter);
        sourceProduct.setStatus(resolveStatus(sourceQtyAfter));

        destinationProduct.setQty(destinationQtyAfter);
        destinationProduct.setStatus(resolveStatus(destinationQtyAfter));

        productRepository.save(sourceProduct);
        Product savedDestination = productRepository.save(destinationProduct);

        stockMovementService.recordMovement(
                fromShop.getId(),
                sourceProduct.getId(),
                sourceProduct.getName(),
                sourceProduct.getSku(),
                ownerEmail,
                StockMovementType.TRANSFER_OUT,
                sourceQtyBefore,
                sourceQtyAfter,
                "Transfer to shop " + toShop.getName()
        );

        stockMovementService.recordMovement(
                toShop.getId(),
                savedDestination.getId(),
                savedDestination.getName(),
                savedDestination.getSku(),
                ownerEmail,
                StockMovementType.TRANSFER_IN,
                destinationQtyBefore,
                destinationQtyAfter,
                "Transfer from shop " + fromShop.getName()
        );

        return new StockTransferResponse(
                sourceProduct.getId(),
                savedDestination.getId(),
                fromShop.getId(),
                toShop.getId(),
                sourceProduct.getSku(),
                request.quantity(),
                sourceQtyAfter,
                destinationQtyAfter,
                Instant.now()
        );
    }

    private Product createDestinationCopy(Product sourceProduct, Shop toShop) {
        Product copy = new Product();
        copy.setShop(toShop);
        copy.setName(sourceProduct.getName());
        copy.setSku(sourceProduct.getSku());
        copy.setQty(0);
        copy.setCostPrice(sourceProduct.getCostPrice());
        copy.setSellingPrice(sourceProduct.getSellingPrice());
        copy.setCategory(sourceProduct.getCategory());
        copy.setLowStockLimit(sourceProduct.getLowStockLimit());
        copy.setStatus(resolveStatus(0));
        return copy;
    }

    private ProductStatus resolveStatus(int qty) {
        return qty == 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE;
    }
}
