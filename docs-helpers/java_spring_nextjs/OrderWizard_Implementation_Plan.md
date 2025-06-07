# Order Wizard - План реалізації з нуля (модульний підхід)

## Java Spring Boot + Domain-Driven Design

---

## 🎯 Архітектурна концепція

### Принципи побудови з нуля

- **Domain-First Approach** - спочатку створюємо всі домени/модулі
- **SOLID принципи** - кожен модуль має чітку відповідальність
- **Модульна архітектура** - незалежні домени з чіткими інтерфейсами
- **Spring State Machine** - додається в кінці як оркестратор
- **Test-Driven Development** - тести для кожного модуля
- **Production-Ready** - з самого початку налаштування для продакшна

### Структура доменів (на основі бізнес-процесу)

```
domain/
├── client/          # Управління клієнтами
├── branch/          # Філії та пункти прийому
├── catalog/         # Каталоги (категорії, матеріали, кольори)
├── pricing/         # Прайс-листи та розрахунки
├── modifier/        # Модифікатори цін та коефіцієнти
├── item/            # Предмети замовлення
├── defect/          # Забруднення, дефекти, ризики
├── order/           # Замовлення (базова логіка)
├── payment/         # Оплата та знижки
├── photo/           # Фотодокументація
├── signature/       # Цифрові підписи
├── receipt/         # Квитанції та PDF
├── audit/           # Аудит та логування
└── notification/    # Email та повідомлення
```

---

## 🚀 Фази розробки (від базових доменів до оркестратора)

### Фаза 0: Підготовка проекту (2-3 дні)

#### TODO Фаза 0 - Базова інфраструктура:

**Налаштування проекту:**

- [ ] Очистити існуючу структуру (backup старого коду)
- [ ] Налаштувати clean Spring Boot архітектуру
- [ ] Оновити pom.xml з необхідними залежностями
- [ ] Налаштувати профілі (dev, test, prod)

**База даних та міграції:**

- [ ] Liquibase configuration для всіх доменів
- [ ] Database naming conventions
- [ ] Connection pooling налаштування

**Безпека та адміністрування:**

- [ ] AdminUser setup (admin/admin123)
- [ ] Basic Security Config
- [ ] JWT Configuration

**Загальна інфраструктура:**

- [ ] Global Exception Handler
- [ ] API Response DTOs (ApiResponse, ErrorResponse)
- [ ] Logging Configuration
- [ ] Validation Configuration
- [ ] MapStruct global config

---

### Фаза 1: Client Domain (3-4 дні)

#### TODO Client Domain - Повна реалізація:

**Entities:**

- [ ] ClientEntity.java - основна сутність клієнта
- [ ] ContactMethodEntity.java - способи зв'язку
- [ ] ClientSourceEntity.java - джерела інформації

**Value Objects:**

- [ ] ClientNameVO.java - ПІБ клієнта
- [ ] PhoneNumberVO.java - номер телефону
- [ ] EmailVO.java - email адреса
- [ ] AddressVO.java - адреса клієнта

**Repositories:**

- [ ] ClientRepository.java - основний репозиторій
- [ ] ClientSearchRepository.java - пошук клієнтів
- [ ] ContactMethodRepository.java

**Services:**

- [ ] ClientDomainService.java - основна бізнес-логіка
- [ ] ClientSearchService.java - пошук по різних критеріях
- [ ] ClientValidationService.java - валідація даних
- [ ] ClientDuplicateDetectionService.java - пошук дублікатів

**DTOs:**

- [ ] CreateClientDTO.java - створення клієнта
- [ ] UpdateClientDTO.java - оновлення клієнта
- [ ] ClientSearchDTO.java - критерії пошуку
- [ ] ClientResponseDTO.java - повна інформація
- [ ] ClientSummaryDTO.java - скорочена інформація

**Enums:**

- [ ] ContactMethodEnum.java - способи зв'язку
- [ ] ClientSourceEnum.java - джерела інформації

**Controllers:**

- [ ] ClientController.java - CRUD операції
- [ ] ClientSearchController.java - пошук та фільтрація

**Database:**

- [ ] clients.xml - таблиця клієнтів
- [ ] client_contact_methods.xml - способи зв'язку
- [ ] client_sources.xml - джерела

