package com.aksi.api;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.Arrays;

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
        
        // Створюємо компоненти безпосередньо в конструкторі
        return new OpenAPI()
                .servers(getServers())
                .info(createApiInfo())
                .tags(getApiTags())
                .externalDocs(new ExternalDocumentation()
                        .description("Документація AKSI")
                        .url("https://docs.aksi.vn.ua"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .security(Collections.singletonList(new SecurityRequirement().addList(securitySchemeName)))
                .extensions(Collections.singletonMap("x-api-version", API_VERSION));
    }
    
    // Додаємо глобальні відповіді до всіх операцій
    // Використовуйте анотації @ApiResponse у контролерах для більш детальних відповідей
    
    private List<Server> getServers() {
        Server localServer = new Server()
                .url("http://localhost:8080/api")
                .description("Локальний сервер розробки");
                
        Server devServer = new Server()
                .url("https://dev.api.aksi.vn.ua")
                .description("Сервер розробки");
                
        Server prodServer = new Server()
                .url("https://api.aksi.vn.ua")
                .description("Продуктивний сервер");
                
        return Arrays.asList(localServer, devServer, prodServer);
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
                .name("Price Calculator")
                .description("API для розрахунку цін з урахуванням різних модифікаторів"),
            
            // Files & Resources
            new Tag()
                .name("Files API")
                .description("API для завантаження та отримання файлів")
        );
    }
}
