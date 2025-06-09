package com.aksi.domain.order.statemachine.stage2.substep5.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.aksi.domain.order.dto.OrderItemPhotoDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO для підетапу 2.5: Фотодокументація.
 * Використовує існуючі domain DTO.
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDocumentationDTO {

    /**
     * Унікальний ідентифікатор сесії фотодокументації.
     */
    private UUID sessionId;

    /**
     * Ідентифікатор предмета для якого ведеться фотодокументація.
     */
    private UUID itemId;

    /**
     * Список фотографій предмета (з domain).
     */
    @Builder.Default
    private List<OrderItemPhotoDTO> photos = new ArrayList<>();

    /**
     * Максимальна кількість фотографій для одного предмета.
     */
    @Builder.Default
    private Integer maxPhotosAllowed = 5;

    /**
     * Максимальний розмір файлу в мегабайтах.
     */
    @Builder.Default
    private Long maxFileSizeMB = 5L;

    /**
     * Чи завершена фотодокументація.
     */
    @Builder.Default
    private Boolean documentationCompleted = false;

    /**
     * Час початку фотодокументації.
     */
    private LocalDateTime startTime;

    /**
     * Час завершення фотодокументації.
     */
    private LocalDateTime completionTime;

    /**
     * Примітки до фотодокументації.
     */
    private String notes;
}
