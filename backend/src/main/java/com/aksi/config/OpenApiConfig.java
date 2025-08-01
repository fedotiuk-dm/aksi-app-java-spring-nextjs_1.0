package com.aksi.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

/**
 * OpenAPI configuration for AKSI Dry Cleaning Order System. Provides API documentation and Swagger
 * UI.
 */
@Configuration
public class OpenApiConfig {

  @Value("${app.contact-url:https://aksi.vn.ua}")
  private String contactUrl;

  @Value("${app.dev-server-url:http://localhost:8080}")
  private String devServerUrl;

  @Value("${app.prod-server-url:https://api.aksi.vn.ua}")
  private String prodServerUrl;

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("AKSI Dry Cleaning Order System API")
                .description(
                    "API for dry cleaning order management system with Domain-Driven Design architecture. "
                        + "The system includes 13 domains: Auth, User, Customer, Branch, Employee, Order, "
                        + "OrderItem, Service, Garment, Pricing, Payment, Notification, and Analytics.")
                .version("1.0.0")
                .contact(
                    new Contact()
                        .name("AKSI Development Team")
                        .email("dev@aksi.com.ua")
                        .url(contactUrl)))
        .servers(
            List.of(
                new Server().url(devServerUrl).description("Development server"),
                new Server().url(prodServerUrl).description("Production server")));
  }
}
