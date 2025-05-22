package com.aksi.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Тестовий контролер для перевірки OpenAPI.
 */
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Test", description = "Тестовий API для перевірки OpenAPI")
public class TestController {

    /**
     * Тестовий ендпоінт для перевірки OpenAPI.
     * @return тестова відповідь
     */
    @GetMapping("/hello")
    @Operation(
        summary = "Тестовий ендпоінт",
        description = "Повертає тестове привітання",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Успішна відповідь",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(
                        implementation = TestResponse.class
                    )
                )
            )
        }
    )
    public TestResponse hello() {
        log.debug("Викликано тестовий ендпоінт");
        return new TestResponse("Hello from AKSI API!");
    }

    /**
     * Тестова модель відповіді.
     */
    public static class TestResponse {
        private String message;

        public TestResponse() {
        }

        public TestResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
