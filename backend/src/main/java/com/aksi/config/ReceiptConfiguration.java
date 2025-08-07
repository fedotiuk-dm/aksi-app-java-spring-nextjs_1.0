package com.aksi.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/** Configuration properties for receipt generation Centralizes all PDF settings and defaults */
@Data
@Configuration
@ConfigurationProperties(prefix = "receipt")
public class ReceiptConfiguration {

  // Default values
  private String defaultBranchName = "AKSI";
  private String defaultPaymentMethod = "CASH";
  private String currency = "грн";
  private String phonePrefix = "Тел: ";

  // Date formats
  private String dateTimeFormat = "dd.MM.yyyy HH:mm";
  private String dateFormat = "dd.MM.yyyy";

  // Font configuration
  private FontConfig font = new FontConfig();

  // PDF layout configuration
  private LayoutConfig layout = new LayoutConfig();

  @Data
  public static class FontConfig {
    private String directory = "fonts/";
    private String regular = "DejaVuSans.ttf";
    private String bold = "DejaVuSans-Bold.ttf";
    private int titleSize = 18;
    private int headingSize = 12;
    private int normalSize = 10;
    private int smallSize = 8;
  }

  @Data
  public static class LayoutConfig {
    // Page configuration
    private float pageWidth = 595f; // A4 width
    private float pageHeight = 842f; // A4 height
    private float marginTop = 50f;
    private float marginBottom = 50f;
    private float marginLeft = 50f;
    private float marginRight = 50f;

    // Table configuration
    private float tableWidth = 495f;
    private float[] itemTableColumnWidths = {280f, 45f, 85f, 85f};

    // Spacing
    private float lineSpacing = 15f;
    private float sectionSpacing = 20f;
    private float cellPadding = 5f;

    // Positioning
    private float contentStartY = 792f; // pageHeight - marginTop
    private float contentEndY = 50f; // marginBottom
  }
}
