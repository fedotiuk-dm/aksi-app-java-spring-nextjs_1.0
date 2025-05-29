package com.aksi.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Контролер для перенаправлення на Swagger UI
 */
@Controller
public class SwaggerRedirectController {

    @GetMapping("/docs")
    public ModelAndView redirectToSwagger() {
        return new ModelAndView("redirect:/swagger-ui.html");
    }

    @GetMapping("/api-docs")
    public ModelAndView redirectToApiDocs() {
        return new ModelAndView("redirect:/v3/api-docs");
    }

    @GetMapping("/swagger")
    public ModelAndView redirectSwagger() {
        return new ModelAndView("redirect:/swagger-ui.html");
    }
}
