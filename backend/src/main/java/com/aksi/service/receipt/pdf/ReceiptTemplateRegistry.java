package com.aksi.service.receipt.pdf;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.aksi.api.receipt.dto.ReceiptTemplate;

import jakarta.annotation.PostConstruct;

/** Registry for receipt templates Manages available templates and their configurations */
@Component
public class ReceiptTemplateRegistry {

  private final Map<String, ReceiptTemplate> templates = new HashMap<>();

  @PostConstruct
  public void init() {
    registerDefaultTemplate();
    // Additional templates can be registered here
  }

  /** Get all available templates */
  public List<ReceiptTemplate> getAllTemplates() {
    return new ArrayList<>(templates.values());
  }

  /** Get template by ID */
  public Optional<ReceiptTemplate> getTemplate(String templateId) {
    return Optional.ofNullable(templates.get(templateId));
  }

  /** Get default template */
  public ReceiptTemplate getDefaultTemplate() {
    return templates.values().stream()
        .filter(ReceiptTemplate::getIsDefault)
        .findFirst()
        .orElse(templates.get("default"));
  }

  /** Register new template */
  public void registerTemplate(ReceiptTemplate template) {
    if (template == null || template.getId() == null) {
      throw new IllegalArgumentException("Template and template ID cannot be null");
    }
    templates.put(template.getId(), template);
  }

  private void registerDefaultTemplate() {
    ReceiptTemplate defaultTemplate = new ReceiptTemplate();
    defaultTemplate.setId("default");
    defaultTemplate.setName("Стандартний шаблон");
    defaultTemplate.setDescription("Базовий шаблон квитанції");
    defaultTemplate.setIsDefault(true);
    defaultTemplate.setSupportedLocales(List.of("uk", "en"));

    registerTemplate(defaultTemplate);
  }
}
