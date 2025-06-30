package com.aksi.domain.item.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.item.dto.PhotoResponse;
import com.aksi.api.item.dto.UpdatePhotoMetadataRequest;
import com.aksi.domain.item.entity.ItemPhotoEntity;
import com.aksi.domain.item.exception.ItemPhotoNotFoundException;
import com.aksi.domain.item.mapper.ItemPhotoMapper;
import com.aksi.domain.item.repository.ItemPhotoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Сервіс для управління фотографіями предметів.
 *
 * Архітектура:
 * - API методи (public) - працюють з DTO для контролерів
 * - Entity методи (package-private) - працюють з Entity для внутрішньої логіки
 * - Business logic + validation + transaction management
 * - File management специфіка для фото
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ItemPhotoService {

    private final ItemPhotoRepository repository;
    private final ItemPhotoMapper mapper;

    // ========== API МЕТОДИ (для контролерів) - DTO ↔ DTO ==========

    /**
     * Отримати фото за UUID
     */
    @Transactional(readOnly = true)
    public PhotoResponse getPhotoById(UUID uuid) {
        var entity = findByUuid(uuid);
        return enrichAndMapToResponse(entity);
    }

    /**
     * Оновити метадані фото
     */
    public PhotoResponse updatePhotoMetadata(UUID uuid, UpdatePhotoMetadataRequest request) {
        var entity = findByUuid(uuid);

        mapper.updateEntityFromRequest(request, entity);
        var savedEntity = repository.save(entity);
        return enrichAndMapToResponse(savedEntity);
    }

    /**
     * Видалити фото
     */
    public void deletePhoto(UUID uuid) {
        var entity = findByUuid(uuid);
        repository.delete(entity);
    }

    /**
     * Отримати всі фото з пагінацією
     */
    @Transactional(readOnly = true)
    public Page<PhotoResponse> getPhotos(Pageable pageable) {
        var entityPage = repository.findAll(pageable);
        return entityPage.map(this::enrichAndMapToResponse);
    }

    /**
     * Отримати фото для конкретного предмета
     */
    @Transactional(readOnly = true)
    public List<PhotoResponse> getPhotosForItem(UUID itemId) {
        var entities = repository.findByItemId(itemId);
        return entities.stream()
            .map(this::enrichAndMapToResponse)
            .toList();
    }

    /**
     * Отримати головне фото предмета
     */
    @Transactional(readOnly = true)
    public PhotoResponse getPrimaryPhotoForItem(UUID itemId) {
        var entity = repository.findByItemIdAndIsPrimaryTrue(itemId);
        return entity.map(this::enrichAndMapToResponse)
            .orElse(null);
    }

    /**
     * Встановити фото як головне
     */
    public PhotoResponse setPrimaryPhoto(UUID uuid) {
        var entity = findByUuid(uuid);

        // Зняти primary з інших фото цього предмета
        var otherPhotos = repository.findByItemIdAndIsPrimaryTrue(entity.getItemId());
        otherPhotos.ifPresent(photo -> {
            photo.setIsPrimary(false);
            repository.save(photo);
        });

        // Встановити як primary
        entity.setIsPrimary(true);
        var savedEntity = repository.save(entity);
        return enrichAndMapToResponse(savedEntity);
    }

    // ========== HELPER МЕТОДИ ==========

    /**
     * Знайти фото за UUID (internal helper)
     */
    private ItemPhotoEntity findByUuid(UUID uuid) {
        return repository.findByUuid(uuid)
            .orElseThrow(() -> new ItemPhotoNotFoundException(uuid));
    }

    /**
     * Збагатити entity додатковими даними та змапити до Response
     */
    private PhotoResponse enrichAndMapToResponse(ItemPhotoEntity entity) {
        return mapper.toResponse(entity);
    }
}
