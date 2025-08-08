package com.aksi.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.aksi.api.file.FilesApi;
import com.aksi.api.file.dto.Base64FileResponse;
import com.aksi.api.file.dto.Base64FileUploadRequest;
import com.aksi.api.file.dto.FileInfo;
import com.aksi.api.file.dto.FileUploadResponse;
import com.aksi.service.storage.FileStorageService;

import lombok.RequiredArgsConstructor;

/** REST controller for file operations. Thin layer between OpenAPI and service. */
@RestController
@RequiredArgsConstructor
public class FileController implements FilesApi {

  private final FileStorageService fileStorageService;

  @Override
  public ResponseEntity<Resource> serveFile(String filePath) {
    Resource resource = fileStorageService.serveFile(filePath);
    return ResponseEntity.ok(resource);
  }

  @Override
  public ResponseEntity<FileUploadResponse> uploadFile(
      MultipartFile file, String directory, String filename) {
    FileUploadResponse response =
        filename != null
            ? fileStorageService.storeFile(file, directory, filename)
            : fileStorageService.storeFile(file, directory);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<FileUploadResponse> uploadBase64File(Base64FileUploadRequest request) {
    FileUploadResponse response = fileStorageService.storeBase64File(request);
    return ResponseEntity.ok(response);
  }

  @Override
  public ResponseEntity<FileInfo> getFileInfo(String filePath) {
    FileInfo fileInfo = fileStorageService.getFileInfo(filePath);
    return ResponseEntity.ok(fileInfo);
  }

  @Override
  public ResponseEntity<Base64FileResponse> getFileAsBase64(String filePath) {
    Base64FileResponse response = fileStorageService.getFileAsBase64(filePath);
    return ResponseEntity.ok(response);
  }
}
