package com.aksi.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.exception.BusinessValidationException;
import com.aksi.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Query service for file storage read operations Handles all read-only operations following CQRS
 * pattern
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class FileStorageQueryService {

  private final FilePathResolver pathResolver;
  private final FileValidationService validationService;

  /** Check if file does not exist at given path */
  private boolean fileNotExists(String filePath) {
    log.debug("Checking file existence: {}", filePath);

    validationService.validateDirectoryPath(filePath);
    return !pathResolver.fileExistsAtPath(filePath);
  }

  /** Read file content as base64 encoded string */
  public String readFileAsBase64(String filePath) {
    log.debug("Reading file as base64: {}", filePath);

    validationService.validateDirectoryPath(filePath);

    try {
      Path file = pathResolver.resolveFilePath(filePath);

      if (!Files.exists(file)) {
        throw new BusinessValidationException("File not found: " + filePath);
      }

      if (!Files.isReadable(file)) {
        throw new BusinessValidationException("File is not readable: " + filePath);
      }

      byte[] fileContent = Files.readAllBytes(file);
      String base64Content = Base64.getEncoder().encodeToString(fileContent);

      log.debug("Successfully read file as base64: {} ({} bytes)", filePath, fileContent.length);
      return base64Content;

    } catch (IOException ex) {
      log.error("Error reading file as base64: {}", filePath, ex);
      throw new BusinessValidationException("Could not read file as base64: " + filePath, ex);
    }
  }

  /** Serve file as Resource for HTTP response with proper validation */
  public Resource serveFile(String filePath) {
    log.debug("Serving file resource: {}", filePath);

    validationService.validateDirectoryPath(filePath);

    if (fileNotExists(filePath)) {
      throw new NotFoundException("File not found: " + filePath);
    }

    try {
      Path file = pathResolver.resolveFilePath(filePath);
      Resource resource = new UrlResource(file.toUri());

      if (!resource.isReadable()) {
        throw new NotFoundException("File is not readable: " + filePath);
      }

      log.debug("Successfully prepared file resource: {}", filePath);
      return resource;

    } catch (IOException ex) {
      log.error("Error serving file: {}", filePath, ex);
      throw new NotFoundException("File not found: " + filePath);
    }
  }
}