**Тестування:**

- [ ] ClientDomainServiceTest.java
- [ ] ClientSearchServiceTest.java
- [ ] ClientControllerTest.java
- [ ] ClientRepositoryTest.java

---

### Фаза 2: Branch Domain (1-2 дні)

#### TODO Branch Domain - Філії та пункти прийому:

**Entities:**

- [ ] BranchEntity.java - філії/пункти прийому

**Services:**

- [ ] BranchDomainService.java - управління філіями
- [ ] BranchValidationService.java

**DTOs:**

- [ ] BranchDTO.java - інформація про філію
- [ ] BranchSummaryDTO.java

**Controllers:**

- [ ] BranchController.java

**Database:**

- [ ] branches.xml - таблиця філій

**Тестування:**

- [ ] BranchDomainServiceTest.java
- [ ] BranchControllerTest.java

---

### Фаза 3: Catalog Domain (2-3 дні)

#### TODO Catalog Domain - Каталоги та довідники:

**Entities:**

- [ ] ServiceCategoryEntity.java - категорії послуг
- [ ] MaterialEntity.java - матеріали
- [ ] ColorEntity.java - кольори
- [ ] FillerEntity.java - наповнювачі
- [ ] StainTypeEntity.java - типи плям
- [ ] DefectTypeEntity.java - типи дефектів
- [ ] RiskTypeEntity.java - типи ризиків

**Services:**

- [ ] CatalogDomainService.java - управління каталогами
- [ ] ServiceCategoryService.java
- [ ] MaterialService.java
- [ ] ColorService.java
- [ ] DefectCatalogService.java

**DTOs:**

- [ ] ServiceCategoryDTO.java
- [ ] MaterialDTO.java
- [ ] ColorDTO.java
- [ ] StainTypeDTO.java
- [ ] DefectTypeDTO.java

**Enums:**

- [ ] WearDegreeEnum.java - ступінь зносу
- [ ] UnitOfMeasureEnum.java - одиниці виміру

**Controllers:**

- [ ] CatalogController.java - загальний каталог
- [ ] ServiceCategoryController.java

**Database:**

- [ ] service_categories.xml
- [ ] materials.xml
- [ ] colors.xml
- [ ] stain_types.xml
- [ ] defect_types.xml

**Тестування:**

- [ ] CatalogDomainServiceTest.java
- [ ] ServiceCategoryServiceTest.java

---

### Фаза 4: Pricing Domain (5-7 днів)

#### TODO Pricing Domain - Централізований калькулятор цін:

**Entities:**

- [ ] PriceListEntity.java - позиції прайс-листа
- [ ] PriceListItemEntity.java - деталі позиції
- [ ] ColorPricingEntity.java - особливі ціни для кольорів
- [ ] PriceModifierEntity.java - модифікатори цін
- [ ] ModifierCategoryEntity.java - категорії модифікаторів
- [ ] ModifierRuleEntity.java - правила застосування
- [ ] PriceCalculationHistoryEntity.java - історія розрахунків
- [ ] DiscountRuleEntity.java - правила знижок

**Services:**

**Основні сервіси:**

- [ ] PricingDomainService.java - головний сервіс домену
- [ ] PriceCalculatorService.java - **ЦЕНТРАЛЬНИЙ КАЛЬКУЛЯТОР**
- [ ] PriceListService.java - управління прайс-листом

**Калькулятори (за етапами розрахунку):**

- [ ] BasePriceCalculationService.java - крок 1: базова ціна
- [ ] ModifierApplicationService.java - крок 2: модифікатори
- [ ] ColorPricingService.java - крок 3: особливості кольорів
- [ ] DiscountCalculationService.java - крок 4: знижки
- [ ] UrgencyCalculationService.java - крок 5: терміновість
- [ ] FinalPriceCalculationService.java - крок 6: фінальна сума

**Допоміжні сервіси:**

- [ ] PriceValidationService.java - валідація розрахунків
- [ ] PriceBreakdownService.java - деталізація розрахунків
- [ ] ModifierCatalogService.java - каталог модифікаторів
- [ ] PriceRulesEngineService.java - двигун бізнес-правил

**DTOs:**

