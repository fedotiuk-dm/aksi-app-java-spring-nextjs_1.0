package com.aksi.service.receipt.pdf;

/** PDF layout constants */
public final class PdfConstants {

  private PdfConstants() {}

  /** Default margin size for PDF pages. */
  public static final float MARGIN = 20;

  /** Left margin. */
  public static final float MARGIN_LEFT = MARGIN;

  /** Right margin. */
  public static final float MARGIN_RIGHT = MARGIN;

  /** Top margin. */
  public static final float MARGIN_TOP = MARGIN;

  /** Bottom margin. */
  public static final float MARGIN_BOTTOM = MARGIN;

  /** Default line height. */
  public static final float LINE_HEIGHT = 15;

  /** Small line height. */
  public static final float LINE_HEIGHT_SMALL = 12;

  /** Large line height. */
  public static final float LINE_HEIGHT_LARGE = 20;

  /** Title font size. */
  public static final int FONT_SIZE_TITLE = 16;

  /** Subtitle font size. */
  public static final int FONT_SIZE_SUBTITLE = 14;

  /** Normal text font size. */
  public static final int FONT_SIZE_NORMAL = 10;

  /** Small text font size. */
  public static final int FONT_SIZE_SMALL = 9;

  /** Tiny text font size. */
  public static final int FONT_SIZE_TINY = 8;

  /** Column position for item names. */
  public static final float COL_NAME = MARGIN_LEFT;

  /** Column position for quantities. */
  public static final float COL_QUANTITY = 300;

  /** Column position for prices. */
  public static final float COL_PRICE = 380;

  /** Column position for totals. */
  public static final float COL_TOTAL = 460;

  /** X position for summary labels. */
  public static final float SUMMARY_LABEL_X = 350;

  /** X position for summary values. */
  public static final float SUMMARY_VALUE_X = 460;
}
