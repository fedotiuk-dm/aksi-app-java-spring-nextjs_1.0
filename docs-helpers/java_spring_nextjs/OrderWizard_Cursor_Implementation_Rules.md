# Правила реалізації Order Wizard в Cursor IDE: Spring State Machine

## 🎯 Основна концепція

**Order Wizard - це композиція готових доменних функцій в покроковому інтерфейсі через Spring State Machine**

Усі базові функції вже реалізовані в доменних шарах:

- **Client Domain** - управління клієнтами
- **Branch Domain** - філії та місця роботи
- **Order Domain** - замовлення та предмети
- **Pricing Domain** - розрахунки цін, модифікатори, калькулятори
- **Допоміжні сервіси** - PDF генерація, email, файли

**Наше завдання** - організувати ці функції в логічний покроковий процес через State Machine.

---

## 🏗️ Архітектурні принципи для Cursor IDE

### 1. **Принцип "Тонкого шару організації"**

```java
// ❌ НЕ створюємо нову бізнес-логіку
@Service
public class Stage1Service {
    public Client createNewClient(ClientDTO dto) {
        // Не пишемо логіку створення клієнта заново
        return clientRepository.save(new Client(dto)); // ПОГАНО
    }
}

// ✅ Використовуємо готові доменні сервіси
@Service
public class Stage1CoordinationService {
    private final ClientDomainService clientDomainService; // Готовий сервіс

    public Client createNewClient(ClientDTO dto) {
        return clientDomainService.createClient(dto); // Використовуємо готове
    }
}
```

### 2. **Принцип "State Machine як координатор"**

State Machine управляє ТІЛЬКИ:

- Переходами між етапами
- Валідацією готовності до переходу
- Збереженням контексту візарда
- Координацією викликів доменних сервісів

### 3. **Принцип "Готових доменних компонентів"**

```java
// ✅ Використовуємо те, що вже є:
- ClientDomainService.searchClients()
- BranchDomainService.getAllBranches()
- PriceCalculationService.calculatePrice()
- OrderDomainService.createOrder()
- PdfGenerationService.generateReceipt()
```

---

## 📂 Структура файлів та правила найменування

### **Базова структура State Machine**

```
backend/src/main/java/com/aksi/domain/order/statemachine/
├── config/
│   └── OrderStateMachineConfig.java     # Конфігурація переходів
├── context/
│   └── OrderWizardContext.java          # Контекст візарда
├── adapter/
│   └── OrderWizardStateMachineAdapter.java # Головний адаптер
├── enums/
│   ├── OrderState.java                  # Стани
│   └── OrderEvent.java                  # Події
└── stage[N]/                           # Етапи
    ├── adapter/
    ├── actions/
    ├── guards/
    ├── service/
    └── substep[N]/                     # Підетапи
```

### **Правила найменування компонентів**

#### **1. State Machine Actions**

```java
// Формат: [Stage][Action]Action.java
InitializeStage1Action.java
CompleteClientSelectionAction.java
StartItemWizardAction.java
SaveBasicInfoAction.java
CalculatePriceAction.java
FinalizeOrderAction.java
```

#### **2. State Machine Guards**

```java
// Формат: [Condition]Guard.java
ClientSelectedGuard.java
BasicInfoValidGuard.java
MinimumItemsGuard.java
OrderCompleteGuard.java
```

#### **3. Координаційні сервіси**

```java
// Формат: [Stage]CoordinationService.java
Stage1CoordinationService.java
Stage2CoordinationService.java
ItemWizardCoordinationService.java
OrderWizardCoordinationService.java
```

#### **4. Адаптери**

```java
// Формат: [Stage]StateMachineAdapter.java
Stage1StateMachineAdapter.java
Stage2StateMachineAdapter.java
ItemWizardStateMachineAdapter.java
OrderWizardStateMachineAdapter.java
```

---

## 🔧 Правила використання готових доменних сервісів

### **1. Client Domain інтеграція**