**Запити та відповіді:**

- [ ] PriceCalculationRequestDTO.java - запит на розрахунок
- [ ] PriceCalculationResponseDTO.java - результат з деталізацією
- [ ] PriceBreakdownDTO.java - покрокова деталізація
- [ ] ItemPriceCalculationDTO.java - розрахунок одного предмета

**Модифікатори та знижки:**

- [ ] PriceModifierDTO.java
- [ ] ModifierApplicationDTO.java
- [ ] DiscountApplicationDTO.java
- [ ] UrgencyApplicationDTO.java

**Прайс-лист:**

- [ ] PriceListItemDTO.java
- [ ] PriceListFilterDTO.java

**Controllers:**

- [ ] PricingController.java - загальний API
- [ ] PriceCalculatorController.java - **API калькулятора**
- [ ] PriceListController.java - управління прайсом
- [ ] ModifierController.java - управління модифікаторами

**Database:**

- [ ] price_list.xml
- [ ] price_list_items.xml
- [ ] color_pricing.xml
- [ ] price_modifiers.xml
- [ ] modifier_categories.xml
- [ ] modifier_rules.xml
- [ ] discount_rules.xml
- [ ] price_calculation_history.xml

**Тестування:**

**Ключові тести калькулятора:**

- [ ] PriceCalculatorServiceTest.java - **головні тести**
- [ ] PriceCalculationIntegrationTest.java - інтеграційні тести
- [ ] ComplexPriceCalculationTest.java - складні сценарії

**Покомпонентні тести:**

- [ ] BasePriceCalculationServiceTest.java
- [ ] ModifierApplicationServiceTest.java
- [ ] DiscountCalculationServiceTest.java
- [ ] PriceValidationServiceTest.java

---

### Фаза 5: Item Domain (3-4 дні)

#### TODO Item Domain - Предмети замовлення:

**Entities:**

- [ ] OrderItemEntity.java - предмет замовлення
- [ ] ItemCharacteristicsEntity.java - характеристики
- [ ] ItemDefectsEntity.java - дефекти та забруднення

**Value Objects:**

- [ ] ItemQuantityVO.java - кількість та одиниця виміру
- [ ] ItemDimensionsVO.java - розміри (якщо потрібно)

**Services:**

- [ ] ItemDomainService.java - управління предметами
- [ ] ItemValidationService.java - валідація предметів
- [ ] ItemCharacteristicsService.java - логіка характеристик
- [ ] ItemDefectService.java - обробка дефектів

**DTOs:**

- [ ] CreateItemDTO.java
- [ ] UpdateItemDTO.java
- [ ] ItemDTO.java
- [ ] ItemCharacteristicsDTO.java
- [ ] ItemDefectsDTO.java

**Controllers:**

- [ ] ItemController.java
- [ ] ItemCharacteristicsController.java

**Database:**

- [ ] order_items.xml
- [ ] item_characteristics.xml
- [ ] item_defects.xml

**Тестування:**

- [ ] ItemDomainServiceTest.java
- [ ] ItemValidationServiceTest.java

---

### Фаза 6: Order Domain (3-4 дні)

#### TODO Order Domain - Замовлення (базова логіка):

**Entities:**

- [ ] OrderEntity.java - основне замовлення
- [ ] OrderParametersEntity.java - параметри виконання
- [ ] OrderStatusHistoryEntity.java - історія статусів

**Value Objects:**

- [ ] OrderNumberVO.java - номер замовлення
- [ ] ReceiptNumberVO.java - номер квитанції
- [ ] UniqueTagVO.java - унікальна мітка

**Services:**

- [ ] OrderDomainService.java - основна логіка замовлень
- [ ] OrderCreationService.java - створення замовлень
- [ ] OrderValidationService.java - валідація замовлень
- [ ] DeliveryDateService.java - розрахунок дат виконання
- [ ] OrderStatusService.java - управління статусами

**DTOs:**

- [ ] CreateOrderDTO.java
- [ ] UpdateOrderDTO.java
- [ ] OrderDTO.java
- [ ] OrderSummaryDTO.java
- [ ] OrderParametersDTO.java

**Enums:**

- [ ] OrderStatusEnum.java
- [ ] UrgencyTypeEnum.java

