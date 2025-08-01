package com.aksi.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Simple health check controller for testing API availability. */
@RestController
public class HealthController {

  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of(
        "status", "UP",
        "message", "AKSI Dry Cleaning API is running");
  }

  @GetMapping("/api/health")
  public Map<String, String> apiHealth() {
    return Map.of(
        "status", "UP",
        "api", "operational",
        "version", "1.0.0");
  }
}
