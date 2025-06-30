package com.aksi.api.item;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import com.aksi.api.item.dto.CreatePriceListItemRequest;
import com.aksi.api.item.dto.PriceListItemResponse;
import com.aksi.api.item.dto.PriceListPageResponse;
import com.aksi.api.item.dto.UpdatePriceListItemRequest;
import com.aksi.domain.item.service.PriceListItemService;

import lombok.RequiredArgsConstructor;

/** HTTP контролер для управління прайс-листом. */
@Controller
@RequiredArgsConstructor
public class PriceListApiController implements PriceListApi {

  private final PriceListItemService priceListItemService;

  @Override
  public ResponseEntity<PriceListItemResponse> createPriceListItem(
      CreatePriceListItemRequest request) {
    var response = priceListItemService.createPriceListItem(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  public ResponseEntity<Void> deletePriceListItem(UUID id) {
    priceListItemService.deletePriceListItem(id);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<PriceListPageResponse> getPriceList(
      Integer page, Integer size, String sort, UUID categoryId, String search, Boolean active) {
    var response =
        priceListItemService.getPriceListWithPagination(
            page, size, sort, categoryId, search, active);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceListItemResponse> getPriceListItem(UUID id) {
    var response = priceListItemService.getPriceListItemById(id);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<List<PriceListItemResponse>> searchPriceListItems(
      String query, UUID categoryId, Integer limit) {
    var response = priceListItemService.searchPriceListItems(query, categoryId, limit);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<PriceListItemResponse> updatePriceListItem(
      UUID id, UpdatePriceListItemRequest request) {
    var response = priceListItemService.updatePriceListItem(id, request);
    return ResponseEntity.ok(response);
  }
}
