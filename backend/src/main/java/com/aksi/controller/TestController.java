package com.aksi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.sentry.Sentry;
import lombok.extern.slf4j.Slf4j;

/**
 * Test controller for testing GlitchTip error monitoring
 */
@RestController
@RequestMapping("/api/test")
@Slf4j
public class TestController {

    @GetMapping("/error")
    public ResponseEntity<String> testError() {
        log.info("Testing GlitchTip error monitoring - generating test error");

        try {
            // Generate different types of errors for testing
            throw new RuntimeException("Test error from Spring Boot for GlitchTip monitoring");
        } catch (Exception e) {
            log.error("Test error generated for GlitchTip monitoring", e);

            // Send exception to GlitchTip via Sentry
            Sentry.captureException(e);

            return ResponseEntity.ok("Test error sent to GlitchTip!");
        }
    }

    @GetMapping("/success")
    public ResponseEntity<String> testSuccess() {
        log.info("Testing GlitchTip - success response logged");

        // Send message to GlitchTip
        Sentry.captureMessage("Test success message from Spring Boot backend", io.sentry.SentryLevel.INFO);

        return ResponseEntity.ok("Success! Message sent to GlitchTip");
    }

    @GetMapping("/performance")
    public ResponseEntity<String> testPerformance() throws InterruptedException {
        log.info("Testing GlitchTip performance monitoring - simulating slow operation");
        Thread.sleep(100); // Simulate slow operation
        log.info("Performance test completed");
        return ResponseEntity.ok("Performance test completed");
    }
}
