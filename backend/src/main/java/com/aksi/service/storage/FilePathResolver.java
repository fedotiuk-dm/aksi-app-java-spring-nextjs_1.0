package com.aksi.service.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aksi.exception.BadRequestException;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for resolving and managing file paths Handles path operations, directory creation, and
 * path security
 */
@Service
@Slf4j
public class FilePathResolver {

  private final Path fileStorageLocation;
  private final String baseUrl;

  public FilePathResolver(
      @Value("${app.file-storage.upload-dir:./uploads}") String uploadDir,
      @Value("${app.file-storage.base-url:http://localhost:8080}") String baseUrl) {
    this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    this.baseUrl = baseUrl;

    initializeStorageDirectory();
  }

  /** Resolve target directory path and create if needed */
  public Path resolveAndCreateDirectory(String directory) {
    try {
      Path targetDirectory = fileStorageLocation.resolve(directory).normalize();

      // Security check - ensure directory is within storage location
      if (!targetDirectory.startsWith(fileStorageLocation)) {
        throw new BadRequestException("Invalid directory path: " + directory);
      }

      Files.createDirectories(targetDirectory);
      return targetDirectory;
    } catch (IOException ex) {
      throw new BadRequestException("Could not create directory: " + directory, ex);
    }
  }

  /** Resolve file path with security validation */
  public Path resolveFilePath(String filePath) {
    Path resolvedPath = fileStorageLocation.resolve(filePath).normalize();

    // Security check - ensure file is within storage location
    if (!resolvedPath.startsWith(fileStorageLocation)) {
      throw new BadRequestException("Invalid file path: " + filePath);
    }

    return resolvedPath;
  }

  /** Build target file location within directory */
  public Path buildTargetLocation(String directory, String filename) {
    Path targetDirectory = resolveAndCreateDirectory(directory);
    return targetDirectory.resolve(filename);
  }

  /** Build relative file path for storage */
  public String buildRelativePath(String directory, String filename) {
    return directory + "/" + filename;
  }

  /** Generate full URL for file access */
  public String generateFileUrl(String filePath) {
    return baseUrl + "/api/files/" + filePath;
  }

  /** Check if file exists at given path */
  public boolean fileExistsAtPath(String filePath) {
    try {
      Path file = resolveFilePath(filePath);
      return Files.exists(file);
    } catch (Exception ex) {
      log.debug("Error checking file existence: {}", filePath, ex);
      return false;
    }
  }

  /** Initialize storage directory on startup */
  private void initializeStorageDirectory() {
    try {
      Files.createDirectories(fileStorageLocation);
      log.info("Initialized file storage directory: {}", fileStorageLocation);
    } catch (IOException ex) {
      throw new RuntimeException(
          "Could not create the directory where the uploaded files will be stored: "
              + fileStorageLocation,
          ex);
    }
  }
}
