package com.aksi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація OpenAPI для документації API
 */
@Configuration
@OpenAPIDefinition(
    info = @io.swagger.v3.oas.annotations.info.Info(
        title = "AKSI API",
        version = "1.0",
        description = "API для системи керування клінінговою компанією AKSI",
        contact = @io.swagger.v3.oas.annotations.info.Contact(
            name = "AKSI Support",
            email = "support@aksi.com.ua"
        )
    )
)
@io.swagger.v3.oas.annotations.security.SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
    description = "JWT токен авторизації. Формат: Bearer {token}"
)
@Slf4j
public class OpenApiConfig {

    @Value("${server.servlet.context-path}")
    private String contextPath;

    /**
     * Налаштування OpenAPI для документації API
     */
    @Bean
    public OpenAPI customOpenAPI() {
        try {
            log.info("Ініціалізація OpenAPI конфігурації");
            log.debug("Використання контекстного шляху: {}", contextPath);
            
            // Визначення вимог безпеки
            SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("bearerAuth");
            
            // Сервери API
            List<Server> servers = Arrays.asList(
                new Server().url(contextPath).description("API Сервер"),
                new Server().url("http://localhost:8080" + contextPath).description("Локальний сервер")
            );
            
            // Створюємо об'єкт OpenAPI з інформацією про API
            return new OpenAPI()
                .info(new Info()
                    .title("AKSI API")
                    .description("API для системи керування клінінговою компанією AKSI")
                    .version("1.0")
                    .contact(new Contact()
                        .name("AKSI Support")
                        .email("support@aksi.com.ua"))
                    .license(new License()
                        .name("Apache 2.0")
                        .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(servers)
                .addSecurityItem(securityRequirement)
                .components(new Components()
                    .addSecuritySchemes("bearerAuth", 
                        new SecurityScheme()
                            .type(SecurityScheme.Type.HTTP)
                            .scheme("bearer")
                            .bearerFormat("JWT")
                            .description("JWT токен авторизації. Формат: Bearer {token}")
                    )
                );
            
        } catch (Exception e) {
            log.error("Помилка при створенні конфігурації OpenAPI: {}", e.getMessage(), e);
            throw e;
        }
    }
} 