```java
@Service
public class Stage1CoordinationService {

    // ✅ Ін'єктуємо готові сервіси
    private final ClientDomainService clientDomainService;
    private final ClientSearchService clientSearchService;
    private final ClientValidationService clientValidationService;

    public List<ClientDTO> searchClients(String searchTerm) {
        // Використовуємо готовий пошук
        return clientSearchService.searchClients(searchTerm);
    }

    public ClientDTO createClient(CreateClientDTO dto) {
        // Використовуємо готову валідацію та створення
        clientValidationService.validateClientData(dto);
        return clientDomainService.createClient(dto);
    }
}
```

### **2. Pricing Domain інтеграція**

```java
@Service
public class PricingStepCoordinationService {

    // ✅ Використовуємо готові калькулятори
    private final PriceCalculationService priceCalculationService;
    private final PriceModifierCalculationService modifierService;
    private final CatalogPriceModifierService catalogService;

    public PriceCalculationResultDTO calculateItemPrice(ItemDataDTO itemData) {
        // Готова логіка розрахунку
        return priceCalculationService.calculatePrice(itemData);
    }

    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        // Готовий каталог модифікаторів
        return catalogService.getModifiersForCategory(categoryCode);
    }
}
```

### **3. Order Domain інтеграція**

```java
@Service
public class OrderCreationCoordinationService {

    // ✅ Використовуємо готові сервіси замовлень
    private final OrderDomainService orderDomainService;
    private final OrderItemService orderItemService;
    private final ReceiptGenerationService receiptService;

    public OrderDTO createOrder(OrderWizardContext context) {
        // Готова логіка створення замовлення
        return orderDomainService.createOrder(context.toOrderCreateDTO());
    }

    public ReceiptDTO generateReceipt(Long orderId) {
        // Готова генерація квитанції
        return receiptService.generateReceipt(orderId);
    }
}
```

---

## 📋 Правила створення State Machine компонентів

### **1. Actions - виконують готові операції**

```java
@Component
public class SaveBasicInfoAction implements Action<OrderState, OrderEvent> {

    private final BasicInfoCoordinationService coordinationService; // Наш тонкий шар

    @Override
    public void execute(StateContext<OrderState, OrderEvent> context) {
        // Отримуємо дані з контексту
        BasicInfoDTO basicInfo = context.getExtendedState()
            .get("basicInfo", BasicInfoDTO.class);

        // Викликаємо готовий сервіс через координатор
        BasicInfoDTO savedInfo = coordinationService.saveBasicInfo(basicInfo);

        // Зберігаємо результат в контексті
        context.getExtendedState().getVariables().put("savedBasicInfo", savedInfo);
    }
}
```

### **2. Guards - перевіряють готовність через готові валідатори**

```java
@Component
public class BasicInfoValidGuard implements Guard<OrderState, OrderEvent> {

    private final ClientValidationService clientValidationService; // Готовий валідатор
    private final PricingValidationService pricingValidationService; // Готовий валідатор

    @Override
    public boolean evaluate(StateContext<OrderState, OrderEvent> context) {
        BasicInfoDTO basicInfo = context.getExtendedState()
            .get("basicInfo", BasicInfoDTO.class);

        // Використовуємо готові валідатори
        boolean clientValid = clientValidationService.isClientDataValid(basicInfo.getClientData());
        boolean itemValid = pricingValidationService.isItemDataValid(basicInfo.getItemData());

        return clientValid && itemValid;
    }
}
```

### **3. Координаційні сервіси - тонкий шар над доменами**

```java
@Service
public class Stage2CoordinationService {

    // Готові доменні сервіси
    private final PriceListDomainService priceListService;
    private final PriceCalculationService calculationService;
    private final OrderItemService orderItemService;
    private final FileStorageService fileStorageService;

    // Методи координації (тонкі обгортки)
    public List<ServiceCategoryDTO> getServiceCategories() {
        return priceListService.getAllCategories(); // Готове
    }

    public ItemPriceDTO calculateItemPrice(ItemDataDTO data) {
        return calculationService.calculatePrice(data); // Готове
    }

    public OrderItemDTO addItemToOrder(String wizardId, OrderItemDTO item) {
        // Комбінуємо готові операції
        OrderItemDTO validatedItem = orderItemService.validateItem(item);
        return orderItemService.addToOrder(wizardId, validatedItem);
    }
}
```

---

## 🔄 Правила управління контекстом візарда

### **Структура OrderWizardContext**

