package com.aksi.api;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * Контролер для перевірки стану API
 * Надає ендпоінт для перевірки доступності бекенду
 */
@RestController
@RequestMapping("/api/health")
@Slf4j
public class HealthCheckController {

    private final JdbcTemplate jdbcTemplate;
    private final Optional<BuildProperties> buildProperties;
    private final Optional<GitProperties> gitProperties;

    /**
     * Конструктор з опціональними залежностями для Build та Git властивостей
     */
    @Autowired
    public HealthCheckController(
            JdbcTemplate jdbcTemplate,
            @Autowired(required = false) BuildProperties buildProperties,
            @Autowired(required = false) GitProperties gitProperties) {
        this.jdbcTemplate = jdbcTemplate;
        this.buildProperties = Optional.ofNullable(buildProperties);
        this.gitProperties = Optional.ofNullable(gitProperties);
    }

    /**
     * Метод для перевірки стану API
     *
     * @return Інформація про стан API
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        log.debug("Перевірка стану API");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new Date().toString());
        response.put("service", "AKSI API");

        // Додаємо інформацію про версію, якщо доступна
        buildProperties.ifPresent(props -> {
            response.put("version", props.getVersion());
            response.put("build", Map.of(
                "time", props.getTime(),
                "artifact", props.getArtifact(),
                "name", props.getName(),
                "group", props.getGroup()
            ));
        });

        // Git інформація, якщо доступна
        gitProperties.ifPresent(props -> {
            response.put("git", Map.of(
                "branch", props.getBranch(),
                "commit", props.getShortCommitId(),
                "time", props.getCommitTime()
            ));
        });

        // Перевірка з'єднання з БД
        try {
            Integer dbStatus = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            response.put("database", Map.of(
                "status", dbStatus != null && dbStatus == 1 ? "UP" : "DOWN",
                "type", "PostgreSQL"
            ));
        } catch (org.springframework.dao.DataAccessException e) {
            log.error("Помилка при перевірці з'єднання з БД", e);
            response.put("database", Map.of(
                "status", "DOWN",
                "error", e.getMessage()
            ));
        }

        // Додаємо інформацію про JVM
        Runtime runtime = Runtime.getRuntime();
        response.put("memory", Map.of(
            "total", runtime.totalMemory() / (1024 * 1024) + "MB",
            "free", runtime.freeMemory() / (1024 * 1024) + "MB",
            "max", runtime.maxMemory() / (1024 * 1024) + "MB",
            "processors", runtime.availableProcessors()
        ));

        return ResponseEntity.ok(response);
    }

    /**
     * Спрощений ендпоінт для швидкої перевірки доступності
     *
     * @return Проста відповідь для перевірки з'єднання
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
