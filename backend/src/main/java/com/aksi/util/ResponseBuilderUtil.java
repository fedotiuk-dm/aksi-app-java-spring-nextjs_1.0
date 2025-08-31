package com.aksi.util;

import java.util.List;

import org.springframework.data.domain.Page;

/**
 * Simple utility for building paginated response objects. Much simpler than complex generic
 * solutions - just provides helper methods.
 *
 * <p>NOTE: This complements PaginationUtil which handles request-side pagination (Pageable
 * creation).
 */
public class ResponseBuilderUtil {

  /**
   * Extract pagination data from Page object into a simple data structure. This can be used with
   * any response builder pattern.
   *
   * @param <T> Entity type
   * @param page Spring Data Page object
   * @return PaginationData object with all pagination information
   */
  public static <T> PaginationData extractPaginationData(Page<T> page) {
    return new PaginationData(
        page.getTotalElements(),
        page.getTotalPages(),
        page.getSize(),
        page.getNumber(),
        page.getNumberOfElements(),
        page.isFirst(),
        page.isLast(),
        page.isEmpty());
  }

  /**
   * Create a new ListResponse with pagination data. This eliminates the repetitive pattern of
   * manually setting all pagination fields in response constructors.
   *
   * @param data List of items
   * @param page Page object for pagination data
   * @return Object array with constructor parameters: [data, totalElements, totalPages, size,
   *     number, numberOfElements, first, last, empty]
   */
  public static Object[] createPaginationParams(List<?> data, Page<?> page) {
    return new Object[] {
      data,
      page.getTotalElements(),
      page.getTotalPages(),
      page.getSize(),
      page.getNumber(),
      page.getNumberOfElements(),
      page.isFirst(),
      page.isLast(),
      page.isEmpty()
    };
  }

  /**
   * Create pagination params for single-page responses (no pagination).
   *
   * @param data List of items
   * @return Object array with single-page constructor parameters
   */
  public static Object[] createSinglePageParams(List<?> data) {
    long totalElements = data.size();
    return new Object[] {
      data,
      totalElements, // totalElements
      1, // totalPages
      (int) totalElements, // size
      0, // number
      (int) totalElements, // numberOfElements
      true, // first
      true, // last
      data.isEmpty() // empty
    };
  }

  /** Simple data holder for pagination information. */
  public static class PaginationData {
    public final long totalElements;
    public final int totalPages;
    public final int size;
    public final int number;
    public final int numberOfElements;
    public final boolean first;
    public final boolean last;
    public final boolean empty;

    public PaginationData(
        long totalElements,
        int totalPages,
        int size,
        int number,
        int numberOfElements,
        boolean first,
        boolean last,
        boolean empty) {
      this.totalElements = totalElements;
      this.totalPages = totalPages;
      this.size = size;
      this.number = number;
      this.numberOfElements = numberOfElements;
      this.first = first;
      this.last = last;
      this.empty = empty;
    }
  }
}
