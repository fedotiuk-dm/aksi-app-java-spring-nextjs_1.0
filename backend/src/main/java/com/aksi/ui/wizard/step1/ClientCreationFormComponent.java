package com.aksi.ui.wizard.step1;

import java.util.function.Consumer;

import org.springframework.stereotype.Component;

import com.aksi.domain.client.dto.ClientResponse;
import com.aksi.domain.client.dto.CreateClientRequest;
import com.aksi.domain.client.service.ClientService;
import com.aksi.ui.wizard.step1.builder.ClientRequestBuilder;
import com.aksi.ui.wizard.step1.validator.ClientCreationFormValidator;
import com.aksi.ui.wizard.step1.validator.ValidationResult;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.checkbox.CheckboxGroup;
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
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;

import lombok.extern.slf4j.Slf4j;

/**
 * Компонент для створення нового клієнта.
 * Відповідає за функціональність згідно з документацією 1.1 "Форма нового клієнта".
 * Використовує компонентну архітектуру для валідації та побудови запитів.
 */
@Component
@Slf4j
public class ClientCreationFormComponent extends VerticalLayout {

    private final ClientService clientService;
    private final ClientCreationFormValidator validator;
    private final ClientRequestBuilder requestBuilder;

    // UI компоненти
    private FormLayout clientForm;
    private TextField lastNameField;
    private TextField firstNameField;
    private TextField phoneField;
    private EmailField emailField;
    private TextArea addressField;
    private CheckboxGroup<String> communicationChannelsField;
    private ComboBox<String> informationSourceField;
    private TextField customInformationSourceField;
    private Button saveClientButton;
    private Button cancelButton;

    // Callbacks
    private Consumer<ClientResponse> onClientCreated;
    private Runnable onFormCancelled;

    public ClientCreationFormComponent(ClientService clientService,
                                     ClientCreationFormValidator validator,
                                     ClientRequestBuilder requestBuilder) {
        this.clientService = clientService;
        this.validator = validator;
        this.requestBuilder = requestBuilder;

        initializeLayout();
        createComponents();
        setupEventHandlers();
        setVisible(false); // За замовчуванням приховано
        log.info("ClientCreationFormComponent ініціалізовано");
    }

    private void initializeLayout() {
        setWidthFull();
        setPadding(true);
        setSpacing(true);
        addClassName("client-creation-form");
        getStyle().set("background", "var(--lumo-contrast-5pct)")
                  .set("border-radius", "8px")
                  .set("padding", "2rem")
                  .set("margin-top", "1rem");
    }

    private void createComponents() {
        createHeader();
        createBasicInfoSection();
        createContactSection();
        createCommunicationSection();
        createInformationSourceSection();
        createActionButtons();
    }

    private void createHeader() {
        HorizontalLayout header = new HorizontalLayout();
        header.setAlignItems(FlexComponent.Alignment.CENTER);
        header.setSpacing(true);
        header.setWidthFull();

        Icon userIcon = VaadinIcon.PLUS.create();
        userIcon.setColor("var(--lumo-primary-color)");
        userIcon.setSize("24px");

        H3 title = new H3("Створення нового клієнта");
        title.getStyle().set("margin", "0")
                      .set("color", "var(--lumo-primary-text-color)")
                      .set("flex-grow", "1");

        Icon infoIcon = VaadinIcon.INFO_CIRCLE.create();
        infoIcon.setColor("var(--lumo-secondary-text-color)");
        infoIcon.setTooltipText("Поля позначені * є обов'язковими");

        header.add(userIcon, title, infoIcon);
        add(header, new Hr());
    }

    private void createBasicInfoSection() {
        Div sectionTitle = createSectionTitle("Основна інформація", VaadinIcon.USER);
        add(sectionTitle);

        clientForm = new FormLayout();
        clientForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        lastNameField = new TextField("Прізвище *");
        lastNameField.setRequired(true);
        lastNameField.setPrefixComponent(VaadinIcon.USER.create());
        lastNameField.setPlaceholder("Введіть прізвище");

        firstNameField = new TextField("Ім'я *");
        firstNameField.setRequired(true);
        firstNameField.setPrefixComponent(VaadinIcon.USER.create());
        firstNameField.setPlaceholder("Введіть ім'я");

        clientForm.add(lastNameField, firstNameField);
        add(clientForm);
    }