```java
@Component
@Scope("prototype")
public class OrderWizardContext {

    // Ідентифікатори
    private String wizardId;
    private Long orderId;

    // Дані етапів (зберігаємо результати готових операцій)
    private ClientDTO selectedClient;
    private BranchDTO selectedBranch;
    private List<OrderItemDTO> orderItems; // З готових сервісів
    private OrderParametersDTO orderParameters;
    private PaymentDTO paymentInfo;

    // Метаінформація
    private OrderState currentState;
    private Map<String, Object> stageData;

    // Методи трансформації для готових сервісів
    public CreateOrderDTO toCreateOrderDTO() {
        // Трансформуємо в DTO для OrderDomainService
    }

    public PriceCalculationRequestDTO toPriceCalculationDTO() {
        // Трансформуємо в DTO для PriceCalculationService
    }
}
```

### **Правила роботи з контекстом**

```java
// ✅ Зберігаємо результати готових операцій
context.getExtendedState().getVariables().put("client", clientDomainService.getClient(clientId));

// ✅ Передаємо дані в готові сервіси
ClientDTO client = context.getExtendedState().get("client", ClientDTO.class);
OrderDTO order = orderDomainService.createOrder(client, orderItems);

// ❌ НЕ зберігаємо проміжні розрахунки - використовуємо готові
// context.put("intermediatePrice", someCalculation); // ПОГАНО
```

---

## 📊 Шаблони інтеграції для кожного етапу

### **Етап 1: Клієнт та базова інформація**

```java
@Service
public class Stage1CoordinationService {

    // Готові сервіси
    private final ClientDomainService clientDomainService;
    private final ClientSearchService clientSearchService;
    private final BranchDomainService branchDomainService;
    private final OrderDomainService orderDomainService;

    // Тонкі обгортки
    public List<ClientDTO> searchClients(String term) {
        return clientSearchService.searchClients(term);
    }

    public ClientDTO createClient(CreateClientDTO dto) {
        return clientDomainService.createClient(dto);
    }

    public List<BranchDTO> getAvailableBranches() {
        return branchDomainService.getActiveBranches();
    }

    public String initializeOrder(ClientDTO client, BranchDTO branch) {
        return orderDomainService.initializeOrder(client, branch);
    }
}
```

### **Етап 2: Менеджер предметів**

```java
@Service
public class Stage2CoordinationService {

    // Готові сервіси
    private final PriceListDomainService priceListService;
    private final PriceCalculationService calculationService;
    private final PriceModifierCalculationService modifierService;
    private final OrderItemService orderItemService;
    private final FileStorageService fileStorageService;

    // Підетап 2.1
    public List<ServiceCategoryDTO> getServiceCategories() {
        return priceListService.getAllCategories();
    }

    public List<PriceListItemDTO> getItemsByCategory(String categoryCode) {
        return priceListService.getItemsByCategory(categoryCode);
    }

    // Підетап 2.4
    public PriceCalculationResultDTO calculatePrice(ItemDataDTO itemData) {
        return calculationService.calculatePrice(itemData);
    }

    public List<PriceModifierDTO> getAvailableModifiers(String categoryCode) {
        return modifierService.getModifiersForCategory(categoryCode);
    }

    // Підетап 2.5
    public PhotoDTO uploadPhoto(String wizardId, MultipartFile file) {
        return fileStorageService.uploadPhoto(wizardId, file);
    }
}
```

### **Етап 3: Параметри виконання**

```java
@Service
public class Stage3CoordinationService {

    // Готові сервіси
    private final OrderParametersService parametersService;
    private final DiscountCalculationService discountService;
    private final DeliveryDateService deliveryService;

    public OrderParametersDTO calculateDeliveryDate(List<OrderItemDTO> items) {
        return deliveryService.calculateDeliveryDate(items);
    }

    public DiscountResultDTO applyDiscount(DiscountType type, BigDecimal amount) {
        return discountService.calculateDiscount(type, amount);
    }
}
```

### **Етап 4: Завершення та квитанція**

