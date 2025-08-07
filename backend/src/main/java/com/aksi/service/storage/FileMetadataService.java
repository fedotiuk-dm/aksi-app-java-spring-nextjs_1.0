package com.aksi.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Instant;
import java.util.Base64;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for file metadata operations. Handles file size calculations, content type detection, and
 * user context. Follows SRP by focusing only on metadata extraction and calculation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FileMetadataService {

  private final FilePathResolver pathResolver;

  /** Get current user ID from security context */
  public String getCurrentUserId() {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth != null && auth.isAuthenticated()) {
        return auth.getName();
      }
    } catch (Exception e) {
      log.debug("Could not get current user from security context", e);
    }
    return "system";
  }

  /** Calculate file size from base64 data */
  public long calculateBase64FileSize(String base64Data) {
    if (base64Data == null || base64Data.isEmpty()) {
      return 0L;
    }

    try {
      // Remove data URL prefix if present
      String cleanBase64 = base64Data.contains(",") ? base64Data.split(",")[1] : base64Data;

      // Base64 encoding increases size by ~33%
      // Formula: originalSize = (base64Length * 3) / 4
      int padding = 0;
      if (cleanBase64.endsWith("==")) {
        padding = 2;
      } else if (cleanBase64.endsWith("=")) {
        padding = 1;
      }

      return (cleanBase64.length() * 3L) / 4L - padding;
    } catch (Exception e) {
      log.warn("Could not calculate base64 file size", e);
      return 0L;
    }
  }

  /** Detect content type from base64 data URL */
  public String detectContentTypeFromBase64(String base64Data) {
    if (base64Data == null || base64Data.isEmpty()) {
      return "application/octet-stream";
    }

    try {
      // Check if it has data URL prefix with MIME type
      if (base64Data.startsWith("data:") && base64Data.contains(";base64,")) {
        return base64Data.substring(5, base64Data.indexOf(";base64,"));
      }

      // Try to detect from first bytes
      String cleanBase64 = base64Data.contains(",") ? base64Data.split(",")[1] : base64Data;
      byte[] bytes =
          Base64.getDecoder().decode(cleanBase64.substring(0, Math.min(cleanBase64.length(), 100)));

      return detectContentTypeFromBytes(bytes);
    } catch (Exception e) {
      log.warn("Could not detect content type from base64", e);
      return "application/octet-stream";
    }
  }

  /** Get file size in bytes */
  public long getFileSize(String filePath) {
    try {
      Path path = pathResolver.resolveFilePath(filePath);
      return Files.size(path);
    } catch (IOException e) {
      log.error("Could not get file size for: {}", filePath, e);
      return 0L;
    }
  }

  /** Get content type from file */
  public String getContentType(String filePath) {
    try {
      Path path = pathResolver.resolveFilePath(filePath);
      String contentType = Files.probeContentType(path);
      return contentType != null ? contentType : "application/octet-stream";
    } catch (IOException e) {
      log.error("Could not get content type for: {}", filePath, e);
      return "application/octet-stream";
    }
  }

  /** Check if file is readable */
  public boolean isFileReadable(String filePath) {
    try {
      Path path = pathResolver.resolveFilePath(filePath);
      return Files.isReadable(path);
    } catch (Exception e) {
      log.error("Could not check if file is readable: {}", filePath, e);
      return false;
    }
  }

  /** Get last modified time */
  public Instant getLastModifiedTime(String filePath) {
    try {
      Path path = pathResolver.resolveFilePath(filePath);
      BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
      return attrs.lastModifiedTime().toInstant();
    } catch (IOException e) {
      log.error("Could not get last modified time for: {}", filePath, e);
      return Instant.now();
    }
  }

  /** Detect content type from byte array */
  private String detectContentTypeFromBytes(byte[] bytes) {
    if (bytes.length < 4) {
      return "application/octet-stream";
    }

    // Check common file signatures
    if (bytes[0] == (byte) 0xFF && bytes[1] == (byte) 0xD8) {
      return "image/jpeg";
    }
    if (bytes[0] == (byte) 0x89 && bytes[1] == 'P' && bytes[2] == 'N' && bytes[3] == 'G') {
      return "image/png";
    }
    if (bytes[0] == 'G' && bytes[1] == 'I' && bytes[2] == 'F') {
      return "image/gif";
    }
    if (bytes[0] == '%' && bytes[1] == 'P' && bytes[2] == 'D' && bytes[3] == 'F') {
      return "application/pdf";
    }

    return "application/octet-stream";
  }
}
