package com.aksi.dto.service;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

import com.aksi.domain.service.ServiceCategoryType;
import com.aksi.domain.service.UnitOfMeasure;

import lombok.Data;

/** DTO for PriceListItem */
@Data
public class PriceListItemDTO implements Serializable {
  private UUID id;
  private ServiceCategoryType categoryCode;
  private Integer catalogNumber;
  private String name;
  private UnitOfMeasure unitOfMeasure;
  private BigDecimal basePrice;
  private BigDecimal priceBlack;
  private BigDecimal priceColor;
  private boolean active;
}