```java
@Service
public class Stage4CoordinationService {

    // Готові сервіси
    private final OrderDomainService orderDomainService;
    private final ReceiptGenerationService receiptService;
    private final PdfGenerationService pdfService;
    private final EmailService emailService;

    public OrderDTO finalizeOrder(OrderWizardContext context) {
        return orderDomainService.createFinalOrder(context.toCreateOrderDTO());
    }

    public ReceiptDTO generateReceipt(Long orderId) {
        return receiptService.generateDetailedReceipt(orderId);
    }

    public byte[] generateReceiptPdf(Long orderId) {
        return pdfService.generateOrderReceipt(orderId);
    }

    public void sendReceiptByEmail(Long orderId, String email) {
        emailService.sendOrderReceipt(orderId, email);
    }
}
```

---

## 🧪 Правила тестування

### **Unit тести - тестуємо інтеграцію, не бізнес-логіку**

```java
@ExtendWith(MockitoExtension.class)
class Stage1CoordinationServiceTest {

    @Mock
    private ClientDomainService clientDomainService; // Мокаємо готовий сервіс

    @InjectMocks
    private Stage1CoordinationService coordinationService;

    @Test
    void shouldCreateClientUsingDomainService() {
        // Arrange
        CreateClientDTO dto = new CreateClientDTO();
        ClientDTO expected = new ClientDTO();
        when(clientDomainService.createClient(dto)).thenReturn(expected);

        // Act
        ClientDTO result = coordinationService.createClient(dto);

        // Assert
        verify(clientDomainService).createClient(dto); // Перевіряємо виклик готового сервісу
        assertEquals(expected, result);
    }
}
```

### **State Machine тести**

```java
@SpringBootTest
@TestPropertySource(properties = "spring.statemachine.async=false")
class OrderWizardStateMachineTest {

    @Autowired
    private StateMachineFactory<OrderState, OrderEvent> factory;

    @Test
    void shouldTransitionFromInitToClientSelection() {
        // Тестуємо переходи, не бізнес-логіку
        StateMachine<OrderState, OrderEvent> sm = factory.getStateMachine();

        sm.start();
        sm.sendEvent(OrderEvent.START_WIZARD);

        assertEquals(OrderState.CLIENT_SELECTION, sm.getState().getId());
    }
}
```

---

## 🚀 Правила розгортання в Cursor IDE

### **1. Послідовність створення компонентів**

1. **Enum'и** - розширити OrderState та OrderEvent
2. **Context** - налаштувати OrderWizardContext
3. **Координаційні сервіси** - тонкі обгортки над доменами
4. **Actions** - виклики координаційних сервісів
5. **Guards** - валідація через готові сервіси
6. **Адаптери** - API для Frontend
7. **Конфігурація** - State Machine transitions

### **2. Правила рефакторингу**

```java
// ❌ Якщо бачимо дублювання бізнес-логіки
public class ItemPriceCalculator {
    public BigDecimal calculate() {
        // Дублює логіку з PriceCalculationService
    }
}

// ✅ Замінюємо на використання готового сервісу
@Service
public class ItemPriceCoordinator {
    private final PriceCalculationService priceCalculationService; // Готове

    public BigDecimal coordinateCalculation(ItemDataDTO data) {
        return priceCalculationService.calculatePrice(data).getTotalPrice();
    }
}
```

### **3. Правила налагодження**

- Логуємо виклики готових сервісів, не їх внутрішню логіку
- Перевіряємо контекст State Machine після кожного переходу
- Тестуємо інтеграцію між етапами, не доменну логіку

---

## 🎯 Чекліст готовності компонентів

### **Для кожного етапу:**

- [ ] Координаційний сервіс створений як тонка обгортка
- [ ] Усі виклики йдуть до готових доменних сервісів
- [ ] Actions тільки координують, не реалізують бізнес-логіку
- [ ] Guards використовують готові валідатори
- [ ] Тести покривають інтеграцію, не дублюють доменні тести

### **Для State Machine:**

- [ ] Стани відповідають етапам візарда
- [ ] Події запускають готові операції
- [ ] Контекст зберігає результати готових сервісів
- [ ] Переходи валідуються готовими бізнес-правилами

### **Для інтеграції:**

- [ ] Усі доменні сервіси інжектовані правильно
- [ ] Немає дублювання існуючої бізнес-логіки
- [ ] Координація відбувається через тонкі обгортки
- [ ] Результати готових операцій корректно передаються між етапами

**Головне правило:** Ми організовуємо готову функціональність, а не створюємо нову!
