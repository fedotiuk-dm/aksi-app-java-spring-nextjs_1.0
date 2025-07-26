package com.aksi.domain.client.util;

import java.util.regex.Pattern;

import com.aksi.domain.client.entity.ClientEntity;

import lombok.experimental.UtilityClass;

/** Utility class for client-related operations */
@UtilityClass
public class ClientUtils {

  /**
   * Normalize phone number by removing spaces, dashes, and parentheses
   *
   * @param phone the phone number to normalize
   * @return normalized phone number
   */
  public static String normalizePhone(String phone) {
    if (phone == null) {
      return null;
    }
    return phone.replaceAll("[\\s\\-()]", "");
  }

  /**
   * Format phone number for display
   *
   * @param phone the phone number to format
   * @return formatted phone number like +380 (50) 123-45-67
   */
  public static String formatPhone(String phone) {
    if (phone == null || phone.length() != 13) {
      return phone;
    }

    // +380 (50) 123-45-67
    return String.format(
        "%s (%s) %s-%s-%s",
        phone.substring(0, 4),
        phone.substring(4, 6),
        phone.substring(6, 9),
        phone.substring(9, 11),
        phone.substring(11, 13));
  }

  /**
   * Highlight matched text for search results
   *
   * @param text the text to highlight in
   * @param query the search query
   * @return text with highlighted matches wrapped in <mark> tags
   */
  public static String highlightMatch(String text, String query) {
    if (text == null || query == null || query.isEmpty()) {
      return text;
    }

    String regex = "(?i)(" + Pattern.quote(query) + ")";
    return text.replaceAll(regex, "<mark>$1</mark>");
  }

  /**
   * Get full name of the client
   *
   * @param client the client entity
   * @return full name in format "LastName FirstName"
   */
  public static String getFullName(ClientEntity client) {
    if (client == null) {
      return "";
    }
    return client.getLastName() + " " + client.getFirstName();
  }
}