**Controllers:**

- [ ] OrderController.java
- [ ] OrderStatusController.java

**Database:**

- [ ] orders.xml
- [ ] order_parameters.xml
- [ ] order_status_history.xml

**Тестування:**

- [ ] OrderDomainServiceTest.java
- [ ] OrderCreationServiceTest.java

---

### Фаза 7: Payment Domain (2-3 дні)

#### TODO Payment Domain - Оплата (без калькуляцій):

**⚠️ Примітка:** Усі розрахунки знижок та цін тепер в Pricing Domain (Фаза 4)

**Entities:**

- [ ] PaymentEntity.java - платежі
- [ ] PaymentTransactionEntity.java - транзакції оплати

**Services:**

- [ ] PaymentDomainService.java - логіка оплати
- [ ] PaymentProcessingService.java - обробка платежів
- [ ] PaymentValidationService.java - валідація оплати
- [ ] PaymentHistoryService.java - історія платежів

**DTOs:**

- [ ] PaymentDTO.java
- [ ] PaymentTransactionDTO.java
- [ ] PaymentRequestDTO.java
- [ ] PaymentResponseDTO.java

**Enums:**

- [ ] PaymentMethodEnum.java
- [ ] PaymentStatusEnum.java

**Controllers:**

- [ ] PaymentController.java
- [ ] PaymentTransactionController.java

**Database:**

- [ ] payments.xml
- [ ] payment_transactions.xml

**Тестування:**

- [ ] PaymentDomainServiceTest.java
- [ ] PaymentProcessingServiceTest.java

---

### Фаза 9: Photo Domain (2-3 дні)

#### TODO Photo Domain - Фотодокументація:

**Entities:**

- [ ] PhotoEntity.java - метадані фото
- [ ] PhotoStorageEntity.java - інформація про збереження

**Services:**

- [ ] PhotoDomainService.java - управління фото
- [ ] PhotoStorageService.java - збереження файлів
- [ ] PhotoValidationService.java - валідація фото
- [ ] ImageProcessingService.java - обробка зображень

**DTOs:**

- [ ] PhotoUploadDTO.java
- [ ] PhotoDTO.java
- [ ] PhotoMetadataDTO.java

**Controllers:**

- [ ] PhotoController.java
- [ ] PhotoUploadController.java

**Database:**

- [ ] photos.xml
- [ ] photo_storage.xml

**Тестування:**

- [ ] PhotoDomainServiceTest.java
- [ ] PhotoStorageServiceTest.java

---

### Фаза 10: Signature Domain (1-2 дні)

#### TODO Signature Domain - Цифрові підписи:

**Entities:**

- [ ] DigitalSignatureEntity.java

**Services:**

- [ ] SignatureDomainService.java
- [ ] SignatureValidationService.java
- [ ] SignatureStorageService.java

**DTOs:**

- [ ] DigitalSignatureDTO.java
- [ ] SignatureDataDTO.java

**Controllers:**

- [ ] SignatureController.java

**Database:**

- [ ] digital_signatures.xml

**Тестування:**

- [ ] SignatureDomainServiceTest.java

---

### Фаза 11: Receipt Domain (3-4 дні)

#### TODO Receipt Domain - Квитанції та PDF:

**Entities:**

- [ ] ReceiptEntity.java - метадані квитанцій
- [ ] ReceiptTemplateEntity.java - шаблони

**Services:**

- [ ] ReceiptDomainService.java - логіка квитанцій
- [ ] ReceiptGenerationService.java - генерація квитанцій
- [ ] ReceiptPdfService.java - PDF генератор
- [ ] ReceiptTemplateService.java - управління шаблонами
- [ ] QRCodeGenerationService.java - QR коди

**DTOs:**

- [ ] ReceiptDTO.java
- [ ] ReceiptDataDTO.java
- [ ] ReceiptGenerationRequestDTO.java

**Controllers:**

- [ ] ReceiptController.java
- [ ] ReceiptPdfController.java

**Database:**

- [ ] receipts.xml
- [ ] receipt_templates.xml

**Тестування:**

- [ ] ReceiptDomainServiceTest.java
- [ ] ReceiptPdfServiceTest.java

---

### Фаза 12: Notification Domain (1-2 дні)

