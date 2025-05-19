package com.aksi.domain.client.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.entity.ClientSourceEntity;
import com.aksi.domain.client.repository.ClientRepository;
import com.aksi.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Реалізація сервісу для роботи з клієнтами.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public List<ClientResponse> getAllClients() {
        log.debug("Отримання списку всіх клієнтів");
        return clientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponse getClientById(UUID id) {
        log.debug("Отримання клієнта за ID: {}", id);
        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Client", id));
        return mapToResponse(client);
    }

    @Override
    public List<ClientResponse> searchClients(String keyword) {
        log.debug("Пошук клієнтів за ключовим словом: {}", keyword);
        return clientRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClientResponse createClient(CreateClientRequest request) {
        log.debug("Створення нового клієнта: {} {}", request.getFirstName(), request.getLastName());

        validateUniquePhone(null, request.getPhone());
        validateUniqueEmail(null, request.getEmail());
        validateSourceDetails(request.getSource(), request.getSourceDetails());

        ClientEntity client = ClientEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .communicationChannels(request.getCommunicationChannels())
                .source(request.getSource())
                .sourceDetails(request.getSourceDetails())
                .build();

        ClientEntity savedClient = clientRepository.save(client);
        log.info("Створено нового клієнта з ID: {}", savedClient.getId());

        return mapToResponse(savedClient);
    }

    @Override
    @Transactional
    public ClientResponse updateClient(UUID id, UpdateClientRequest request) {
        log.debug("Оновлення клієнта з ID: {}", id);

        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Client", id));

        validateUniquePhone(client, request.getPhone());
        validateUniqueEmail(client, request.getEmail());
        validateSourceDetails(request.getSource(), request.getSourceDetails());

        updateClientFields(client, request);

        ClientEntity updatedClient = clientRepository.save(client);
        log.info("Оновлено клієнта з ID: {}", updatedClient.getId());

        return mapToResponse(updatedClient);
    }

    @Override
    @Transactional
    public void deleteClient(UUID id) {
        log.debug("Видалення клієнта з ID: {}", id);

        if (!clientRepository.existsById(id)) {
            throw EntityNotFoundException.withMessage("Клієнта з ID " + id + " не знайдено");
        }

        clientRepository.deleteById(id);
        log.info("Видалено клієнта з ID: {}", id);
    }

    /**
     * Перевіряє унікальність телефону клієнта.
     * @param client існуючий клієнт (може бути null для нового клієнта)
     * @param phone новий телефон для перевірки
     */
    private void validateUniquePhone(ClientEntity client, String phone) {
        if (phone == null) {
            return;
        }

        boolean isPhoneChanged = client != null && !phone.equals(client.getPhone());
        boolean isNewClient = client == null;

        if ((isNewClient || isPhoneChanged) && clientRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("Клієнт з телефоном " + phone + " вже існує");
        }
    }

    /**
     * Перевіряє унікальність email клієнта.
     * @param client існуючий клієнт (може бути null для нового клієнта)
     * @param email новий email для перевірки
     */
    private void validateUniqueEmail(ClientEntity client, String email) {
        if (email == null || email.isEmpty()) {
            return;
        }

        boolean isEmailChanged = client != null && !email.equals(client.getEmail());
        boolean isNewClient = client == null;

        if ((isNewClient || isEmailChanged) && clientRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Клієнт з email " + email + " вже існує");
        }
    }

    /**
     * Перевіряє наявність деталей джерела, якщо вибрано "Інше".
     * @param source джерело
     * @param sourceDetails деталі джерела
     */
    private void validateSourceDetails(ClientSourceEntity source, String sourceDetails) {
        if (source == ClientSourceEntity.OTHER && (sourceDetails == null || sourceDetails.isEmpty())) {
            throw new IllegalArgumentException("Для джерела 'Інше' необхідно вказати деталі");
        }
    }

    /**
     * Оновлює поля клієнтської сутності з DTO запиту.
     * @param client сутність для оновлення
     * @param request DTO з новими даними
     */
    private void updateClientFields(ClientEntity client, UpdateClientRequest request) {
        Optional.ofNullable(request.getFirstName()).ifPresent(client::setFirstName);
        Optional.ofNullable(request.getLastName()).ifPresent(client::setLastName);
        Optional.ofNullable(request.getPhone()).ifPresent(client::setPhone);
        Optional.ofNullable(request.getEmail()).ifPresent(client::setEmail);
        Optional.ofNullable(request.getAddress()).ifPresent(client::setAddress);
        Optional.ofNullable(request.getCommunicationChannels()).ifPresent(client::setCommunicationChannels);

        // Особлива логіка для джерела інформації
        Optional.ofNullable(request.getSource()).ifPresent(source -> {
            client.setSource(source);

            if (source != ClientSourceEntity.OTHER) {
                client.setSourceDetails(null);
            } else if (request.getSourceDetails() != null) {
                client.setSourceDetails(request.getSourceDetails());
            }
        });
    }

    /**
     * Конвертує сутність клієнта в DTO для відповіді.
     * @param client сутність клієнта
     * @return DTO клієнта
     */
    private ClientResponse mapToResponse(ClientEntity client) {
        return ClientResponse.builder()
                .id(client.getId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .fullName(client.getLastName() + " " + client.getFirstName())
                .phone(client.getPhone())
                .email(client.getEmail())
                .address(client.getAddress())
                .communicationChannels(client.getCommunicationChannels())
                .source(client.getSource())
                .sourceDetails(client.getSourceDetails())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }
}
