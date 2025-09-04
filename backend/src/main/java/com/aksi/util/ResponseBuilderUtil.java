package com.aksi.util;

import java.lang.reflect.InvocationTargetException;
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
   * Simple data holder for pagination information.
   *
   * @param totalElements    Total number of elements across all pages.
   * @param totalPages       Total number of pages available.
   * @param size             Size of each page.
   * @param number           Current page number (0-based).
   * @param numberOfElements Number of elements in the current page.
   * @param first            Whether this is the first page.
   * @param last             Whether this is the last page.
   * @param empty            Whether the current page is empty.
   */
    public record PaginationData(long totalElements, int totalPages, int size, int number, int numberOfElements,
                                 boolean first, boolean last, boolean empty) {
  }

  /**
   * Base interface for all paginated response objects.
   * Eliminates reflection and provides type-safe pagination setup.
   *
   * @param <T> Type of data items in the response
   */
  public interface PaginatedResponse<T> {
    void setData(List<T> data);
    void setTotalElements(long totalElements);
    void setTotalPages(int totalPages);
    void setSize(int size);
    void setNumber(int number);
    void setNumberOfElements(int numberOfElements);
    void setFirst(boolean first);
    void setLast(boolean last);
    void setEmpty(boolean empty);
  }

  /**
   * Build paginated response for generated OpenAPI classes using reflection.
   * This is Variant 4 adapted for generated classes that can't implement interfaces.
   *
   * @param <T> Generated response type
   * @param <D> Data item type
   * @param responseFactory Factory function to create response instance
   * @param data List of data items
   * @param page Page with pagination info
   * @return New response instance with data populated
   */
  public static <T, D> T buildGeneratedPaginatedResponse(
      java.util.function.Supplier<T> responseFactory,
      List<D> data,
      Page<?> page) {

    T response = responseFactory.get();

    // Use reflection for generated classes
    invokeSetterSafely(response, "setData", data);
    invokeSetterSafely(response, "setTotalElements", page.getTotalElements());
    invokeSetterSafely(response, "setTotalPages", page.getTotalPages());
    invokeSetterSafely(response, "setSize", page.getSize());
    invokeSetterSafely(response, "setNumber", page.getNumber());
    invokeSetterSafely(response, "setNumberOfElements", page.getNumberOfElements());
    invokeSetterSafely(response, "setFirst", page.isFirst());
    invokeSetterSafely(response, "setLast", page.isLast());
    invokeSetterSafely(response, "setEmpty", page.isEmpty());

    return response;
  }

  /**
   * Safely invoke setter method with proper error handling.
   */
  private static void invokeSetterSafely(Object target, String methodName, Object value) {
    try {
      // Find all methods with the given name
      var methods = target.getClass().getMethods();
      for (var method : methods) {
        if (method.getName().equals(methodName) && method.getParameterCount() == 1) {
          try {
            method.invoke(target, value);
            return; // Success
          } catch (IllegalArgumentException e) {
            // Try next method - execution continues to next iteration automatically
          }
        }
      }
      // If we get here, no suitable method was found
      throw new NoSuchMethodException("No suitable method found for " + methodName);
    } catch (NoSuchMethodException e) {
      throw new IllegalArgumentException(
        "Generated response class " + target.getClass().getSimpleName() +
        " does not have required method: " + methodName, e);
    } catch (IllegalAccessException | InvocationTargetException e) {
      throw new RuntimeException(
        "Failed to invoke " + methodName + " on " + target.getClass().getSimpleName() + ": " + e.getMessage(), e);
    }
  }
}
