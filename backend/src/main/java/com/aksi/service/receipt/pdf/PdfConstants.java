package com.aksi.service.receipt.pdf;

/** PDF layout constants */
public final class PdfConstants {

  private PdfConstants() {}

  // Margins
  public static final float MARGIN = 20;
  public static final float MARGIN_LEFT = MARGIN;
  public static final float MARGIN_RIGHT = MARGIN;
  public static final float MARGIN_TOP = MARGIN;
  public static final float MARGIN_BOTTOM = MARGIN;

  // Line spacing
  public static final float LINE_HEIGHT = 15;
  public static final float LINE_HEIGHT_SMALL = 12;
  public static final float LINE_HEIGHT_LARGE = 20;

  // Font sizes
  public static final int FONT_SIZE_TITLE = 16;
  public static final int FONT_SIZE_SUBTITLE = 14;
  public static final int FONT_SIZE_NORMAL = 10;
  public static final int FONT_SIZE_SMALL = 9;
  public static final int FONT_SIZE_TINY = 8;

  // Table columns for receipt
  public static final float COL_NAME = MARGIN_LEFT;
  public static final float COL_QUANTITY = 300;
  public static final float COL_PRICE = 380;
  public static final float COL_TOTAL = 460;

  // Summary columns
  public static final float SUMMARY_LABEL_X = 350;
  public static final float SUMMARY_VALUE_X = 460;
}
