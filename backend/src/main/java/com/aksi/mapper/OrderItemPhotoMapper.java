package com.aksi.mapper;

import com.aksi.domain.order.entity.OrderItem;
import com.aksi.domain.order.entity.OrderItemPhoto;
import com.aksi.dto.order.OrderItemPhotoDto;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Mapper for converting between OrderItemPhoto entity and DTOs.
 */
@Mapper(componentModel = "spring", 
        uses = {UuidMapper.class},
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface OrderItemPhotoMapper extends BaseMapper {
    
    /**
     * Convert OrderItemPhoto entity to OrderItemPhotoDto.
     * 
     * @param photo The OrderItemPhoto entity
     * @return OrderItemPhotoDto
     */
    @Mapping(target = "orderItemId", source = "orderItem.id")
    OrderItemPhotoDto toDto(OrderItemPhoto photo);
    
    /**
     * Convert a list of OrderItemPhoto entities to a list of OrderItemPhotoDto objects.
     * 
     * @param photos The list of OrderItemPhoto entities
     * @return List of OrderItemPhotoDto objects
     */
    List<OrderItemPhotoDto> toDtoList(List<OrderItemPhoto> photos);
    
    /**
     * Create a new OrderItemPhoto entity.
     * 
     * @param fileName The file name
     * @param url The URL to access the photo
     * @param contentType The MIME type of the photo
     * @param size The size of the photo in bytes
     * @param description The description of the photo
     * @param annotationData The annotation data (JSON)
     * @param orderItem The OrderItem entity that this photo belongs to
     * @return OrderItemPhoto entity
     */
    @Mapping(target = "id", ignore = true) // UUID буде згенеровано автоматично
    @Mapping(target = "orderItem", source = "orderItem")
    @Mapping(target = "fileName", source = "fileName")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "contentType", source = "contentType")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "annotationData", source = "annotationData")
    @Mapping(target = "uploadedAt", expression = "java(getCurrentDateTime())")
    OrderItemPhoto createPhoto(String fileName, String url, String contentType, Long size, 
                              String description, String annotationData, OrderItem orderItem);
    
    /**
     * Update an existing OrderItemPhoto entity.
     * 
     * @param photo The existing OrderItemPhoto entity to update
     * @param description The new description
     * @param annotationData The new annotation data (JSON)
     * @return The updated OrderItemPhoto entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderItem", ignore = true)
    @Mapping(target = "fileName", ignore = true)
    @Mapping(target = "url", ignore = true)
    @Mapping(target = "contentType", ignore = true)
    @Mapping(target = "size", ignore = true)
    @Mapping(target = "uploadedAt", ignore = true)
    OrderItemPhoto updatePhoto(@MappingTarget OrderItemPhoto photo, String description, String annotationData);
    
    /**
     * Helper method to get the current date and time.
     * 
     * @return Current date and time
     */
    default LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now();
    }
    
    /**
     * This method is needed when working with @Mapping annotations to handle UUID type correctly.
     * It's an identity function to properly map UUID fields in the MapStruct process.
     * 
     * @param uuid The UUID to map
     * @return The same UUID (identity mapping)
     */
    default UUID mapUuid(UUID uuid) {
        return uuid;
    }
}
