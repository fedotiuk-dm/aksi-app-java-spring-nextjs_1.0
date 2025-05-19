package com.aksi.api;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;

/**
 * Конфігурація Swagger/OpenAPI для документації API.
 */
@Configuration
public class SwaggerConfig {

    private static final String API_VERSION = "1.0.0";
    private static final String API_TITLE = "AKSI Cleaners API";
    private static final String API_DESCRIPTION = "REST API для системи управління хімчисткою AKSI";
    private static final String CONTACT_EMAIL = "support@aksi.vn.ua";
    private static final String CONTACT_URL = "https://aksi.vn.ua";
    private static final String LICENSE_NAME = "Proprietary";

    /**
     * Конфігурація OpenAPI для всього проекту.
     *
     * @return Конфігурація OpenAPI
     */
    @Bean
    public OpenAPI openAPI() {
        final String securitySchemeName = "bearerAuth";

        // Налаштування компонентів OpenAPI
        OpenAPI openAPI = new OpenAPI()
                .servers(createServersList())
                .info(createApiInfo())
                .tags(getApiTags())
                .externalDocs(new ExternalDocumentation()
                        .description("Повна документація AKSI")
                        .url("https://docs.aksi.vn.ua"));

        // Налаштовуємо компоненти OpenAPI
        openAPI.components(new io.swagger.v3.oas.models.Components()
            .addSecuritySchemes(securitySchemeName,
                new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("JWT токен для аутентифікації. Введіть 'Bearer' [пробіл] і отриманий токен."))
            .addSchemas("ErrorResponse", new io.swagger.v3.oas.models.media.Schema<>()
                .name("ErrorResponse")
                .type("object")
                .addProperty("timestamp", new io.swagger.v3.oas.models.media.DateTimeSchema()
                    .example("2023-01-01T12:00:00Z"))
                .addProperty("status", new io.swagger.v3.oas.models.media.IntegerSchema()
                    .example(400))
                .addProperty("error", new io.swagger.v3.oas.models.media.StringSchema()
                    .example("Bad Request"))
                .addProperty("message", new io.swagger.v3.oas.models.media.StringSchema()
                    .example("Invalid input data"))
                .addProperty("path", new io.swagger.v3.oas.models.media.StringSchema()
                    .example("/api/endpoint"))));

        // Додаємо безпеку
        openAPI.addSecurityItem(new SecurityRequirement().addList(securitySchemeName));

        // Додаємо версію API
        openAPI.extensions(Collections.singletonMap("x-api-version", API_VERSION));

        return openAPI;
    }

    // Додаємо глобальні відповіді до всіх операцій
    // Використовуйте анотації @ApiResponse у контролерах для більш детальних відповідей

    private List<Server> createServersList() {
        // Використовуємо Docker-ім'я сервісу для контейнерізованого середовища
        Server dockerServer = new Server()
                .url("http://backend:8080")
                .description("Docker сервер (використовується в контейнері)");

        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Локальний сервер розробки");

        Server devServer = new Server()
                .url("https://dev.api.aksi.vn.ua")
                .description("Сервер розробки");

        Server prodServer = new Server()
                .url("https://api.aksi.vn.ua")
                .description("Продуктивний сервер");

        return Arrays.asList(dockerServer, localServer, devServer, prodServer);
    }

    private Info createApiInfo() {
        return new Info()
                .title(API_TITLE)
                .description(API_DESCRIPTION)
                .version(API_VERSION)
                .contact(new Contact()
                        .name("AKSI Support")
                        .email(CONTACT_EMAIL)
                        .url(CONTACT_URL))
                .license(new License()
                        .name(LICENSE_NAME)
                        .url(CONTACT_URL + "/license"))
                .termsOfService(CONTACT_URL + "/terms");
    }

    private List<Tag> getApiTags() {
        return Arrays.asList(
            // Authentication & Security
            new Tag()
                .name("Authentication")
                .description("API для автентифікації та реєстрації користувачів"),

            // Core Entities
            new Tag()
                .name("Branch Locations API")
                .description("API для управління пунктами прийому замовлень"),

            new Tag()
                .name("Clients")
                .description("API для управління клієнтами"),

            // Orders
            new Tag()
                .name("Orders")
                .description("API для управління замовленнями"),

            // Order Wizard Components
            new Tag()
                .name("OrderFinalization")
                .description("API для завершення процесу оформлення замовлення"),

            new Tag()
                .name("Order Completion")
                .description("API для управління датами завершення замовлень"),

            new Tag()
                .name("Order Discounts")
                .description("API для управління знижками до замовлень"),

            new Tag()
                .name("Payment for Order")
                .description("API для роботи з оплатою замовлень"),

            new Tag()
                .name("Additional Requirements for Order")
                .description("API для роботи з додатковими вимогами та примітками до замовлення"),

            new Tag()
                .name("Order Summary")
                .description("API для отримання детального підсумку замовлення"),

            // Documents & Media
            new Tag()
                .name("CustomerSignature")
                .description("API для управління підписами клієнтів"),

            new Tag()
                .name("Receipt")
                .description("API для роботи з квитанціями замовлень"),

            new Tag()
                .name("Order Item Photos")
                .description("API для роботи з фотографіями предметів замовлення"),

            // Pricing & Catalog
            new Tag()
                .name("Price List")
                .description("API для роботи з прайс-листом хімчистки"),

            new Tag()
                .name("Service Category")
                .description("API для роботи з категоріями послуг"),

            new Tag()
                .name("Unit Of Measure")
                .description("API для роботи з одиницями виміру для предметів хімчистки"),

            new Tag()
                .name("Item Characteristics")
                .description("API для роботи з характеристиками предметів замовлення"),

            new Tag()
                .name("Price Calculation")
                .description("API для розрахунку цін з урахуванням різних модифікаторів"),

            // Files & Resources
            new Tag()
                .name("Files API")
                .description("API для завантаження та отримання файлів")
        );
    }
}
