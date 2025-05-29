package com.aksi.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * Custom error controller для dev-режиму.
 * Повертає статичну HTML сторінку без використання Vaadin infrastructure.
 */
@Controller
@Profile("dev")
@ConditionalOnProperty(name = "vaadin.devmode.enabled", havingValue = "true", matchIfMissing = true)
@Slf4j
public class DevErrorController implements ErrorController {

    @RequestMapping("/error")
    @ResponseBody
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        boolean isStateTreeError = false;
        if (exception != null && exception instanceof Exception) {
            Exception ex = (Exception) exception;
            if (ex.getMessage() != null &&
                (ex.getMessage().contains("Unregistered node") ||
                 ex.getMessage().contains("tree is most likely corrupted"))) {
                isStateTreeError = true;
                log.debug("StateTree error handled: {}", ex.getMessage());
            }
        }

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            log.debug("Handling error with status: {}, isStateTreeError: {}", statusCode, isStateTreeError);
        }

        // Повертаємо статичну HTML сторінку
        return generateErrorPage(isStateTreeError);
    }

    @RequestMapping("/dev-error")
    @ResponseBody
    public String devError() {
        return generateErrorPage(true);
    }

    private String generateErrorPage(boolean isStateTreeError) {
        String title = isStateTreeError ? "Режим розробки - StateTree помилка" : "Помилка розробки";
        String message = isStateTreeError
            ? "Виявлено технічну помилку Vaadin StateTree в режимі розробки. " +
              "Це нормальне явище при використанні hot-reload. " +
              "Функціональність додатка не постраждала."
            : "Виникла помилка в режимі розробки. Спробуйте оновити сторінку.";

        return """
            <!DOCTYPE html>
            <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                        color: #333;
                    }
                    .container {
                        background: white;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    h1 {
                        color: #2196F3;
                        margin-bottom: 20px;
                    }
                    p {
                        line-height: 1.6;
                        margin-bottom: 25px;
                    }
                    .buttons {
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    button {
                        background: #2196F3;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background-color 0.2s;
                    }
                    button:hover {
                        background: #1976D2;
                    }
                    .secondary {
                        background: #757575;
                    }
                    .secondary:hover {
                        background: #616161;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>%s</h1>
                    <p>%s</p>
                    <div class="buttons">
                        <button onclick="window.location.reload()">Оновити сторінку</button>
                        <button class="secondary" onclick="window.location.href='/'">На головну</button>
                        <button class="secondary" onclick="window.location.href='/order-wizard'">Order Wizard</button>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(title, title, message);
    }
}
