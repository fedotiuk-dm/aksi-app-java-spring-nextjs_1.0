package com.aksi.domain.branch.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.BranchSummaryResponse;
import com.aksi.api.branch.dto.BranchWithDistanceResponse;
import com.aksi.domain.branch.entity.BranchEntity;
import com.aksi.domain.branch.mapper.BranchMapper;
import com.aksi.domain.branch.repository.BranchRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Сервіс для роботи з геолокацією та пошуком філій Відповідальність: географічний пошук, відстані,
 * швидкий пошук.
 */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BranchLocationService {

  private final BranchRepository branchRepository;
  private final BranchMapper branchMapper;

  // API методи (для контролерів) - працюють з DTO

  /** Швидкий пошук філій за текстом. */
  @Transactional(readOnly = true)
  public List<BranchSummaryResponse> quickSearch(String query, int limit) {
    log.debug("Quick search branches: '{}', limit: {}", query, limit);

    List<BranchEntity> entities = quickSearchBranches(query, limit);
    return branchMapper.toBranchSummaryResponseList(entities);
  }

  /** Знайти найближчі філії за координатами. */
  @Transactional(readOnly = true)
  public List<BranchWithDistanceResponse> findNearbyBranches(
      double latitude, double longitude, double radiusKm, int limit) {
    log.debug(
        "Finding branches near ({}, {}) within {}km, limit: {}",
        latitude,
        longitude,
        radiusKm,
        limit);

    List<BranchEntity> nearbyBranches = findNearby(latitude, longitude, radiusKm, limit);

    return nearbyBranches.stream()
        .map(
            branch -> {
              double distance =
                  calculateDistance(
                      latitude,
                      longitude,
                      branch.getCoordinates().getLatitude(),
                      branch.getCoordinates().getLongitude());
              return branchMapper.toBranchWithDistanceResponse(branch, distance);
            })
        .toList();
  }

  /** Знайти філії в конкретному місті. */
  @Transactional(readOnly = true)
  public List<BranchSummaryResponse> findBranchesByCity(String city) {
    log.debug("Finding branches in city: {}", city);

    List<BranchEntity> entities = branchRepository.findByCityIgnoreCase(city);
    return branchMapper.toBranchSummaryResponseList(entities);
  }

  /** Отримати всі міста з філіями. */
  @Transactional(readOnly = true)
  public List<String> getAllCities() {
    log.debug("Getting all cities with branches");

    return branchRepository.findAllCities();
  }

  /** Розрахувати відстань між двома точками. */
  public double calculateDistanceBetweenBranches(UUID branch1Id, UUID branch2Id) {
    log.debug("Calculating distance between branches: {} and {}", branch1Id, branch2Id);

    BranchEntity branch1 =
        branchRepository
            .findById(branch1Id)
            .orElseThrow(() -> new RuntimeException("Branch not found: " + branch1Id));
    BranchEntity branch2 =
        branchRepository
            .findById(branch2Id)
            .orElseThrow(() -> new RuntimeException("Branch not found: " + branch2Id));

    return calculateDistance(
        branch1.getCoordinates().getLatitude(), branch1.getCoordinates().getLongitude(),
        branch2.getCoordinates().getLatitude(), branch2.getCoordinates().getLongitude());
  }

  /** Знайти найближчі філії (для API контролера). */
  @Transactional(readOnly = true)
  public List<BranchWithDistanceResponse> getNearbyBranches(
      java.math.BigDecimal latitude,
      java.math.BigDecimal longitude,
      java.math.BigDecimal radius,
      Integer limit) {
    log.debug(
        "API: Finding branches near ({}, {}) within {}km, limit: {}",
        latitude,
        longitude,
        radius,
        limit);

    double lat = latitude != null ? latitude.doubleValue() : 0.0;
    double lon = longitude != null ? longitude.doubleValue() : 0.0;
    double rad = radius != null ? radius.doubleValue() : 10.0;
    int lmt = limit != null ? limit : 10;

    return findNearbyBranches(lat, lon, rad, lmt);
  }

  // Entity методи (для внутрішньої логіки)

  /** Швидкий пошук філій (Entity рівень). */
  @Transactional(readOnly = true)
  public List<BranchEntity> quickSearchBranches(String query, int limit) {
    if (query == null || query.trim().isEmpty()) {
      return List.of();
    }

    // Простий пошук за назвою, кодом та містом
    return branchRepository.findAll().stream()
        .filter(branch -> matchesQuery(branch, query))
        .limit(limit)
        .toList();
  }

  /** Знайти найближчі філії (Entity рівень). */
  @Transactional(readOnly = true)
  public List<BranchEntity> findNearby(
      double latitude, double longitude, double radiusKm, int limit) {
    List<BranchEntity> allBranches = branchRepository.findAll();

    return allBranches.stream()
        .filter(branch -> branch.hasCoordinates())
        .filter(
            branch -> {
              double distance =
                  calculateDistance(
                      latitude,
                      longitude,
                      branch.getCoordinates().getLatitude(),
                      branch.getCoordinates().getLongitude());
              return distance <= radiusKm;
            })
        .limit(limit)
        .toList();
  }

  /** Розрахувати відстань між координатами за формулою Гаверсіна. */
  public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }

    double earthRadius = 6371; // км

    double dLat = Math.toRadians(lat2 - lat1);
    double dLon = Math.toRadians(lon2 - lon1);

    double a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2)
                * Math.sin(dLon / 2);

    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  /** Знайти найближчу філію до координат. */
  @Transactional(readOnly = true)
  public BranchEntity findNearestBranch(double latitude, double longitude) {
    log.debug("Finding nearest branch to ({}, {})", latitude, longitude);

    return branchRepository.findAll().stream()
        .filter(branch -> branch.hasCoordinates())
        .min(
            (b1, b2) -> {
              double dist1 =
                  calculateDistance(
                      latitude,
                      longitude,
                      b1.getCoordinates().getLatitude(),
                      b1.getCoordinates().getLongitude());
              double dist2 =
                  calculateDistance(
                      latitude,
                      longitude,
                      b2.getCoordinates().getLatitude(),
                      b2.getCoordinates().getLongitude());
              return Double.compare(dist1, dist2);
            })
        .orElseThrow(() -> new RuntimeException("No branches with coordinates found"));
  }

  // Helper методи

  /** Перевірити чи відповідає філія пошуковому запиту. */
  private boolean matchesQuery(BranchEntity branch, String query) {
    String lowerQuery = query.toLowerCase().trim();

    return (branch.getName() != null && branch.getName().toLowerCase().contains(lowerQuery))
        || (branch.getCode() != null && branch.getCode().toLowerCase().contains(lowerQuery))
        || (branch.getCity() != null && branch.getCity().toLowerCase().contains(lowerQuery))
        || (branch.getStreet() != null && branch.getStreet().toLowerCase().contains(lowerQuery));
  }
}
