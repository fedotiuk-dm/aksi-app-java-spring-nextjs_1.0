package com.aksi.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.Base64FileResponse;
import com.aksi.api.file.dto.Base64FileUploadRequest;
import com.aksi.api.file.dto.FileInfo;
import com.aksi.api.file.dto.FileUploadResponse;

/**
 * Service interface for file storage operations Uses OpenAPI-generated DTOs following API-first
 * approach
 */
public interface FileStorageService {

  /**
   * Store a multipart file using API DTO request/response pattern
   *
   * @param file The multipart file to store
   * @param directory The directory to store the file in
   * @return FileUploadResponse with storage details
   */
  FileUploadResponse storeFile(MultipartFile file, String directory);

  /**
   * Store a multipart file with specific filename using API DTO pattern
   *
   * @param file The multipart file to store
   * @param directory The directory to store the file in
   * @param filename The filename to use (without extension)
   * @return FileUploadResponse with storage details
   */
  FileUploadResponse storeFile(MultipartFile file, String directory, String filename);

  /**
   * Store base64 encoded file using API DTO pattern
   *
   * @param request Base64FileUploadRequest containing file data and metadata
   * @return FileUploadResponse with storage details
   */
  FileUploadResponse storeBase64File(Base64FileUploadRequest request);

  /**
   * Get detailed file information using API DTO pattern
   *
   * @param filePath The file path to check
   * @return FileInfo DTO with complete file metadata
   */
  FileInfo getFileInfo(String filePath);

  /**
   * Serve a file as Resource for HTTP response with proper headers
   *
   * @param filePath The file path to serve
   * @return Resource for HTTP response
   */
  Resource serveFile(String filePath);

  /**
   * Delete a file
   *
   * @param filePath The path of the file to delete
   */
  void deleteFile(String filePath);

  /**
   * Get file content as Base64FileResponse
   *
   * @param filePath The file path to read
   * @return Base64FileResponse with file content and metadata
   */
  Base64FileResponse getFileAsBase64(String filePath);
}
