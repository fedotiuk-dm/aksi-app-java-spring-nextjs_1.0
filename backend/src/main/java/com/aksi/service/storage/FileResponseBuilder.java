package com.aksi.service.storage;

import java.time.Instant;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.dto.Base64FileResponse;
import com.aksi.api.file.dto.Base64FileUploadRequest;
import com.aksi.api.file.dto.FileInfo;
import com.aksi.api.file.dto.FileUploadResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Builder for file operation DTOs. Responsible for creating consistent DTO responses from file
 * operations. Follows SRP by handling only DTO construction logic.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class FileResponseBuilder {

  private final FilePathResolver pathResolver;
  private final FileMetadataService metadataService;

  /** Build FileUploadResponse from multipart file upload */
  public FileUploadResponse buildUploadResponse(MultipartFile file, String filePath) {
    log.debug("Building upload response for file: {}", filePath);

    return new FileUploadResponse()
        .success(true)
        .filePath(filePath)
        .fileUrl(pathResolver.generateFileUrl(filePath))
        .originalFilename(file.getOriginalFilename())
        .fileSize(file.getSize())
        .contentType(file.getContentType())
        .uploadedAt(Instant.now())
        .uploadedBy(metadataService.getCurrentUserId());
  }

  /** Build FileUploadResponse from base64 upload */
  public FileUploadResponse buildBase64UploadResponse(
      Base64FileUploadRequest request, String filePath) {
    log.debug("Building base64 upload response for file: {}", filePath);

    return new FileUploadResponse()
        .success(true)
        .filePath(filePath)
        .fileUrl(pathResolver.generateFileUrl(filePath))
        .originalFilename(request.getFilename())
        .fileSize(metadataService.calculateBase64FileSize(request.getBase64Data()))
        .contentType(metadataService.detectContentTypeFromBase64(request.getBase64Data()))
        .uploadedAt(Instant.now())
        .uploadedBy(metadataService.getCurrentUserId());
  }

  /** Build FileInfo DTO from file path */
  public FileInfo buildFileInfo(String filePath) {
    log.debug("Building file info for: {}", filePath);

    boolean exists = pathResolver.fileExistsAtPath(filePath);

    FileInfo fileInfo =
        new FileInfo()
            .filePath(filePath)
            .fileUrl(pathResolver.generateFileUrl(filePath))
            .exists(exists);

    if (exists) {
      try {
        fileInfo
            .fileSize(metadataService.getFileSize(filePath))
            .contentType(metadataService.getContentType(filePath))
            .readable(metadataService.isFileReadable(filePath))
            .lastModified(metadataService.getLastModifiedTime(filePath));
      } catch (Exception e) {
        log.warn("Could not get full file metadata for: {}", filePath, e);
        fileInfo.fileSize(0L).readable(false).lastModified(Instant.now());
      }
    } else {
      fileInfo.fileSize(0L).readable(false).lastModified(Instant.now());
    }

    return fileInfo;
  }

  /** Build Base64FileResponse from file content */
  public Base64FileResponse buildBase64Response(String filePath, String base64Data) {
    log.debug("Building base64 response for file: {}", filePath);

    return new Base64FileResponse()
        .filePath(filePath)
        .base64Data(base64Data)
        .contentType(metadataService.getContentType(filePath))
        .fileSize(metadataService.getFileSize(filePath));
  }
}
