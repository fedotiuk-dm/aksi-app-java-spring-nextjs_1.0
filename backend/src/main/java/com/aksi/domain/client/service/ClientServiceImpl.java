package com.aksi.domain.client.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.domain.client.dto.ClientPageResponse;
import com.aksi.domain.client.dto.ClientProjection;
import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.ClientSearchRequest;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.dto.UpdateClientRequest;
import com.aksi.domain.client.entity.AddressEntity;
import com.aksi.domain.client.entity.ClientEntity;
import com.aksi.domain.client.enums.ClientSource;
import com.aksi.domain.client.event.ClientAddressChangedEvent;
import com.aksi.domain.client.event.ClientCreatedEvent;
import com.aksi.domain.client.event.ClientUpdatedEvent;
import com.aksi.domain.client.mapper.AddressMapper;
import com.aksi.domain.client.mapper.ClientMapper;
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
    private final ClientMapper clientMapper;
    private final AddressMapper addressMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> getAllClients() {
        log.debug("Отримання списку всіх клієнтів");
        return clientRepository.findAll().stream()
                .map(clientMapper::toClientResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClientPageResponse getAllClientsPaged(int page, int size) {
        log.debug("Отримання списку всіх клієнтів з пагінацією: сторінка {}, розмір {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<ClientEntity> clientsPage = clientRepository.findAll(pageable);

        List<ClientResponse> clientResponses = clientsPage.getContent().stream()
                .map(clientMapper::toClientResponse)
                .collect(Collectors.toList());

        return buildClientPageResponse(clientsPage, clientResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getClientById(UUID id) {
        log.debug("Отримання клієнта за ID: {}", id);
        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Client", id));
        return clientMapper.toClientResponse(client);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> searchClients(String keyword) {
        log.debug("Пошук клієнтів за ключовим словом: {}", keyword);
        return clientRepository.searchByKeyword(keyword).stream()
                .map(clientMapper::toClientResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClientPageResponse searchClients(ClientSearchRequest request) {
        log.debug("Пошук клієнтів з пагінацією: {}", request);

        String keyword = request.getQuery() != null ? request.getQuery().trim() : "";
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize());

        log.info("ДІАГНОСТИКА ПОШУКУ з ПАГІНАЦІЄЮ: запит='{}', сторінка={}, розмір={}",
                keyword, request.getPage(), request.getSize());
        log.info("ДІАГНОСТИКА ПОШУКУ: створено Pageable з параметрами: сторінка={}, розмір={}, offset={}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getOffset());

        // Використовуємо проекцію, щоб уникнути проблем з lazy loading
        Page<ClientProjection> clientsProjectionPage;

        if (keyword.isEmpty()) {
            // Порожній запит - повертаємо пусту сторінку
            log.info("ДІАГНОСТИКА ПОШУКУ: запит порожній, повертаємо пусту сторінку");
            return ClientPageResponse.builder()
                    .content(List.of())
                    .totalElements(0)
                    .totalPages(0)
                    .pageNumber(request.getPage())
                    .pageSize(request.getSize())
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        } else if (keyword.length() < 2) {
            // Запит закороткий - повертаємо пусту сторінку
            log.info("ДІАГНОСТИКА ПОШУКУ: запит '{}' закороткий (менше 2 символів), повертаємо пусту сторінку", keyword);
            return ClientPageResponse.builder()
                    .content(List.of())
                    .totalElements(0)
                    .totalPages(0)
                    .pageNumber(request.getPage())
                    .pageSize(request.getSize())
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        } else {
            // Використовуємо розширений пошук з проекцією, включно з адресою
            log.info("ДІАГНОСТИКА ПОШУКУ: використовуємо розширений пошук з проекцією для запиту '{}'", keyword);
            clientsProjectionPage = clientRepository.fullTextSearchProjection(keyword, pageable);

            // Логування результатів пошуку
            log.info("ДІАГНОСТИКА ПОШУКУ: запит='{}', знайдено {} клієнтів із загальних {}",
                    keyword, clientsProjectionPage.getContent().size(), clientsProjectionPage.getTotalElements());
            log.info("ДІАГНОСТИКА ПАГІНАЦІЇ: номер сторінки={}, розмір сторінки={}, всього сторінок={}, hasNext={}, hasPrevious={}",
                    clientsProjectionPage.getNumber(), clientsProjectionPage.getSize(),
                    clientsProjectionPage.getTotalPages(), clientsProjectionPage.hasNext(),
                    clientsProjectionPage.hasPrevious());

            if (clientsProjectionPage.isEmpty()) {
                log.warn("ДІАГНОСТИКА ПОШУКУ: запит '{}' не дав результатів. Перевірте налаштування пошуку", keyword);
            }

            // Конвертуємо проекцію в відповідь
            return convertToClientPageResponse(clientsProjectionPage);
        }
    }

    /**
     * Конвертує сторінку проекцій клієнтів у відповідь ClientPageResponse.
     *
     * @param projectionPage сторінка проекцій клієнтів
     * @return відповідь з клієнтами
     */
    private ClientPageResponse convertToClientPageResponse(Page<ClientProjection> projectionPage) {
        List<ClientResponse> clientResponses = projectionPage.getContent().stream()
                .map(projection -> ClientResponse.builder()
                        .id(projection.getId())
                        .firstName(projection.getFirstName())
                        .lastName(projection.getLastName())
                        .phone(projection.getPhone())
                        .email(projection.getEmail())
                        .build())
                .collect(Collectors.toList());

        return ClientPageResponse.builder()
                .content(clientResponses)
                .totalElements(projectionPage.getTotalElements())
                .totalPages(projectionPage.getTotalPages())
                .pageNumber(projectionPage.getNumber())
                .pageSize(projectionPage.getSize())
                .hasNext(projectionPage.hasNext())
                .hasPrevious(projectionPage.hasPrevious())
                .build();
    }

    /**
     * Допоміжний метод для побудови відповіді з пагінацією.
     *
     * @param clientsPage сторінка з клієнтами
     * @param clientResponses перетворені відповіді
     * @return об'єкт відповіді з пагінацією
     */
    private ClientPageResponse buildClientPageResponse(Page<ClientEntity> clientsPage, List<ClientResponse> clientResponses) {
        return ClientPageResponse.builder()
                .content(clientResponses)
                .totalElements(clientsPage.getTotalElements())
                .totalPages(clientsPage.getTotalPages())
                .pageNumber(clientsPage.getNumber())
                .pageSize(clientsPage.getSize())
                .hasPrevious(clientsPage.hasPrevious())
                .hasNext(clientsPage.hasNext())
                .build();
    }

    @Override
    @Transactional
    public ClientResponse createClient(CreateClientRequest request) {
        log.debug("Створення нового клієнта: {} {}", request.getFirstName(), request.getLastName());

        validateClientData(null, request.getPhone(), request.getEmail(), request.getSource(), request.getSourceDetails());

        ClientEntity client = clientMapper.createEntityFromRequest(request, addressMapper);
        ClientEntity savedClient = clientRepository.save(client);

        // Публікуємо подію створення клієнта
        eventPublisher.publishEvent(new ClientCreatedEvent(savedClient));

        return clientMapper.toClientResponse(savedClient);
    }

    @Override
    @Transactional
    public ClientResponse updateClient(UUID id, UpdateClientRequest request) {
        log.debug("Оновлення клієнта з ID: {}", id);

        ClientEntity client = clientRepository.findById(id)
                .orElseThrow(() -> EntityNotFoundException.withTypeAndId("Client", id));

        validateClientData(client, request.getPhone(), request.getEmail(), request.getSource(), request.getSourceDetails());

        // Перевіряємо зміну адреси для публікації події
        AddressEntity oldAddress = client.getAddress();

        // Оновлюємо клієнта
        ClientEntity updatedClient = clientMapper.updateEntityFromUpdateRequest(request, client, addressMapper);
        updatedClient = clientRepository.save(updatedClient);

        // Публікуємо події про зміни
        publishUpdateEvents(client, request, oldAddress, updatedClient.getAddress());

        return clientMapper.toClientResponse(updatedClient);
    }

    /**
     * Публікує події про зміни в клієнті.
     *
     * @param originalClient оригінальний клієнт до змін
     * @param request запит на оновлення
     * @param oldAddress стара адреса
     * @param newAddress нова адреса
     */
    private void publishUpdateEvents(ClientEntity originalClient, UpdateClientRequest request,
                                    AddressEntity oldAddress, AddressEntity newAddress) {
        // Перевіряємо зміну адреси
        if (addressChanged(oldAddress, newAddress)) {
            eventPublisher.publishEvent(new ClientAddressChangedEvent(originalClient, oldAddress, newAddress));
        }

        // Перевіряємо зміну основних даних клієнта
        if (request.getFirstName() != null && !request.getFirstName().equals(originalClient.getFirstName())) {
            eventPublisher.publishEvent(new ClientUpdatedEvent(
                originalClient, "firstName", originalClient.getFirstName(), request.getFirstName()));
        }

        if (request.getLastName() != null && !request.getLastName().equals(originalClient.getLastName())) {
            eventPublisher.publishEvent(new ClientUpdatedEvent(
                originalClient, "lastName", originalClient.getLastName(), request.getLastName()));
        }

        if (request.getPhone() != null && !request.getPhone().equals(originalClient.getPhone())) {
            eventPublisher.publishEvent(new ClientUpdatedEvent(
                originalClient, "phone", originalClient.getPhone(), request.getPhone()));
        }

        if (request.getEmail() != null && !request.getEmail().equals(originalClient.getEmail())) {
            eventPublisher.publishEvent(new ClientUpdatedEvent(
                originalClient, "email", originalClient.getEmail() != null ? originalClient.getEmail() : "",
                request.getEmail()));
        }
    }

    /**
     * Перевіряє, чи змінилася адреса.
     *
     * @param oldAddress стара адреса
     * @param newAddress нова адреса
     * @return true, якщо адреса змінилася
     */
    private boolean addressChanged(AddressEntity oldAddress, AddressEntity newAddress) {
        if (oldAddress == null && newAddress == null) {
            return false;
        }

        if (oldAddress == null || newAddress == null) {
            return true;
        }

        // Порівнюємо адреси за вмістом, безпечно до null
        return !Objects.equals(oldAddress.formatFullAddress(), newAddress.formatFullAddress());
    }

    @Override
    @Transactional
    public void deleteClient(UUID id) {
        log.debug("Видалення клієнта з ID: {}", id);
        if (!clientRepository.existsById(id)) {
            throw EntityNotFoundException.withTypeAndId("Client", id);
        }
        clientRepository.deleteById(id);
        log.info("Видалено клієнта з ID: {}", id);
    }

    /**
     * Валідація даних клієнта.
     *
     * @param client поточний клієнт (може бути null для нового клієнта)
     * @param phone номер телефону
     * @param email email
     * @param source джерело
     * @param sourceDetails деталі джерела
     */
    private void validateClientData(ClientEntity client, String phone, String email,
                                    ClientSource source, String sourceDetails) {
        validateUniquePhone(client, phone);
        validateUniqueEmail(client, email);
        validateSourceDetails(source, sourceDetails);
    }

    /**
     * Перевіряє унікальність телефону.
     * @param client поточний клієнт (може бути null для нового клієнта)
     * @param phone номер телефону для перевірки
     */
    private void validateUniquePhone(ClientEntity client, String phone) {
        if (phone == null || phone.isEmpty()) {
            return;
        }

        Optional<ClientEntity> existingClient = clientRepository.findByPhone(phone);
        if (existingClient.isPresent() && (client == null || !existingClient.get().getId().equals(client.getId()))) {
            throw new IllegalArgumentException("Клієнт з таким номером телефону вже існує");
        }
    }

    /**
     * Перевіряє унікальність email.
     * @param client поточний клієнт (може бути null для нового клієнта)
     * @param email email для перевірки
     */
    private void validateUniqueEmail(ClientEntity client, String email) {
        if (email == null || email.isEmpty()) {
            return;
        }

        Optional<ClientEntity> existingClient = clientRepository.findByEmail(email);
        if (existingClient.isPresent() && (client == null || !existingClient.get().getId().equals(client.getId()))) {
            throw new IllegalArgumentException("Клієнт з таким email вже існує");
        }
    }

    /**
     * Перевіряє, чи надано деталі джерела, якщо вибрано "Інше".
     * @param source тип джерела
     * @param sourceDetails деталі джерела
     */
    private void validateSourceDetails(ClientSource source, String sourceDetails) {
        if (source == ClientSource.OTHER && (sourceDetails == null || sourceDetails.isEmpty())) {
            throw new IllegalArgumentException("Деталі джерела обов'язкові, якщо вибрано 'Інше'");
        }
    }
}
