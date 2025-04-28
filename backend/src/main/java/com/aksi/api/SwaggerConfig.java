package com.aksi.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.tags.Tag;

/**
 * Конфігурація Swagger/OpenAPI для документації API.
 */
@Configuration
public class SwaggerConfig {
    
    /**
     * Конфігурація OpenAPI для всього проекту.
     * 
     * @return Конфігурація OpenAPI
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("AKSI API")
                        .description("API для системи хімчистки AKSI")
                        .version("1.0")
                        .contact(new Contact()
                                .name("AKSI")
                                .url("https://aksi.vn.ua")
                                .email("aksi.vn.ua@gmail.com"))
                        .license(new License().name("Proprietary").url("https://aksi.vn.ua")))
                .addTagsItem(new Tag().name("Authentication").description("API для автентифікації та реєстрації користувачів"))
                .addTagsItem(new Tag().name("Branch Locations API").description("API для управління пунктами прийому замовлень"))
                .addTagsItem(new Tag().name("Clients").description("API для управління клієнтами"))
                .addTagsItem(new Tag().name("Orders").description("API для управління замовленнями"))
                .addTagsItem(new Tag().name("Price List").description("API для роботи з прайс-листом хімчистки"))
                .addTagsItem(new Tag().name("Service Category").description("API для роботи з категоріями послуг"))
                .addTagsItem(new Tag().name("Unit Of Measure").description("API для роботи з одиницями виміру для предметів хімчистки"))
                .addTagsItem(new Tag().name("Item Characteristics").description("API для роботи з характеристиками предметів замовлення"))
                .addTagsItem(new Tag().name("Price Calculator").description("API для розрахунку цін з урахуванням різних модифікаторів"))
                .addTagsItem(new Tag().name("Order Item Photos").description("API для роботи з фотографіями предметів замовлення"));
    }
}
