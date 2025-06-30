package com.aksi.domain.branch.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aksi.api.branch.dto.HolidayRequest;
import com.aksi.api.branch.dto.HolidayResponse;
import com.aksi.domain.branch.entity.HolidayEntity;
import com.aksi.domain.branch.mapper.HolidayMapper;
import com.aksi.domain.branch.repository.HolidayRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** Сервіс для управління святковими днями Відповідальність: HolidayEntity. */
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class HolidayService {

  private final HolidayRepository holidayRepository;
  private final HolidayMapper holidayMapper;

  // API методи (для контролерів) - працюють з DTO

  /** Створити новий святковий день. */
  public HolidayResponse createHoliday(HolidayRequest request) {
    log.debug("Creating holiday: {}", request.getName());

    HolidayEntity entity = holidayMapper.toEntity(request);
    HolidayEntity savedEntity = create(entity);
    return holidayMapper.toResponse(savedEntity);
  }

  /** Отримати святковий день за UUID. */
  @Transactional(readOnly = true)
  public HolidayResponse getHolidayById(UUID uuid) {
    log.debug("Getting holiday by UUID: {}", uuid);

    HolidayEntity entity = findEntityById(uuid);
    return holidayMapper.toResponse(entity);
  }

  /** Оновити святковий день. */
  public HolidayResponse updateHoliday(UUID uuid, HolidayRequest request) {
    log.debug("Updating holiday: {}", uuid);

    HolidayEntity existingEntity = findEntityById(uuid);

    HolidayEntity updatedEntity = holidayMapper.toEntity(request);
    updatedEntity.setId(existingEntity.getId());

    HolidayEntity savedEntity = update(updatedEntity);
    return holidayMapper.toResponse(savedEntity);
  }

  /** Видалити святковий день. */
  public void deleteHoliday(UUID uuid) {
    log.debug("Deleting holiday: {}", uuid);

    HolidayEntity entity = findEntityById(uuid); // перевіримо що існує
    holidayRepository.deleteById(entity.getId());
  }

  /** Отримати всі святкові дні. */
  @Transactional(readOnly = true)
  public List<HolidayResponse> getAllHolidays() {
    log.debug("Getting all holidays");

    List<HolidayEntity> entities = holidayRepository.findAll();
    return holidayMapper.toResponseList(entities);
  }

  /** Отримати святкові дні за конкретною датою. */
  @Transactional(readOnly = true)
  public List<HolidayResponse> getHolidaysByDate(LocalDate date) {
    log.debug("Getting holidays for date: {}", date);

    List<HolidayEntity> entities = holidayRepository.findByDate(date);
    return holidayMapper.toResponseList(entities);
  }

  /** Отримати щорічні святкові дні. */
  @Transactional(readOnly = true)
  public List<HolidayResponse> getRecurringHolidays() {
    log.debug("Getting recurring holidays");

    List<HolidayEntity> entities = holidayRepository.findByIsRecurring(true);
    return holidayMapper.toResponseList(entities);
  }

  /** Перевірити чи є конкретна дата святковим днем. */
  @Transactional(readOnly = true)
  public boolean isHoliday(LocalDate date) {
    log.debug("Checking if {} is a holiday", date);

    return !holidayRepository.findByDate(date).isEmpty();
  }

  /** Знайти наступний робочий день після святкового. */
  @Transactional(readOnly = true)
  public LocalDate getNextWorkingDate(LocalDate currentDate) {
    log.debug("Finding next working date after: {}", currentDate);

    LocalDate nextDate = currentDate.plusDays(1);

    // Перевіряємо до 30 днів вперед
    for (int i = 0; i < 30; i++) {
      if (!isHoliday(nextDate) && !isWeekend(nextDate)) {
        return nextDate;
      }
      nextDate = nextDate.plusDays(1);
    }

    return nextDate; // fallback
  }

  // Entity методи (для внутрішньої логіки)

  /** Створити entity. */
  public HolidayEntity create(HolidayEntity entity) {
    return holidayRepository.save(entity);
  }

  /** Знайти entity за UUID. */
  @Transactional(readOnly = true)
  private HolidayEntity findEntityById(UUID uuid) {
    return holidayRepository
        .findByUuid(uuid)
        .orElseThrow(() -> new RuntimeException("Holiday not found: " + uuid));
  }

  /** Знайти entity за датою. */
  @Transactional(readOnly = true)
  public List<HolidayEntity> findByDate(LocalDate date) {
    return holidayRepository.findByDate(date);
  }

  /** Оновити entity. */
  public HolidayEntity update(HolidayEntity entity) {
    return holidayRepository.save(entity);
  }

  /** Отримати всі entities. */
  @Transactional(readOnly = true)
  public List<HolidayEntity> findAll() {
    return holidayRepository.findAll();
  }

  // Helper методи

  /** Перевірити чи є дата вихідним днем (субота/неділя). */
  private boolean isWeekend(LocalDate date) {
    return date.getDayOfWeek().getValue() >= 6; // 6=Saturday, 7=Sunday
  }
}
