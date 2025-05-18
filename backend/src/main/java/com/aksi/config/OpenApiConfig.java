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
import io.swagger.v3.oas.models.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація OpenAPI для документації API.
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
     * Налаштування OpenAPI для документації API.
     * @return налаштована конфігурація OpenAPI для генерації документації Swagger
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
            OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                    .title("AKSI API")
                    .description("API для системи керування клінінговою компанією AKSI")
                    .version("1.0")
                    .contact(new Contact()
                        .name("AKSI Support")
                        .email("aksi.vn.ua@gmail.com"))
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
            
            // Додаємо додаткові теги для групування API
            openAPI.addTagsItem(new Tag().name("Orders").description("Операції із замовленнями"))
                   .addTagsItem(new Tag().name("OrderItems").description("Операції з елементами замовлень"))
                   .addTagsItem(new Tag().name("OrderCompletion").description("Операції з завершення замовлень"))
                   .addTagsItem(new Tag().name("OrderDiscounts").description("Операції із знижками до замовлень"))
                   .addTagsItem(new Tag().name("OrderFinalization").description("Операції фіналізації замовлень"));
            
            return openAPI;
            
        } catch (Exception e) {
            log.error("Помилка при створенні конфігурації OpenAPI: {}", e.getMessage(), e);
            throw e;
        }
    }
} 
