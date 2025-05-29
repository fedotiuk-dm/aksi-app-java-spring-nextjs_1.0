package com.aksi.ui.wizard.step3;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для третього етапу Order Wizard.
 * Відповідає за загальні параметри замовлення.
 */
@Slf4j
public class OrderParametersView extends VerticalLayout {

    private final OrderWizardData wizardData;
    private final Runnable onCompleted;

    public OrderParametersView(OrderWizardData wizardData, Runnable onCompleted) {
        this.wizardData = wizardData;
        this.onCompleted = onCompleted;

        initializeLayout();
        createComponents();

        log.info("OrderParametersView initialized for receipt: {}",
            wizardData.getDraftOrder().getReceiptNumber());
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createComponents() {
        add(new H3("Параметри замовлення"));

        // TODO: Реалізувати повну функціональність згідно з документацією:
        // - Параметри виконання (дата виконання, термінове виконання)
        // - Знижки (глобальні для замовлення)
        // - Оплата (спосіб оплати, фінансові деталі)
        // - Додаткова інформація

        Button tempNextButton = new Button("Далі до підтвердження (тимчасово)");
        tempNextButton.addClickListener(e -> onCompleted.run());

        add(tempNextButton);
    }
}
