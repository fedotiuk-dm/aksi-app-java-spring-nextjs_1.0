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
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація OpenAPI для документації API.
 */
@Configuration
@OpenAPIDefinition(
    info = @io.swagger.v3.oas.annotations.info.Info(
        title = "AKSI API",
        version = "1.0.0",
        description = "API для системи керування клінінговою компанією AKSI",
        contact = @io.swagger.v3.oas.annotations.info.Contact(
            name = "AKSI Support",
            email = "aksi.vn.ua@gmail.com"
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

    @Value("${server.servlet.context-path:/api}")
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

            // Список серверів - використовуємо порожні URL щоб уникнути конфліктів
            List<Server> servers = Arrays.asList(
                new Server().url("").description("Поточний сервер")
            );

            // Створюємо об'єкт OpenAPI з інформацією про API
            OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                    .title("AKSI API")
                    .description("API для системи керування хімчисткою AKSI")
                    .version("1.0.0")
                    .contact(new Contact()
                        .name("AKSI Support")
                        .email("aksi.vn.ua@gmail.com"))
                    .license(new License()
                        .name("Proprietary")
                        .url("https://aksi.vn.ua")))
                .servers(servers)
                .addSecurityItem(securityRequirement);

            // Налаштовуємо компоненти та схему помилок
            Components components = new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT токен авторизації. Формат: Bearer {token}")
                )
                .addSchemas("ErrorResponse", new Schema<>()
                    .name("ErrorResponse")
                    .type("object")
                    .description("Інформація про помилку з часовою міткою у форматі ISO-8601")
                    .addProperty("timestamp", new StringSchema()
                        .example("2023-01-01T12:00:00Z"))
                    .addProperty("status", new IntegerSchema()
                        .example(400))
                    .addProperty("error", new StringSchema()
                        .example("Bad Request"))
                    .addProperty("message", new StringSchema()
                        .example("Invalid input data"))
                    .addProperty("path", new StringSchema()
                        .example("/api/endpoint")));

            openAPI.components(components);

            return openAPI;

        } catch (Exception e) {
            log.error("Помилка при створенні конфігурації OpenAPI: {}", e.getMessage(), e);
            throw e;
        }
    }
}
