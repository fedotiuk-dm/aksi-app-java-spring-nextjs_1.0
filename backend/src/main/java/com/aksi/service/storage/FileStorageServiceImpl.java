package com.aksi.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.Base64FileResponse;
import com.aksi.api.file.dto.Base64FileUploadRequest;
import com.aksi.api.file.dto.FileInfo;
import com.aksi.api.file.dto.FileUploadResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Thin facade for FileStorageService following Clean Architecture principles. Delegates all
 * operations to specialized services. No business logic - only orchestration.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

  private final FileStorageQueryService queryService;
  private final FileStorageCommandService commandService;
  private final FileResponseBuilder responseBuilder;

  // Command operations

  @Override
  @Transactional
  public FileUploadResponse storeFile(MultipartFile file, String directory) {
    log.debug("Storing file in directory: {}", directory);
    String filePath = commandService.storeFile(file, directory);
    return responseBuilder.buildUploadResponse(file, filePath);
  }

  @Override
  @Transactional
  public FileUploadResponse storeFile(MultipartFile file, String directory, String filename) {
    log.debug("Storing file {} in directory: {}", filename, directory);
    String filePath = commandService.storeFile(file, directory, filename);
    return responseBuilder.buildUploadResponse(file, filePath);
  }

  @Override
  @Transactional
  public FileUploadResponse storeBase64File(Base64FileUploadRequest request) {
    log.debug(
        "Storing base64 file {} in directory: {}", request.getFilename(), request.getDirectory());
    String filePath =
        commandService.storeBase64File(
            request.getBase64Data(), request.getDirectory(), request.getFilename());
    return responseBuilder.buildBase64UploadResponse(request, filePath);
  }

  @Override
  @Transactional
  public void deleteFile(String filePath) {
    log.debug("Deleting file: {}", filePath);
    commandService.deleteFile(filePath);
  }

  // Query operations

  @Override
  public FileInfo getFileInfo(String filePath) {
    log.debug("Getting file info for: {}", filePath);
    return responseBuilder.buildFileInfo(filePath);
  }

  @Override
  public Resource serveFile(String filePath) {
    log.debug("Serving file: {}", filePath);
    return queryService.serveFile(filePath);
  }

  @Override
  public Base64FileResponse getFileAsBase64(String filePath) {
    log.debug("Getting file as base64: {}", filePath);
    String base64Data = queryService.readFileAsBase64(filePath);
    return responseBuilder.buildBase64Response(filePath, base64Data);
  }
}
