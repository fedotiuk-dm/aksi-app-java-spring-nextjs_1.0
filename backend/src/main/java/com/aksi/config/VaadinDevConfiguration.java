package com.aksi.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import lombok.extern.slf4j.Slf4j;

/**
 * Конфігурація Vaadin для dev-режиму.
 */
@Configuration
@Profile("dev")
@ConditionalOnProperty(name = "vaadin.devmode.enabled", havingValue = "true", matchIfMissing = true)
@Slf4j
public class VaadinDevConfiguration {

    public VaadinDevConfiguration() {
        log.info("Vaadin dev configuration loaded - StateTree errors will be handled by DevErrorController");
    }
}
