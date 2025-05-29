package com.aksi.ui.wizard.step1;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import com.aksi.domain.branch.dto.BranchLocationDTO;
import com.aksi.domain.branch.service.BranchLocationService;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Hr;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.notification.NotificationVariant;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для базової інформації замовлення.
 * Відповідає за функціональність згідно з документацією 1.2 "Базова інформація замовлення".
 *
 * Функціональність:
 * - Номер квитанції (генерується автоматично)
 * - Унікальна мітка (вводиться вручну або сканується)
 * - Пункт прийому замовлення (вибір філії)
 * - Дата створення замовлення (автоматично)
 */
@Component
@Slf4j
public class OrderBasicInfoComponent extends VerticalLayout {

    private final BranchLocationService branchLocationService;
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");

    // UI компоненти
    private FormLayout orderForm;
    private TextField receiptNumberField;
    private TextField tagNumberField;
    private ComboBox<BranchLocationDTO> branchSelector;
    private TextField creationDateField;

    // Callbacks
    private Consumer<String> onReceiptNumberChanged;
    private Consumer<String> onTagNumberChanged;
    private Consumer<BranchLocationDTO> onBranchChanged;

    public OrderBasicInfoComponent(BranchLocationService branchLocationService) {
        this.branchLocationService = branchLocationService;
        log.info("🏗️ ІНІЦІАЛІЗАЦІЯ: OrderBasicInfoComponent створюється");

        initializeLayout();
        createComponents();
        setupEventHandlers();
        loadData();

        log.info("✅ ГОТОВО: OrderBasicInfoComponent ініціалізовано");
    }

    private void initializeLayout() {
        setWidthFull();
        setPadding(true);
        setSpacing(true);
        addClassName("order-basic-info");
        getStyle().set("background", "var(--lumo-contrast-5pct)")
                  .set("border-radius", "8px")
                  .set("padding", "2rem")
                  .set("margin-bottom", "1rem");
    }

    private void createComponents() {
        createHeader();
        createReceiptSection();
        createTagSection();
        createBranchSection();
        createDateSection();
    }

    private void createHeader() {
        HorizontalLayout header = new HorizontalLayout();
        header.setAlignItems(FlexComponent.Alignment.CENTER);
        header.setSpacing(true);
        header.setWidthFull();

        Icon documentIcon = VaadinIcon.CLIPBOARD_TEXT.create();
        documentIcon.setColor("var(--lumo-primary-color)");
        documentIcon.setSize("24px");

        H3 title = new H3("Базова інформація замовлення");
        title.getStyle().set("margin", "0")
                      .set("color", "var(--lumo-primary-text-color)")
                      .set("flex-grow", "1");

        Icon infoIcon = VaadinIcon.INFO_CIRCLE.create();
        infoIcon.setColor("var(--lumo-secondary-text-color)");
        infoIcon.setTooltipText("Поля позначені * є обов'язковими");

        header.add(documentIcon, title, infoIcon);
        add(header, new Hr());
    }

    private void createReceiptSection() {
        Div sectionTitle = createSectionTitle("Номер квитанції", VaadinIcon.BARCODE);
        add(sectionTitle);

        orderForm = new FormLayout();
        orderForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        receiptNumberField = new TextField("Номер квитанції *");
        receiptNumberField.setValue(generateReceiptNumber());
        receiptNumberField.setRequired(true);
        receiptNumberField.setPrefixComponent(VaadinIcon.BARCODE.create());
        receiptNumberField.setHelperText("Автоматично згенерований унікальний номер");
        receiptNumberField.setReadOnly(true); // Тільки для читання, автогенерований

        orderForm.add(receiptNumberField);
        add(orderForm);
    }

    private void createTagSection() {
        Div sectionTitle = createSectionTitle("Унікальна мітка", VaadinIcon.TAG);
        add(sectionTitle);

        FormLayout tagForm = new FormLayout();
        tagForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        tagNumberField = new TextField("Унікальна мітка");
        tagNumberField.setPrefixComponent(VaadinIcon.TAG.create());
        tagNumberField.setPlaceholder("Введіть або скануйте мітку");
        tagNumberField.setHelperText("Необов'язково - для відстеження предметів");

        tagForm.add(tagNumberField);
        add(tagForm);
    }

