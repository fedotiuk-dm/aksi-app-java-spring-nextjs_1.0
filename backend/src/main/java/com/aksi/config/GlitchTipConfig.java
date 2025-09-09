package com.aksi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import io.sentry.Sentry;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

/**
 * GlitchTip (Sentry) configuration for error monitoring and performance tracking.
 * Uses Sentry Java SDK 8.x with Spring Boot integration.
 *<p>
 * Note: Spring Boot auto-configuration handles most Sentry integration automatically
 * when sentry-spring-boot-starter is on the classpath.
 */
@Configuration
@Slf4j
public class GlitchTipConfig {

    @Value("${app.glitchtip.dsn:}")
    private String dsn;

    @Value("${app.glitchtip.environment:default}")
    private String environment;

    @Value("${app.glitchtip.release:unknown}")
    private String release;

    @Value("${app.glitchtip.server-name:localhost}")
    private String serverName;

    @Value("${app.glitchtip.traces-sample-rate:1.0}")
    private Double tracesSampleRate;

    @Value("${app.glitchtip.debug:false}")
    private Boolean debug;

    @PostConstruct
    public void init() {
        if (dsn == null || dsn.trim().isEmpty()) {
            log.warn("GlitchTip DSN is not configured. Error monitoring will be disabled.");
            return;
        }

        log.info("Initializing GlitchTip error monitoring...");
        log.debug("GlitchTip DSN: {}", dsn.replaceAll("://.*@", "://***:***@"));
        log.debug("Environment: {}, Release: {}, Server: {}", environment, release, serverName);

        Sentry.init(options -> {
            options.setDsn(dsn);
            options.setEnvironment(environment);
            options.setRelease(release);
            options.setServerName(serverName);
            options.setTracesSampleRate(tracesSampleRate);
            options.setDebug(debug);
        });

        log.info("✅ GlitchTip error monitoring initialized successfully");
    }
}