    private void createContactSection() {
        Div sectionTitle = createSectionTitle("Контактна інформація", VaadinIcon.PHONE);
        add(sectionTitle);

        FormLayout contactForm = new FormLayout();
        contactForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        phoneField = new TextField("Телефон *");
        phoneField.setRequired(true);
        phoneField.setPrefixComponent(VaadinIcon.PHONE.create());
        phoneField.setPlaceholder("+380991234567");
        phoneField.setHelperText("Формат: +380XXXXXXXXX");

        emailField = new EmailField("Email");
        emailField.setPrefixComponent(VaadinIcon.ENVELOPE.create());
        emailField.setPlaceholder("example@gmail.com");
        emailField.setHelperText("Необов'язково");

        addressField = new TextArea("Адреса");
        addressField.setPrefixComponent(VaadinIcon.HOME.create());
        addressField.setPlaceholder("м. Київ, вул. Хрещатик, 1");
        addressField.setHelperText("Необов'язково");
        addressField.setMaxHeight("100px");

        contactForm.add(phoneField, emailField);
        contactForm.setColspan(addressField, 2);
        contactForm.add(addressField);

        add(contactForm);
    }

    private void createCommunicationSection() {
        Div sectionTitle = createSectionTitle("Способи зв'язку", VaadinIcon.CONNECT);
        add(sectionTitle);

        communicationChannelsField = new CheckboxGroup<>("Оберіть зручні способи зв'язку");
        communicationChannelsField.setItems(requestBuilder.getAvailableCommunicationChannels());
        communicationChannelsField.select(requestBuilder.getDefaultCommunicationChannels());
        communicationChannelsField.setHelperText("Оберіть один або декілька способів");

        add(communicationChannelsField);
    }

    private void createInformationSourceSection() {
        Div sectionTitle = createSectionTitle("Джерело інформації", VaadinIcon.INFO);
        add(sectionTitle);

        FormLayout sourceForm = new FormLayout();
        sourceForm.setResponsiveSteps(
            new FormLayout.ResponsiveStep("0", 1),
            new FormLayout.ResponsiveStep("600px", 2)
        );

        informationSourceField = new ComboBox<>("Звідки дізналися про нас *");
        informationSourceField.setItems(requestBuilder.getAvailableInformationSources());
        informationSourceField.setPlaceholder("Оберіть джерело");
        informationSourceField.setRequired(true);

        customInformationSourceField = new TextField("Уточніть джерело *");
        customInformationSourceField.setVisible(false);
        customInformationSourceField.setPlaceholder("Введіть деталі");

        sourceForm.add(informationSourceField, customInformationSourceField);
        add(sourceForm);
    }

    private void createActionButtons() {
        HorizontalLayout buttonLayout = new HorizontalLayout();
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);
        buttonLayout.setSpacing(true);
        buttonLayout.getStyle().set("margin-top", "2rem");

        cancelButton = new Button("Скасувати", VaadinIcon.CLOSE.create());
        cancelButton.addThemeVariants(ButtonVariant.LUMO_TERTIARY);