    private void createBranchSection() {
        Div sectionTitle = createSectionTitle("Пункт прийому", VaadinIcon.BUILDING);
        add(sectionTitle);

        FormLayout branchForm = new FormLayout();
        branchForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        branchSelector = new ComboBox<>("Пункт прийому *");
        branchSelector.setItemLabelGenerator(branch ->
            String.format("%s - %s", branch.getName(), branch.getAddress()));
        branchSelector.setRequired(true);
        branchSelector.setPrefixComponent(VaadinIcon.BUILDING.create());
        branchSelector.setHelperText("Оберіть філію для прийому замовлення");
        branchSelector.setPlaceholder("Оберіть пункт прийому");

        branchForm.add(branchSelector);
        add(branchForm);
    }

    private void createDateSection() {
        Div sectionTitle = createSectionTitle("Дата створення", VaadinIcon.CALENDAR_CLOCK);
        add(sectionTitle);

        FormLayout dateForm = new FormLayout();
        dateForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        creationDateField = new TextField("Дата створення замовлення");
        creationDateField.setValue(LocalDateTime.now().format(dateTimeFormatter));
        creationDateField.setPrefixComponent(VaadinIcon.CALENDAR_CLOCK.create());
        creationDateField.setHelperText("Автоматично встановлена поточна дата та час");
        creationDateField.setReadOnly(true); // Тільки для читання

        dateForm.add(creationDateField);
        add(dateForm);
    }

    private Div createSectionTitle(String title, VaadinIcon icon) {
        Div sectionDiv = new Div();
        sectionDiv.getStyle().set("margin-top", "1.5rem")
                           .set("margin-bottom", "1rem");

        HorizontalLayout sectionLayout = new HorizontalLayout();
        sectionLayout.setAlignItems(FlexComponent.Alignment.CENTER);
        sectionLayout.setSpacing(true);

        Icon sectionIcon = icon.create();
        sectionIcon.setColor("var(--lumo-primary-color)");
        sectionIcon.setSize("16px");

        Span sectionTitle = new Span(title);
        sectionTitle.getStyle().set("font-weight", "600")
                             .set("color", "var(--lumo-primary-text-color)");

        sectionLayout.add(sectionIcon, sectionTitle);
        sectionDiv.add(sectionLayout);

        return sectionDiv;
    }

    private void setupEventHandlers() {
        receiptNumberField.addValueChangeListener(e -> {
            log.info("📋 НОМЕР КВИТАНЦІЇ: змінено на '{}'", e.getValue());
            if (onReceiptNumberChanged != null) {
                onReceiptNumberChanged.accept(e.getValue());
            }
        });

        tagNumberField.addValueChangeListener(e -> {
            log.info("🏷️ УНІКАЛЬНА МІТКА: змінено на '{}'", e.getValue());
            if (onTagNumberChanged != null) {
                onTagNumberChanged.accept(e.getValue());
            }
        });

        branchSelector.addValueChangeListener(e -> {
            BranchLocationDTO selectedBranch = e.getValue();
            if (selectedBranch != null) {
                log.info("🏢 ФІЛІЯ: обрано '{}' ({})", selectedBranch.getName(), selectedBranch.getCode());
            } else {
                log.info("🏢 ФІЛІЯ: вибір скасовано");
            }
            if (onBranchChanged != null) {
                onBranchChanged.accept(selectedBranch);
            }
        });
    }

    private void loadData() {
        try {
            log.info("🔄 ЗАВАНТАЖЕННЯ: отримуємо список активних філій");
            List<BranchLocationDTO> branches = branchLocationService.getActiveBranchLocations();

            log.info("📊 ФІЛІЇ: завантажено {} активних філій", branches.size());
            branchSelector.setItems(branches);

            if (!branches.isEmpty()) {
                BranchLocationDTO defaultBranch = branches.get(0);
                branchSelector.setValue(defaultBranch);
                log.info("🎯 ФІЛІЯ ЗА ЗАМОВЧУВАННЯМ: встановлено '{}'", defaultBranch.getName());
            } else {
                log.warn("⚠️ ПОПЕРЕДЖЕННЯ: немає активних філій");
                Notification notification = Notification.show("⚠️ Увага: немає доступних пунктів прийому");
                notification.addThemeVariants(NotificationVariant.LUMO_CONTRAST);
                notification.setDuration(5000);
            }

        } catch (Exception e) {
            log.error("❌ ПОМИЛКА: неможливо завантажити філії", e);
            Notification notification = Notification.show("❌ Помилка завантаження філій: " + e.getMessage());
            notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
            notification.setDuration(7000);
        }
    }

    private String generateReceiptNumber() {
        String receiptNumber = "RCP-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) +
                              "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        log.info("🆔 ГЕНЕРАЦІЯ: створено номер квитанції '{}'", receiptNumber);
        return receiptNumber;
    }

