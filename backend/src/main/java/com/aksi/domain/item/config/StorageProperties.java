package com.aksi.domain.item.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/** Storage configuration properties */
@Data
@Configuration
@ConfigurationProperties(prefix = "application.storage")
public class StorageProperties {

  private String mediaRoot = "./media";
  private PhotoPaths photos = new PhotoPaths();
  private String maxPhotoSize = "5MB";
  private List<String> allowedTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/webp");

  @Data
  public static class PhotoPaths {
    private String items = "orders/%s/items/%s";
    private String thumbnails = "orders/%s/items/%s/thumbnails";
  }
}
