package com.aksi.domain.order.statemachine.stage1.dto;

import java.util.ArrayList;
import java.util.List;

import com.aksi.domain.client.dto.ClientResponse;

/**
 * DTO для результатів пошуку клієнта в етапі 1.1.
 * Містить список знайдених клієнтів та метадані пошуку.
 */
public class ClientSearchResultDTO {

    /**
     * Список знайдених клієнтів.
     */
    private List<ClientResponse> clients;

    /**
     * Критерії пошуку що були використані.
     */
    private ClientSearchCriteriaDTO searchCriteria;

    /**
     * Загальна кількість знайдених результатів.
     */
    private int totalResults;

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
        this.totalResults = this.clients.size();
    }

    // Геттери та сеттери
    public List<ClientResponse> getClients() {
        return clients;
    }

    public void setClients(List<ClientResponse> clients) {
        this.clients = clients != null ? clients : new ArrayList<>();
        this.totalResults = this.clients.size();
    }

    public ClientSearchCriteriaDTO getSearchCriteria() {
        return searchCriteria;
    }

    public void setSearchCriteria(ClientSearchCriteriaDTO searchCriteria) {
        this.searchCriteria = searchCriteria;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
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
            this.totalResults = this.clients.size();
        }
    }

    @Override
    public String toString() {
        return "ClientSearchResultDTO{" +
                "totalResults=" + totalResults +
                ", searchTimeMs=" + searchTimeMs +
                ", exactSearch=" + exactSearch +
                ", hasResults=" + hasResults() +
                '}';
    }
}