#### TODO Notification Domain - Email та повідомлення:

**Services:**

- [ ] NotificationDomainService.java
- [ ] EmailService.java
- [ ] SmsService.java (для майбутнього)

**DTOs:**

- [ ] EmailNotificationDTO.java
- [ ] NotificationRequestDTO.java

**Controllers:**

- [ ] NotificationController.java

**Тестування:**

- [ ] EmailServiceTest.java

---

### Фаза 13: Audit Domain (1-2 дні)

#### TODO Audit Domain - Аудит та логування:

**Entities:**

- [ ] AuditLogEntity.java

**Services:**

- [ ] AuditDomainService.java
- [ ] AuditLogService.java

**DTOs:**

- [ ] AuditLogDTO.java

**Controllers:**

- [ ] AuditController.java

**Database:**

- [ ] audit_logs.xml

---

### Фаза 14: Integration Layer (3-4 дні)

#### TODO Integration - Зв'язок між доменами:

**Cross-Domain Services:**

- [ ] OrderCreationIntegrationService.java - створення замовлення
- [ ] PriceCalculationIntegrationService.java - повний розрахунок
- [ ] OrderCompletionIntegrationService.java - завершення замовлення

**Facade Services:**

- [ ] OrderWizardFacadeService.java - фасад для UI
- [ ] PricingFacadeService.java - фасад розрахунків
- [ ] ClientManagementFacadeService.java - фасад клієнтів

**Event Handlers:**

- [ ] OrderEventHandler.java - обробка подій замовлення
- [ ] PaymentEventHandler.java - обробка подій платежів

**DTOs:**

- [ ] CompleteOrderRequestDTO.java
- [ ] OrderWizardStateDTO.java

**Controllers:**

- [ ] OrderWizardIntegrationController.java

**Тестування:**

- [ ] CrossDomainIntegrationTest.java
- [ ] OrderWizardFacadeTest.java

---

### Фаза 15: Spring State Machine (4-5 днів)

#### TODO State Machine - Оркестратор процесу:

**State Machine Configuration:**

- [ ] OrderWizardStateMachineConfig.java
- [ ] OrderWizardState.java (enum)
- [ ] OrderWizardEvent.java (enum)

**Context Management:**

- [ ] OrderWizardContext.java
- [ ] WizardContextManager.java

**Actions (використовують готові домени):**

- [ ] InitializeWizardAction.java
- [ ] SelectClientAction.java
- [ ] AddItemAction.java
- [ ] CalculatePriceAction.java
- [ ] ApplyDiscountAction.java
- [ ] GenerateReceiptAction.java

**Guards (використовують готові валідатори):**

- [ ] ClientSelectedGuard.java
- [ ] MinimumItemsGuard.java
- [ ] PaymentValidGuard.java

**Orchestration Services:**

- [ ] OrderWizardOrchestrationService.java
- [ ] WizardStateService.java

**Controllers:**

- [ ] OrderWizardStateMachineController.java

**Database:**

- [ ] wizard_sessions.xml
- [ ] wizard_state_history.xml

**Тестування:**

- [ ] OrderWizardStateMachineTest.java
- [ ] WizardOrchestrationTest.java

---

### Фаза 16: Final Integration & Testing (3-4 дні)

#### TODO Final Integration:

**End-to-End Testing:**

- [ ] CompleteOrderWizardE2ETest.java
- [ ] MultipleItemsWorkflowTest.java
- [ ] PaymentFlowE2ETest.java

**Performance Testing:**

- [ ] OrderCreationPerformanceTest.java
- [ ] PriceCalculationPerformanceTest.java

**Production Configuration:**

- [ ] Production profiles налаштування
- [ ] Monitoring та health checks
- [ ] Error handling та recovery

---

## 📅 Загальний Timeline

