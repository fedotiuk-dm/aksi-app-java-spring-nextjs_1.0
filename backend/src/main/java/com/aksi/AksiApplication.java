package com.aksi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.aksi", "com.aksi.api", "com.aksi.config"})
@EnableJpaRepositories(basePackages = "com.aksi.domain")
public class AksiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AksiApplication.class, args);
    }

}

