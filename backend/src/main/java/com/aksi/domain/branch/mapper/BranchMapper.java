package com.aksi.domain.branch.mapper;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.aksi.api.branch.dto.BranchComparisonResponse;
import com.aksi.api.branch.dto.BranchResponse;
import com.aksi.api.branch.dto.BranchStatisticsResponse;
import com.aksi.api.branch.dto.BranchSummaryResponse;
import com.aksi.api.branch.dto.BranchWithDistanceResponse;
import com.aksi.api.branch.dto.CreateBranchRequest;
import com.aksi.api.branch.dto.StatisticsPeriod;
import com.aksi.api.branch.dto.UpdateBranchRequest;
import com.aksi.domain.branch.entity.BranchEntity;

/**
 * Mapper для BranchEntity ↔ DTO конвертації Відповідальність: тільки основна Branch entity без
 * embedded objects.
 */
@Mapper(
    componentModel = "spring",
    uses = {ContactInfoMapper.class, CoordinatesMapper.class, AddressMapper.class})
public interface BranchMapper {

  // DTO → Entity mappings (для create/update)

  /** CreateBranchRequest → BranchEntity. */
  @Mapping(target = "uuid", expression = "java(java.util.UUID.randomUUID())")
  @Mapping(target = "receiptCounter", constant = "0L")
  @Mapping(target = "code", source = "name")
  @Mapping(target = "street", source = "address.street")
  @Mapping(target = "buildingNumber", source = "address.street")
  @Mapping(target = "city", source = "address.city")
  @Mapping(target = "region", source = "address.region")
  @Mapping(target = "postalCode", source = "address.postalCode")
  @Mapping(target = "country", source = "address.country")
  @Mapping(target = "apartmentOffice", ignore = true)
  @Mapping(target = "district", ignore = true)
  @Mapping(target = "status", ignore = true) // встановлюється окремо в Service
  BranchEntity toEntity(CreateBranchRequest request);

  /** UpdateBranchRequest → BranchEntity (для оновлення). */
  @Mapping(target = "uuid", ignore = true)
  @Mapping(target = "receiptCounter", ignore = true)
  @Mapping(target = "code", source = "name")
  @Mapping(target = "street", source = "address.street")
  @Mapping(target = "buildingNumber", source = "address.street")
  @Mapping(target = "city", source = "address.city")
  @Mapping(target = "region", source = "address.region")
  @Mapping(target = "postalCode", source = "address.postalCode")
  @Mapping(target = "country", source = "address.country")
  @Mapping(target = "apartmentOffice", ignore = true)
  @Mapping(target = "district", ignore = true)
  @Mapping(target = "status", ignore = true) // встановлюється окремо в Service
  BranchEntity toEntityForUpdate(UpdateBranchRequest request);

  // Entity → DTO mappings (для response)

  /** {@code BranchEntity} → {@code BranchResponse}. */
  @Mapping(target = "id", source = "uuid")
  @Mapping(
      target = "createdAt",
      source = "createdAt",
      qualifiedByName = "localDateTimeToOffsetDateTime")
  @Mapping(
      target = "updatedAt",
      source = "updatedAt",
      qualifiedByName = "localDateTimeToOffsetDateTime")
  @Mapping(target = "status", source = "status", qualifiedByName = "domainBranchStatusToApi")
  @Mapping(target = "address", source = ".")
  @Mapping(target = "workingSchedule", ignore = true) // окремий mapper для WorkingSchedule
  BranchResponse toBranchResponse(BranchEntity entity);

  /** {@code BranchEntity} → {@code BranchSummaryResponse}. */
  @Mapping(target = "id", source = "uuid")
  BranchSummaryResponse toBranchSummaryResponse(BranchEntity entity);

  /** BranchEntity → BranchWithDistanceResponse. */
  @Mapping(target = "id", source = "entity.uuid")
  @Mapping(target = "status", source = "entity.status", qualifiedByName = "domainBranchStatusToApi")
  @Mapping(target = "address", source = "entity")
  @Mapping(target = "distance", source = "distance")
  @Mapping(target = "workingSchedule", ignore = true) // окремий mapper для WorkingSchedule
  BranchWithDistanceResponse toBranchWithDistanceResponse(BranchEntity entity, Double distance);

  /** List<BranchEntity> → List<BranchResponse>. */
  List<BranchResponse> toBranchResponseList(List<BranchEntity> entities);

