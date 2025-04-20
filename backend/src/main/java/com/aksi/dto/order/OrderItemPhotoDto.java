package com.aksi.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Data Transfer Object for OrderItemPhoto entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemPhotoDto {
    private UUID id;
    private UUID orderItemId;
    private String fileName;
    private String url;
    private String contentType;
    private Long size;
    private String description;
    private String annotationData;
    private LocalDateTime uploadedAt;
}
