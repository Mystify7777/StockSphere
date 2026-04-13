package com.stocksphere.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProductionSafetyValidator implements ApplicationRunner {

    @Value("${APP_ENV:development}")
    private String appEnv;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${spring.jpa.hibernate.ddl-auto:update}")
    private String ddlAuto;

    @Value("${spring.jpa.show-sql:true}")
    private boolean showSql;

    @Override
    public void run(ApplicationArguments args) {
        boolean productionMode = "production".equalsIgnoreCase(appEnv);

        if (!productionMode) {
            return;
        }

        if (jwtSecret == null || jwtSecret.contains("change_this_to_long_random_secret")) {
            throw new IllegalStateException("Production startup blocked: configure a strong JWT_SECRET environment variable.");
        }

        if ("update".equalsIgnoreCase(ddlAuto)) {
            throw new IllegalStateException("Production startup blocked: JPA_DDL_AUTO=update is unsafe. Use validate or none.");
        }

        if (showSql) {
            throw new IllegalStateException("Production startup blocked: JPA_SHOW_SQL=true is not allowed in production.");
        }

        log.info("Production safety checks passed.");
    }
}
