package com.aksi.domain.client.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

/**
 * DTO для запиту на оновлення існуючого клієнта.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UpdateClientRequest extends BaseClientRequest {
    // Наслідує всі поля від базового класу
}
