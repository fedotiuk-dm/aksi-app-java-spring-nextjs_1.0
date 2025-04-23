package com.aksi.service.order.impl;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemPhoto;
import com.aksi.domain.order.repository.OrderItemPhotoRepository;
import com.aksi.domain.order.repository.OrderItemRepository;
import com.aksi.dto.order.OrderItemPhotoDto;
import com.aksi.exception.EntityNotFoundException;
import com.aksi.mapper.OrderItemPhotoMapper;
import com.aksi.service.order.OrderItemPhotoService;
import com.aksi.service.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Реалізація сервісу для роботи з фотографіями предметів замовлень.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemPhotoServiceImpl implements OrderItemPhotoService {

    private final OrderItemRepository orderItemRepository;
    private final OrderItemPhotoRepository orderItemPhotoRepository;
    private final OrderItemPhotoMapper orderItemPhotoMapper;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public OrderItemPhotoDto uploadPhoto(UUID itemId, MultipartFile file, String description) throws IOException {
        log.debug("Uploading photo for order item ID: {}", itemId);
        
        // Перевірка наявності предмета замовлення
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found with ID: " + itemId));
        
        // Валідація типу файлу (дозволені лише зображення)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
        
        // Збереження файлу
        String fileName = fileStorageService.storeFile(file);
        String fileUrl = fileStorageService.getFileUrl(fileName);
        
        // Створення запису про фотографію
        OrderItemPhoto photo = OrderItemPhoto.builder()
                .orderItem(orderItem)
                .fileName(fileName)
                .url(fileUrl)
                .contentType(contentType)
                .size(file.getSize())
                .description(description)
                .uploadedAt(LocalDateTime.now())
                .build();
        
        // Збереження в базі даних
        OrderItemPhoto savedPhoto = orderItemPhotoRepository.save(photo);
        
        log.info("Photo successfully uploaded for order item ID: {} with photo ID: {}", itemId, savedPhoto.getId());
        
        return orderItemPhotoMapper.toDto(savedPhoto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderItemPhotoDto> getPhotosForOrderItem(UUID itemId) {
        log.debug("Fetching photos for order item ID: {}", itemId);
        
        // Перевірка наявності предмета замовлення
        if (!orderItemRepository.existsById(itemId)) {
            throw new EntityNotFoundException("Order item not found with ID: " + itemId);
        }
        
        // Отримання всіх фотографій для предмета замовлення
        List<OrderItemPhoto> photos = orderItemPhotoRepository.findByOrderItemId(itemId);
        
        return photos.stream()
                .map(orderItemPhotoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderItemPhotoDto getPhoto(UUID photoId) {
        log.debug("Fetching photo with ID: {}", photoId);
        
        OrderItemPhoto photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found with ID: " + photoId));
        
        return orderItemPhotoMapper.toDto(photo);
    }

    @Override
    @Transactional
    public OrderItemPhotoDto updatePhotoDetails(UUID photoId, String description, String annotationData) {
        log.debug("Updating details for photo ID: {}", photoId);
        
        OrderItemPhoto photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found with ID: " + photoId));
        
        // Оновлення полів, якщо вони не null
        if (description != null) {
            photo.setDescription(description);
        }
        
        if (annotationData != null) {
            photo.setAnnotationData(annotationData);
        }
        
        OrderItemPhoto updatedPhoto = orderItemPhotoRepository.save(photo);
        
        log.info("Photo details updated for photo ID: {}", photoId);
        
        return orderItemPhotoMapper.toDto(updatedPhoto);
    }

    @Override
    @Transactional
    public void deletePhoto(UUID photoId) {
        log.debug("Deleting photo with ID: {}", photoId);
        
        OrderItemPhoto photo = orderItemPhotoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found with ID: " + photoId));
        
        // Видалення файлу
        fileStorageService.deleteFile(photo.getFileName());
        
        // Видалення запису з бази даних
        orderItemPhotoRepository.delete(photo);
        
        log.info("Photo deleted with ID: {}", photoId);
    }
}