    /**
     * Перевірити чи заповнені обов'язкові поля.
     */
    public boolean isValid() {
        boolean hasReceiptNumber = receiptNumberField.getValue() != null &&
                                  !receiptNumberField.getValue().trim().isEmpty();
        boolean hasBranch = branchSelector.getValue() != null;

        boolean isValid = hasReceiptNumber && hasBranch;

        log.info("✅ ВАЛІДАЦІЯ: форма {} (номер квитанції: {}, філія: {})",
                isValid ? "валідна" : "невалідна",
                hasReceiptNumber ? "✓" : "✗",
                hasBranch ? "✓" : "✗");

        // Встановлюємо помилки валідації
        if (!hasReceiptNumber) {
            receiptNumberField.setInvalid(true);
            receiptNumberField.setErrorMessage("Номер квитанції обов'язковий");
        } else {
            receiptNumberField.setInvalid(false);
        }

        if (!hasBranch) {
            branchSelector.setInvalid(true);
            branchSelector.setErrorMessage("Пункт прийому обов'язковий");
        } else {
            branchSelector.setInvalid(false);
        }

        return isValid;
    }

    /**
     * Отримати номер квитанції.
     */
    public String getReceiptNumber() {
        return receiptNumberField.getValue() != null ? receiptNumberField.getValue().trim() : null;
    }

    /**
     * Отримати номер мітки.
     */
    public String getTagNumber() {
        String tagNumber = tagNumberField.getValue() != null ? tagNumberField.getValue().trim() : null;
        log.debug("🏷️ ОТРИМАННЯ: унікальна мітка '{}'", tagNumber);
        return tagNumber;
    }

    /**
     * Отримати вибрану філію.
     */
    public BranchLocationDTO getSelectedBranch() {
        BranchLocationDTO branch = branchSelector.getValue();
        if (branch != null) {
            log.debug("🏢 ОТРИМАННЯ: вибрана філія '{}' (ID: {})", branch.getName(), branch.getId());
        }
        return branch;
    }

    /**
     * Отримати дату створення замовлення.
     */
    public LocalDateTime getCreationDate() {
        return LocalDateTime.now(); // Завжди поточна дата
    }

    /**
     * Встановити номер квитанції.
     */
    public void setReceiptNumber(String receiptNumber) {
        log.info("📝 ВСТАНОВЛЕННЯ: номер квитанції '{}'", receiptNumber);
        receiptNumberField.setValue(receiptNumber);
    }

    /**
     * Встановити номер мітки.
     */
    public void setTagNumber(String tagNumber) {
        log.info("📝 ВСТАНОВЛЕННЯ: унікальна мітка '{}'", tagNumber);
        tagNumberField.setValue(tagNumber);
    }

    /**
     * Встановити вибрану філію.
     */
    public void setSelectedBranch(BranchLocationDTO branch) {
        if (branch != null) {
            log.info("📝 ВСТАНОВЛЕННЯ: філія '{}' ({})", branch.getName(), branch.getCode());
        }
        branchSelector.setValue(branch);
    }

    /**
     * Згенерувати новий номер квитанції.
     */
    public void regenerateReceiptNumber() {
        String newReceiptNumber = generateReceiptNumber();
        setReceiptNumber(newReceiptNumber);
        log.info("🔄 РЕГЕНЕРАЦІЯ: новий номер квитанції '{}'", newReceiptNumber);
    }

    /**
     * Очистити форму.
     */
    public void clearForm() {
        log.info("🧹 ОЧИЩЕННЯ: скидаємо форму базової інформації");
        regenerateReceiptNumber();
        tagNumberField.clear();
        creationDateField.setValue(LocalDateTime.now().format(dateTimeFormatter));

        // Філію не очищаємо, залишаємо за замовчуванням
        List<BranchLocationDTO> branches = branchLocationService.getActiveBranchLocations();
        if (!branches.isEmpty() && branchSelector.getValue() == null) {
            branchSelector.setValue(branches.get(0));
        }

        // Скидаємо помилки валідації
        receiptNumberField.setInvalid(false);
        branchSelector.setInvalid(false);
    }

    /**
     * Встановити callback для зміни номера квитанції.
     */
    public void setOnReceiptNumberChanged(Consumer<String> onReceiptNumberChanged) {
        this.onReceiptNumberChanged = onReceiptNumberChanged;
    }

    /**
     * Встановити callback для зміни номера мітки.
     */
    public void setOnTagNumberChanged(Consumer<String> onTagNumberChanged) {
        this.onTagNumberChanged = onTagNumberChanged;
    }

    /**
     * Встановити callback для зміни філії.
     */
    public void setOnBranchChanged(Consumer<BranchLocationDTO> onBranchChanged) {
        this.onBranchChanged = onBranchChanged;
    }
}
