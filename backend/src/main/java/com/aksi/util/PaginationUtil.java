package com.aksi.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * Utility class for creating pageable objects for pagination in services. This is a shared utility
 * that can be used across different domains.
 */
public class PaginationUtil {

  /**
   * Create a pageable object with specified parameters.
   *
   * @param page Page number (0-based)
   * @param size Page size
   * @param sortBy Sort field name
   * @param sortOrder Sort direction ("asc" or "desc")
   * @param defaultSortField Default sort field if sortBy is null
   * @return Pageable object
   */
  public static Pageable createPageable(
      Integer page, Integer size, String sortBy, String sortOrder, String defaultSortField) {

    // Default values
    int pageNum = page != null ? page : 0;
    int pageSize = size != null ? size : 20;
    String sortField = sortBy != null ? sortBy : defaultSortField;
    String sortDir = sortOrder != null ? sortOrder : "asc";

    // Create sort direction
    Sort.Direction direction =
        "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;

    return PageRequest.of(pageNum, pageSize, Sort.by(direction, sortField));
  }

  /**
   * Create a pageable object with default sort field "sortOrder".
   *
   * @param page Page number (0-based)
   * @param size Page size
   * @param sortBy Sort field name
   * @param sortOrder Sort direction ("asc" or "desc")
   * @return Pageable object
   */
  public static Pageable createPageable(
      Integer page, Integer size, String sortBy, String sortOrder) {
    return createPageable(page, size, sortBy, sortOrder, "sortOrder");
  }
}
