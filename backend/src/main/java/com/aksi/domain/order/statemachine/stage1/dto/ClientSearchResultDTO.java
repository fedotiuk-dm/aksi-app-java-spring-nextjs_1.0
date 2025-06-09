package com.aksi.domain.order.statemachine.stage1.dto;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.client.dto.ClientResponse;

/**
 * DTO для результатів пошуку клієнта в етапі 1.1 з підтримкою пагінації.
 * Містить список знайдених клієнтів та метадані пошуку з пагінацією.
 */
public class ClientSearchResultDTO {

    /**
     * Список знайдених клієнтів на поточній сторінці.
     */
    private List<ClientResponse> clients;

    /**
     * Критерії пошуку що були використані.
     */
    private ClientSearchCriteriaDTO searchCriteria;

    /**
     * Загальна кількість знайдених результатів.
     */
    private long totalElements;

    /**
     * Загальна кількість сторінок.
     */
    private int totalPages;

    /**
     * Номер поточної сторінки (з нуля).
     */
    private int pageNumber;

    /**
     * Розмір сторінки.
     */
    private int pageSize;

    /**
     * Чи є попередня сторінка.
     */
    private boolean hasPrevious;

    /**
     * Чи є наступна сторінка.
     */
    private boolean hasNext;

    /**
     * Час виконання пошуку в мілісекундах.
     */
    private long searchTimeMs;

    /**
     * Чи є пошук точним (за конкретними критеріями) чи загальним.
     */
    private boolean exactSearch;

    // Конструктори
    public ClientSearchResultDTO() {
        this.clients = new ArrayList<>();
    }

    public ClientSearchResultDTO(List<ClientResponse> clients, ClientSearchCriteriaDTO searchCriteria) {
        this.clients = clients != null ? clients : new ArrayList<>();
        this.searchCriteria = searchCriteria;
        this.totalElements = this.clients.size();
    }

    // Геттери та сеттери
    public List<ClientResponse> getClients() {
        return clients;
    }

    public void setClients(List<ClientResponse> clients) {
        this.clients = clients != null ? clients : new ArrayList<>();
        this.totalElements = this.clients.size();
    }

    public ClientSearchCriteriaDTO getSearchCriteria() {
        return searchCriteria;
    }

    public void setSearchCriteria(ClientSearchCriteriaDTO searchCriteria) {
        this.searchCriteria = searchCriteria;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public long getSearchTimeMs() {
        return searchTimeMs;
    }

    public void setSearchTimeMs(long searchTimeMs) {
        this.searchTimeMs = searchTimeMs;
    }

    public boolean isExactSearch() {
        return exactSearch;
    }

    public void setExactSearch(boolean exactSearch) {
        this.exactSearch = exactSearch;
    }

    /**
     * Перевіряє чи є результати пошуку.
     */
    public boolean hasResults() {
        return clients != null && !clients.isEmpty();
    }

    /**
     * Перевіряє чи знайдено точно одного клієнта.
     */
    public boolean hasSingleResult() {
        return clients != null && clients.size() == 1;
    }

    /**
     * Отримує першого клієнта з результатів (якщо є).
     */
    public ClientResponse getFirstClient() {
        return hasResults() ? clients.get(0) : null;
    }

    /**
     * Додає клієнта до результатів.
     */
    public void addClient(ClientResponse client) {
        if (client != null) {
            this.clients.add(client);
            this.totalElements = this.clients.size();
        }
    }

    @Override
    public String toString() {
        return "ClientSearchResultDTO{" +
                "totalElements=" + totalElements +
                ", totalPages=" + totalPages +
                ", pageNumber=" + pageNumber +
                ", pageSize=" + pageSize +
                ", searchTimeMs=" + searchTimeMs +
                ", exactSearch=" + exactSearch +
                ", hasResults=" + hasResults() +
                '}';
    }
}
