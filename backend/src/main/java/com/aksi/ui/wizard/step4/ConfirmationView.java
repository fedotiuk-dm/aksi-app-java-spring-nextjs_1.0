package com.aksi.ui.wizard.step4;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для четвертого етапу Order Wizard.
 * Відповідає за підтвердження та завершення з формуванням квитанції.
 */
@Slf4j
public class ConfirmationView extends VerticalLayout {

    private final OrderWizardData wizardData;
    private final Runnable onCompleted;

    public ConfirmationView(OrderWizardData wizardData, Runnable onCompleted) {
        this.wizardData = wizardData;
        this.onCompleted = onCompleted;

        initializeLayout();
        createComponents();

        log.info("ConfirmationView initialized for receipt: {}",
            wizardData.getDraftOrder().getReceiptNumber());
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createComponents() {
        add(new H3("Підтвердження та завершення"));

        // TODO: Реалізувати повну функціональність згідно з документацією:
        // - Перегляд замовлення з детальним розрахунком
        // - Юридичні аспекти (чекбокс з умовами, цифровий підпис)
        // - Формування та друк квитанції
        // - Завершення процесу

        Button tempCompleteButton = new Button("Завершити замовлення (тимчасово)");
        tempCompleteButton.addClickListener(e -> onCompleted.run());

        add(tempCompleteButton);
    }
}
