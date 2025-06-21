package com.aksi.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

/**
 * Конфігурація OpenAPI документації для односторінкової системи замовлень хімчистки.
 *
 * Система включає 5 основних доменів: - Client: управління клієнтами - Order: управління
 * замовленнями - Item: управління предметами та послугами - Branch: управління філіями - Document:
 * генерація документів та квитанцій
 */
@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(
            new Info()
                .title("AKSI Dry Cleaning Order System API")
                .description(
                    "API для односторінкової системи замовлень хімчистки з DDD архітектурою")
                .version("1.0.0")
                .contact(
                    new Contact()
                        .name("AKSI Development Team")
                        .email("dev@aksi.com.ua")
                        .url("https://aksi.com.ua")))
        .servers(
            List.of(
                new Server().url("http://localhost:8080/api").description("Development server"),
                new Server().url("https://api.aksi.com.ua").description("Production server")));
  }
}
