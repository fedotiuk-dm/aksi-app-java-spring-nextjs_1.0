package com.aksi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Головний клас додатку для односторінкової системи замовлень хімчистки.
 *
 * <p>Система реалізує принципи DDD (Domain Driven Design) з чітким розділенням доменів: - Client
 * Domain: управління клієнтами та їх даними - Order Domain: управління замовленнями та їх станами -
 * Item Domain: управління предметами, послугами та ціноутворенням - Branch Domain: управління
 * філіями та їх налаштуваннями - Document Domain: генерація квитанцій та документів
 */
@SpringBootApplication
@EnableScheduling
public class DryCleaningOrderSystemApplication {

  public static void main(String[] args) {
    SpringApplication.run(DryCleaningOrderSystemApplication.class, args);
  }
}
