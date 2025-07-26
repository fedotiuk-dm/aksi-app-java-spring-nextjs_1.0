package com.aksi.api.client;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.domain.client.service.ClientSearchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for client search functionality Implements OpenAPI generated ClientSearchApi
 * interface
 */
@RestController
@RequiredArgsConstructor
@Slf4j
public class ClientSearchController implements ClientSearchApi {

  private final ClientSearchService clientSearchService;

  @Override
  public ResponseEntity<ClientSearchResponse> searchClients(
      String query, Integer page, Integer limit) {
    log.debug("Searching clients with query: '{}', page: {}, limit: {}", query, page, limit);

    ClientSearchResponse response = clientSearchService.searchClients(query, page, limit);
    return ResponseEntity.ok(response);
  }
}