| Фаза                       | Тривалість | Залежності | Результат                  |
| -------------------------- | ---------- | ---------- | -------------------------- |
| Фаза 0: Підготовка         | 2-3 дні    | -          | Чиста архітектура + база   |
| Фаза 1: Client Domain      | 3-4 дні    | Фаза 0     | Повний модуль клієнтів     |
| Фаза 2: Branch Domain      | 1-2 дні    | Фаза 0     | Модуль філій               |
| Фаза 3: Catalog Domain     | 2-3 дні    | Фаза 0     | Каталоги та довідники      |
| Фаза 4: Pricing Domain     | 5-7 днів   | Фаза 3     | **Повний калькулятор цін** |
| Фаза 5: Item Domain        | 3-4 дні    | Фази 3,4   | Предмети замовлення        |
| Фаза 6: Order Domain       | 3-4 дні    | Фази 1,2   | Базова логіка замовлень    |
| Фаза 7: Payment Domain     | 2-3 дні    | Фази 4,6   | Оплата (без калькуляцій)   |
| Фаза 8: Photo Domain       | 2-3 дні    | Фаза 5     | Фотодокументація           |
| Фаза 9: Signature Domain   | 1-2 дні    | Фаза 6     | Цифрові підписи            |
| Фаза 10: Receipt Domain    | 3-4 дні    | Фази 6,7   | Квитанції та PDF           |
| Фаза 11: Notification      | 1-2 дні    | Фаза 10    | Email повідомлення         |
| Фаза 12: Audit Domain      | 1-2 дні    | Всі фази   | Аудит та логування         |
| Фаза 13: Integration Layer | 3-4 дні    | Всі домени | Зв'язок між доменами       |
| Фаза 14: State Machine     | 4-5 днів   | Фаза 13    | Оркестратор процесу        |
| Фаза 15: Final Integration | 3-4 дні    | Фаза 14    | Production ready           |

**Загальний час: 36-50 днів**

### 🎯 Ключові переваги централізованого Pricing Domain:

#### **Консистентність розрахунків:**

- Вся логіка ціноутворення в одному місці
- Гарантовано однакові розрахунки в усіх частинах системи
- Простіше підтримувати та оновлювати формули

#### **Прозорість для бізнесу:**

- Покрокова деталізація розрахунків відповідно до бізнес-процесу
- Легко зрозуміти як формується фінальна ціна
- Простіше налагоджувати складні випадки

#### **Легкість тестування:**

- Всі сценарії розрахунків в одному домені
- Можна протестувати всі комбінації модифікаторів та знижок
- Інтеграційні тести покривають повний цикл ціноутворення

#### **Гнучкість архітектури:**

- State Machine працює з готовим калькулятором
- Інші домени просто використовують результати розрахунків
- Легко розширювати новими типами модифікаторів

---

## 🎯 Критерії готовності

### Definition of Done для кожного домену:

- [ ] Entities, Repositories, Services створені
- [ ] DTOs та Mappers реалізовані
- [ ] Controllers з повним REST API
- [ ] Database migrations виконані
- [ ] Unit тести покривають 80%+ логіки
- [ ] Integration тести для API
- [ ] Swagger документація актуальна
- [ ] Валідація даних налаштована

### Definition of Done для інтеграції:

- [ ] Всі домени працюють незалежно
- [ ] Cross-domain сервіси реалізовані
- [ ] Event-driven комунікація налаштована
- [ ] End-to-end тести проходять
- [ ] Performance відповідає вимогам

### Production Ready критерії:

- [ ] Всі домени стабільно функціонують
- [ ] State Machine оркеструє повний процес
- [ ] Повна функціональність Order Wizard
- [ ] Monitoring та alerting налаштовані
- [ ] Security hardening завершений
- [ ] Backup та recovery процедури готові

---

## 💡 Переваги модульного підходу

### Архітектурні переваги:

- **Незалежний розвиток:** Кожен домен розвивається окремо
- **Легке тестування:** Модулі тестуються ізольовано
- [ ] Масштабованість:\*\* Можливість горизонтального масштабування
- [ ] Підтримуваність:\*\* Зміни в одному домені не впливають на інші

### Бізнес переваги:

- **Поетапна розробка:** Можна демонструвати прогрес по доменах
- **Ризик-менеджмент:** Помилки локалізовані в окремих модулях
- [ ] Гнучкість:\*\* Легко додавати нову функціональність
- [ ] Якість:\*\* Кожен модуль проходить повне тестування

**Цей підхід забезпечує створення якісної, підтримуваної та масштабованої системи Order Wizard з чіткою модульною архітектурою.**
