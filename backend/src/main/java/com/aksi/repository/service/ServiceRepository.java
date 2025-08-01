package com.aksi.repository.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aksi.domain.service.Service;

/** Repository interface for Service entity. */
@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {

  Optional<Service> findByCode(String code);

  boolean existsByCode(String code);

  Page<Service> findByActiveTrue(Pageable pageable);

  Page<Service> findByCategoryAndActiveTrue(Service.ServiceCategory category, Pageable pageable);
}
