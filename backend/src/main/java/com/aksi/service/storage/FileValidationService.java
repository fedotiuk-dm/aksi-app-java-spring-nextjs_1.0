package com.aksi.service.storage;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.exception.BadRequestException;

import lombok.extern.slf4j.Slf4j;

/** Service for file validation operations Handles validation of files, paths, and base64 data */
@Service
@Slf4j
public class FileValidationService {

  private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /** Validate multipart file */
  public void validateMultipartFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("File is required and cannot be empty");
    }

    if (file.getSize() > MAX_FILE_SIZE) {
      throw new BadRequestException(
          String.format(
              "File size (%d bytes) exceeds maximum allowed size (%d bytes)",
              file.getSize(), MAX_FILE_SIZE));
    }

    String contentType = file.getContentType();
    if (contentType == null) {
      throw new BadRequestException("File content type is required");
    }
  }

  /** Validate file name for security */
  public void validateFileName(String fileName) {
    if (fileName == null || fileName.trim().isEmpty()) {
      throw new BadRequestException("Filename cannot be empty");
    }

    if (fileName.contains("..")) {
      throw new BadRequestException("Filename contains invalid path sequence: " + fileName);
    }

    if (fileName.contains("/") || fileName.contains("\\")) {
      throw new BadRequestException("Filename cannot contain path separators: " + fileName);
    }
  }

  /** Validate directory path */
  public void validateDirectoryPath(String directory) {
    if (directory == null || directory.trim().isEmpty()) {
      throw new BadRequestException("Directory path cannot be empty");
    }

    if (directory.contains("..")) {
      throw new BadRequestException("Directory path contains invalid sequence: " + directory);
    }
  }

  /** Validate base64 data */
  public void validateBase64Data(String base64Data) {
    if (base64Data == null || base64Data.trim().isEmpty()) {
      throw new BadRequestException("Base64 data cannot be empty");
    }

    // Basic base64 validation
    try {
      String cleanBase64 = cleanBase64Data(base64Data);
      if (cleanBase64.length() % 4 != 0) {
        throw new BadRequestException("Invalid base64 data format");
      }
    } catch (Exception e) {
      throw new BadRequestException("Invalid base64 data: " + e.getMessage());
    }
  }

  /** Clean filename by removing path and normalizing */
  public String cleanFileName(String originalFileName) {
    if (originalFileName == null || originalFileName.isEmpty()) {
      return "";
    }
    return StringUtils.cleanPath(originalFileName);
  }

  /** Extract file extension from filename */
  public String extractFileExtension(String fileName) {
    if (fileName == null || fileName.isEmpty()) {
      return "";
    }
    int dotIndex = fileName.lastIndexOf('.');
    return (dotIndex == -1) ? "" : fileName.substring(dotIndex + 1);
  }

  /** Clean base64 data by removing data URL prefix */
  public String cleanBase64Data(String base64Data) {
    if (base64Data == null) {
      return "";
    }

    if (base64Data.contains(",")) {
      return base64Data.split(",")[1];
    }

    return base64Data;
  }

  /** Build final filename with extension */
  public String buildFinalFileName(String filename, String extension) {
    if (extension == null || extension.isEmpty()) {
      return filename;
    }
    return filename + "." + extension;
  }
}
