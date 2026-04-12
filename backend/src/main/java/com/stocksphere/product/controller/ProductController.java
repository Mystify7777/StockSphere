package com.stocksphere.product.controller;

import com.stocksphere.common.api.ApiResponse;
import com.stocksphere.product.dto.CreateProductRequest;
import com.stocksphere.product.dto.ProductResponse;
import com.stocksphere.product.dto.UpdateProductRequest;
import com.stocksphere.product.dto.UpdateStockRequest;
import com.stocksphere.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest request,
                                                               Authentication authentication) {
        ProductResponse response = productService.createProduct(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll(@RequestParam UUID shopId,
                                                                     @RequestParam(required = false) String search,
                                                                     @RequestParam(required = false) String category,
                                                                     @RequestParam(defaultValue = "false") boolean lowStockOnly,
                                                                     @RequestParam(required = false) String sort,
                                                                     Authentication authentication) {
        List<ProductResponse> products = productService.getProducts(authentication.getName(), shopId, search, category, lowStockOnly, sort);
        return ResponseEntity.ok(ApiResponse.success("Products fetched successfully", products));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> update(@PathVariable UUID id,
                                                               @Valid @RequestBody UpdateProductRequest request,
                                                               Authentication authentication) {
        ProductResponse response = productService.updateProduct(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id,
                                                    Authentication authentication) {
        productService.deleteProduct(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductResponse>> patchStock(@PathVariable UUID id,
                                                                   @Valid @RequestBody UpdateStockRequest request,
                                                                   Authentication authentication) {
        ProductResponse response = productService.patchStock(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Product stock updated successfully", response));
    }
}