  /** List<BranchEntity> → List<BranchSummaryResponse>. */
  List<BranchSummaryResponse> toBranchSummaryResponseList(List<BranchEntity> entities);

  // Utility mappings

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) - auto mapping. */
  default OffsetDateTime map(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) - auto mapping. */
  default LocalDateTime map(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  /** LocalDateTime (Entity) → OffsetDateTime (DTO) - named mapping. */
  @Named("localDateTimeToOffsetDateTime")
  default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime) {
    return localDateTime != null ? localDateTime.atOffset(ZoneOffset.UTC) : null;
  }

  /** OffsetDateTime (DTO) → LocalDateTime (Entity) - named mapping. */
  @Named("offsetDateTimeToLocalDateTime")
  default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime) {
    return offsetDateTime != null ? offsetDateTime.toLocalDateTime() : null;
  }

  /** String → URI. */
  default URI stringToUri(String url) {
    return url != null ? URI.create(url) : null;
  }

  /** URI → String. */
  default String uriToString(URI uri) {
    return uri != null ? uri.toString() : null;
  }

  // Enum mappings

  /** Domain BranchStatus → API BranchStatus. */
  @Named("domainBranchStatusToApi")
  default com.aksi.api.branch.dto.BranchStatus domainBranchStatusToApi(
      com.aksi.domain.branch.enums.BranchStatus domainStatus) {
    return domainStatus != null
        ? com.aksi.api.branch.dto.BranchStatus.fromValue(domainStatus.name())
        : null;
  }

  /** API BranchStatus → Domain BranchStatus. */
  default com.aksi.domain.branch.enums.BranchStatus apiToDomainBranchStatus(
      com.aksi.api.branch.dto.BranchStatus apiStatus) {
    return apiStatus != null
        ? com.aksi.domain.branch.enums.BranchStatus.valueOf(apiStatus.getValue())
        : null;
  }

  /** Domain BranchOpenStatus → API BranchOpenStatus. */
  @Named("domainOpenStatusToApi")
  default com.aksi.api.branch.dto.BranchOpenStatus domainOpenStatusToApi(
      com.aksi.domain.branch.enums.BranchOpenStatus domainStatus) {
    return domainStatus != null
        ? com.aksi.api.branch.dto.BranchOpenStatus.fromValue(domainStatus.name())
        : null;
  }

  /** API BranchOpenStatus → Domain BranchOpenStatus. */
  default com.aksi.domain.branch.enums.BranchOpenStatus apiToDomainOpenStatus(
      com.aksi.api.branch.dto.BranchOpenStatus apiStatus) {
    return apiStatus != null
        ? com.aksi.domain.branch.enums.BranchOpenStatus.valueOf(apiStatus.getValue())
        : null;
  }

  /** Створити BranchStatisticsResponse на основі філії та періоду. */
  default BranchStatisticsResponse toBranchStatisticsResponse(
      BranchEntity entity, LocalDate startDate, LocalDate endDate) {
    BranchStatisticsResponse response = new BranchStatisticsResponse();
    response.setBranchId(entity.getUuid());
    response.setBranchName(entity.getName());

    StatisticsPeriod period = new StatisticsPeriod();
    period.setStartDate(startDate);
    period.setEndDate(endDate);
    response.setPeriod(period);

    // TODO: Додати реальні статистичні дані з замовлень
    response.setTotalRevenue(0.0);
    response.setOrdersCount(0L);
    response.setAverageOrderValue(0.0);
    response.setDailyStats(new ArrayList<>());
    response.setPopularServices(new ArrayList<>());

    return response;
  }

  /** Створити список BranchComparisonResponse на основі філій та періоду. */
  default List<BranchComparisonResponse> toBranchComparisonResponseList(
      List<BranchEntity> branches,
      LocalDate startDate,
      LocalDate endDate,
      String sortBy,
      String order) {
    List<BranchComparisonResponse> responses = new ArrayList<>();

    for (int i = 0; i < branches.size(); i++) {
      BranchEntity entity = branches.get(i);
      BranchComparisonResponse response = new BranchComparisonResponse();

      response.setBranchId(entity.getUuid());
      response.setBranchName(entity.getName());
      response.setBranchCode(entity.getCode());
      response.setRanking(i + 1);

      // TODO: Додати реальні статистичні дані з замовлень
      response.setTotalRevenue(0.0);
      response.setOrdersCount(0L);
      response.setAverageOrderValue(0.0);

      responses.add(response);
    }

    return responses;
  }
}
