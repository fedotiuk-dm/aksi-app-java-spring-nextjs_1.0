package com.aksi.domain.client.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.client.dto.ClientSearchResponse;
import com.aksi.api.client.dto.ClientSearchResult;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.mapper.ClientMapper;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.domain.client.util.ClientUtils;
import com.aksi.shared.validation.ValidationConstants;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Service for client search functionality */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ClientSearchService {

  private final ClientRepository clientRepository;
  private final ClientMapper clientMapper;

  /**
   * Search clients by query with pagination
   *
   * @param query search query (searches in name, phone, email)
   * @param page page number (0-based)
   * @param limit maximum number of results per page
   * @return search results with highlighted matches
   */
  public ClientSearchResponse searchClients(String query, Integer page, Integer limit) {
    log.info(ValidationConstants.Messages.SEARCHING_CLIENTS, query);

    // Create pageable with page and limit
    int pageNumber = page != null ? page : 0;
    int pageSize = limit != null ? limit : 10;
    Pageable pageable = PageRequest.of(pageNumber, pageSize);

    // Search clients by query
    List<ClientEntity> clients = clientRepository.searchClients(query.trim(), pageable);

    // Convert to search results using mapper
    List<ClientSearchResult> results = clientMapper.toSearchResultList(clients);

    // Add highlighted text for each result
    for (int i = 0; i < results.size(); i++) {
      String highlightedText = buildHighlightedText(clients.get(i), query.trim());
      results.get(i).setHighlightedText(highlightedText);
    }

    // Create response
    ClientSearchResponse response = new ClientSearchResponse();
    response.setResults(results);

    log.debug("Found {} clients matching query: {}", results.size(), query);

    return response;
  }

  /** Build highlighted text for search result */
  private String buildHighlightedText(ClientEntity client, String query) {
    StringBuilder highlighted = new StringBuilder();

    // Check and highlight name
    String fullName = ClientUtils.getFullName(client);
    if (fullName.toLowerCase().contains(query.toLowerCase())) {
      highlighted.append(ClientUtils.highlightMatch(fullName, query));
    } else {
      highlighted.append(fullName);
    }

    // Add phone
    highlighted.append(" • ");
    String formattedPhone = ClientUtils.formatPhone(client.getPhone());
    if (client.getPhone().contains(query) || formattedPhone.contains(query)) {
      highlighted.append(ClientUtils.highlightMatch(formattedPhone, query));
    } else {
      highlighted.append(formattedPhone);
    }

    // Add email if exists and matches
    if (client.getEmail() != null) {
      highlighted.append(" • ");
      if (client.getEmail().toLowerCase().contains(query.toLowerCase())) {
        highlighted.append(ClientUtils.highlightMatch(client.getEmail(), query));
      } else {
        highlighted.append(client.getEmail());
      }
    }

    return highlighted.toString();
  }
}
