package com.aksi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"com.aksi"})
@EnableJpaRepositories(basePackages = "com.aksi.domain")
@EnableScheduling
public class AksiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AksiApplication.class, args);
    }

}

