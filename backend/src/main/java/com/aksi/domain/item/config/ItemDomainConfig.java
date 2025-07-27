package com.aksi.domain.item.config;

import org.apache.commons.jexl3.JexlBuilder;
import org.apache.commons.jexl3.JexlEngine;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/** Configuration for the item domain */
@Configuration
@ComponentScan(basePackages = "com.aksi.domain.item")
@EntityScan(basePackages = "com.aksi.domain.item.entity")
@EnableJpaRepositories(basePackages = "com.aksi.domain.item.repository")
public class ItemDomainConfig {

  /**
   * JEXL engine for formula evaluation
   *
   * @return configured JEXL engine
   */
  @Bean
  public JexlEngine jexlEngine() {
    return new JexlBuilder()
        .strict(true)
        .silent(false)
        .cache(512)
        .create();
  }
}