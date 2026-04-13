package com.stocksphere.stocktransfer.dto;

import java.time.Instant;
import java.util.UUID;

public record StockTransferResponse(
        UUID sourceProductId,
        UUID destinationProductId,
        UUID fromShopId,
        UUID toShopId,
        String sku,
        Integer quantity,
        Integer sourceQtyAfter,
        Integer destinationQtyAfter,
        Instant transferredAt
) {
}