        saveClientButton = new Button("Зберегти клієнта", VaadinIcon.CHECK.create());
        saveClientButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS, ButtonVariant.LUMO_PRIMARY);

        buttonLayout.add(cancelButton, saveClientButton);
        add(buttonLayout);
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
        informationSourceField.addValueChangeListener(e -> {
            String selectedSource = e.getValue();
            log.info("📝 ДЖЕРЕЛО ІНФОРМАЦІЇ: обрано '{}'", selectedSource);
            handleInformationSourceChange(selectedSource);
        });

        saveClientButton.addClickListener(e -> {
            log.info("💾 ЗБЕРЕЖЕННЯ КЛІЄНТА: спроба збереження");
            handleSaveClient();
        });

        cancelButton.addClickListener(e -> {
            log.info("❌ СКАСУВАННЯ: користувач скасував створення клієнта");
            handleCancel();
        });

        // Додаємо валідацію в реальному часі
        lastNameField.addValueChangeListener(e -> validateField("lastName", e.getValue()));
        firstNameField.addValueChangeListener(e -> validateField("firstName", e.getValue()));
        phoneField.addValueChangeListener(e -> validateField("phone", e.getValue()));
    }

    private void validateField(String fieldName, String value) {
        // Простий онлайн валідатор
        if (value != null && !value.trim().isEmpty()) {
            switch (fieldName) {
                case "lastName" -> lastNameField.setInvalid(false);
                case "firstName" -> firstNameField.setInvalid(false);
                case "phone" -> phoneField.setInvalid(false);
            }
        }
    }

    private void handleInformationSourceChange(String selectedSource) {
        boolean showCustom = requestBuilder.requiresCustomSourceDetails(selectedSource);
        customInformationSourceField.setVisible(showCustom);
        customInformationSourceField.setRequired(showCustom);

        if (!showCustom) {
            customInformationSourceField.clear();
        }
    }

    private void handleSaveClient() {
        log.info("💾 ВАЛІДАЦІЯ: початок валідації форми");
        ValidationResult validationResult = validateForm();

        if (!validationResult.isValid()) {
            log.warn("❌ ВАЛІДАЦІЯ: форма не пройшла валідацію");
            showValidationErrors(validationResult);
            return;
        }

        try {
            log.info("🔄 API: створення клієнта через сервіс");
            CreateClientRequest request = buildCreateClientRequest();
            ClientResponse savedClient = clientService.createClient(request);

            log.info("✅ УСПІХ: клієнт створений з ID {}", savedClient.getId());
            clearForm();
            setVisible(false);

            Notification notification = Notification.show(
                "✅ Клієнта успішно створено: " + savedClient.getLastName() + " " + savedClient.getFirstName());
            notification.addThemeVariants(NotificationVariant.LUMO_SUCCESS);
            notification.setDuration(3000);

            if (onClientCreated != null) {
                onClientCreated.accept(savedClient);
            }

        } catch (Exception e) {
            log.error("❌ ПОМИЛКА: неможливо створити клієнта", e);
            Notification notification = Notification.show("❌ Помилка при створенні клієнта: " + e.getMessage());
            notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
            notification.setDuration(5000);
        }
    }

    private void handleCancel() {
        clearForm();
        setVisible(false);

        if (onFormCancelled != null) {
            onFormCancelled.run();
        }
    }

    private ValidationResult validateForm() {
        return validator.validateCompleteForm(
            lastNameField.getValue(),
            firstNameField.getValue(),
            phoneField.getValue(),
            emailField.getValue(),
            addressField.getValue(),
            informationSourceField.getValue(),
            customInformationSourceField.getValue()
        );
    }

    private void showValidationErrors(ValidationResult validationResult) {
        String errorMessage = validationResult.getErrorsAsText();

        // Відображаємо помилки на відповідних полях
        validationResult.getErrors().forEach(error -> {
            if (error.contains("Прізвище")) {
                lastNameField.setInvalid(true);
                lastNameField.setErrorMessage(error);
            } else if (error.contains("Ім'я")) {
                firstNameField.setInvalid(true);
                firstNameField.setErrorMessage(error);
            } else if (error.contains("Телефон")) {
                phoneField.setInvalid(true);
                phoneField.setErrorMessage(error);
            } else if (error.contains("Email")) {
                emailField.setInvalid(true);
                emailField.setErrorMessage(error);
            }
        });

        Notification notification = Notification.show("❌ Помилки валідації: " + errorMessage);
        notification.addThemeVariants(NotificationVariant.LUMO_ERROR);
        notification.setDuration(7000);
    }

    private CreateClientRequest buildCreateClientRequest() {
        return requestBuilder.buildCreateClientRequest(
            lastNameField.getValue(),
            firstNameField.getValue(),
            phoneField.getValue(),
            emailField.getValue(),
            addressField.getValue(),
            communicationChannelsField.getSelectedItems(),
            informationSourceField.getValue(),
            customInformationSourceField.getValue()
        );
    }

    private void clearForm() {
        lastNameField.clear();
        lastNameField.setInvalid(false);
        firstNameField.clear();
        firstNameField.setInvalid(false);
        phoneField.clear();
        phoneField.setInvalid(false);
        emailField.clear();
        emailField.setInvalid(false);
        addressField.clear();
        communicationChannelsField.clear();
        communicationChannelsField.select(requestBuilder.getDefaultCommunicationChannels());
        informationSourceField.clear();
        customInformationSourceField.clear();
        customInformationSourceField.setVisible(false);
        customInformationSourceField.setRequired(false);
    }

    /**
     * Показати форму створення клієнта.
     */
    public void showForm() {
        log.info("👁️ ФОРМА: показуємо форму створення клієнта");
        clearForm();
        setVisible(true);
        lastNameField.focus(); // Фокус на перше поле
    }

    /**
     * Приховати форму створення клієнта.
     */
    public void hideForm() {
        log.info("👁️ ФОРМА: приховуємо форму створення клієнта");
        setVisible(false);
    }

    /**
     * Встановити callback для обробки створення клієнта.
     */
    public void setOnClientCreated(Consumer<ClientResponse> onClientCreated) {
        this.onClientCreated = onClientCreated;
    }

    /**
     * Встановити callback для обробки скасування форми.
     */
    public void setOnFormCancelled(Runnable onFormCancelled) {
        this.onFormCancelled = onFormCancelled;
    }
}
