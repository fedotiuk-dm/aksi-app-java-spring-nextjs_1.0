package com.aksi.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Base64;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.exception.BusinessValidationException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Command service for file storage write operations Handles all write operations following CQRS
 * pattern
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FileStorageCommandService {

  private final FilePathResolver pathResolver;
  private final FileValidationService validationService;

  /** Store multipart file with generated filename */
  public String storeFile(MultipartFile file, String directory) {
    String filename = UUID.randomUUID().toString();
    return storeFile(file, directory, filename);
  }

  /** Store multipart file with specified filename */
  public String storeFile(MultipartFile file, String directory, String filename) {
    log.debug("Storing file: {} in directory: {}", filename, directory);

    // Validate inputs
    validationService.validateMultipartFile(file);
    validationService.validateDirectoryPath(directory);
    validationService.validateFileName(filename);

    // Process filename
    String cleanOriginalFileName = validationService.cleanFileName(file.getOriginalFilename());
    String fileExtension = validationService.extractFileExtension(cleanOriginalFileName);
    String finalFileName = validationService.buildFinalFileName(filename, fileExtension);

    // Validate final filename
    validationService.validateFileName(finalFileName);

    try {
      // Build target location
      Path targetLocation = pathResolver.buildTargetLocation(directory, finalFileName);

      // Store file
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      // Build relative path
      String relativePath = pathResolver.buildRelativePath(directory, finalFileName);

      log.info("Successfully stored file: {} (size: {} bytes)", relativePath, file.getSize());
      return relativePath;

    } catch (IOException ex) {
      log.error("Error storing file: {} in directory: {}", finalFileName, directory, ex);
      throw new BusinessValidationException(
          "Could not store file " + finalFileName + ". Please try again!", ex);
    }
  }

  /** Store base64 encoded data as file */
  public String storeBase64File(String base64Data, String directory, String filename) {
    log.debug("Storing base64 data as file: {} in directory: {}", filename, directory);

    // Validate inputs
    validationService.validateBase64Data(base64Data);
    validationService.validateDirectoryPath(directory);
    validationService.validateFileName(filename);

    try {
      // Clean and decode base64 data
      String cleanBase64 = validationService.cleanBase64Data(base64Data);
      byte[] decodedBytes = Base64.getDecoder().decode(cleanBase64);

      // Build target location
      Path targetLocation = pathResolver.buildTargetLocation(directory, filename);

      // Write decoded bytes to file
      Files.write(targetLocation, decodedBytes);

      // Build relative path
      String relativePath = pathResolver.buildRelativePath(directory, filename);

      log.info("Successfully stored base64 file: {} ({} bytes)", relativePath, decodedBytes.length);
      return relativePath;

    } catch (IllegalArgumentException ex) {
      log.error("Invalid base64 data for file: {}", filename, ex);
      throw new BusinessValidationException("Invalid base64 data provided", ex);
    } catch (IOException ex) {
      log.error("Error storing base64 file: {} in directory: {}", filename, directory, ex);
      throw new BusinessValidationException("Could not store base64 data as file", ex);
    }
  }

  /** Delete file at specified path */
  public void deleteFile(String filePath) {
    log.debug("Deleting file: {}", filePath);

    validationService.validateDirectoryPath(filePath);

    try {
      Path fileToDelete = pathResolver.resolveFilePath(filePath);

      boolean wasDeleted = Files.deleteIfExists(fileToDelete);

      if (wasDeleted) {
        log.info("Successfully deleted file: {}", filePath);
      } else {
        log.debug("File did not exist, no deletion needed: {}", filePath);
      }

    } catch (IOException ex) {
      log.error("Error deleting file: {}", filePath, ex);
      throw new BusinessValidationException("Could not delete file: " + filePath, ex);
    }
  }
}
