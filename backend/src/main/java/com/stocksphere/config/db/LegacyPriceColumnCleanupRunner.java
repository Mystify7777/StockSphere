package com.stocksphere.config.db;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class LegacyPriceColumnCleanupRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM information_schema.columns
                    WHERE table_schema = DATABASE()
                      AND table_name = 'products'
                      AND column_name = 'price'
                    """,
                    Integer.class
            );

            if (count != null && count > 0) {
                jdbcTemplate.execute("ALTER TABLE products DROP COLUMN price");
                log.info("Legacy column products.price dropped successfully");
            }
        } catch (Exception ex) {
            log.warn("Could not drop legacy products.price column automatically: {}", ex.getMessage());
        }
    }
}
