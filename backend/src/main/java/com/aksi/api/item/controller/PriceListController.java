package com.aksi.api.item.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.item.PriceListApi;
import com.aksi.api.item.dto.PriceListItemListResponse;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.PriceListSearchRequest;
import com.aksi.domain.item.service.PriceListItemService;

import lombok.RequiredArgsConstructor;

/** Controller for price list endpoints. */
@RestController
@RequiredArgsConstructor
public class PriceListController implements PriceListApi {

  private final PriceListItemService priceListItemService;

  @Override
  public ResponseEntity<PriceListItemListResponse> searchPriceList(
      PriceListSearchRequest priceListSearchRequest) {
    PriceListItemListResponse response =
        priceListItemService.searchPriceListItems(priceListSearchRequest);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceListItemResponse> getPriceListItem(Long itemId) {
    // Note: This assumes itemId is actually a UUID stored as Long in the API spec
    // In production, the OpenAPI spec should be updated to use UUID type
    PriceListItemResponse response =
        priceListItemService.getPriceListItemById(
            UUID.fromString(String.format("00000000-0000-0000-0000-%012d", itemId)));
    return ResponseEntity.ok(response);
  }
}
