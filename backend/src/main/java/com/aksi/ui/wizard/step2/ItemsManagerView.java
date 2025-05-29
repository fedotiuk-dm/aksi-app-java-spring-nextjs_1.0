package com.aksi.ui.wizard.step2;

import com.aksi.ui.wizard.dto.OrderWizardData;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import lombok.extern.slf4j.Slf4j;

/**
 * UI компонент для другого етапу Order Wizard.
 * Відповідає за управління предметами замовлення (циклічний процес).
 */
@Slf4j
public class ItemsManagerView extends VerticalLayout {

    private final OrderWizardData wizardData;
    private final Runnable onCompleted;

    public ItemsManagerView(OrderWizardData wizardData, Runnable onCompleted) {
        this.wizardData = wizardData;
        this.onCompleted = onCompleted;

        initializeLayout();
        createComponents();

        log.info("ItemsManagerView initialized for receipt: {}",
            wizardData.getDraftOrder().getReceiptNumber());
    }

    private void initializeLayout() {
        setSizeFull();
        setPadding(true);
        setSpacing(true);
    }

    private void createComponents() {
        add(new H3("Менеджер предметів замовлення"));

        // TODO: Реалізувати повну функціональність згідно з документацією:
        // - Таблиця доданих предметів
        // - Кнопка "Додати предмет" (запускає підвізард)
        // - Лічильник загальної вартості
        // - Кнопка "Продовжити до наступного етапу"

        Button tempNextButton = new Button("Далі до параметрів (тимчасово)");
        tempNextButton.addClickListener(e -> onCompleted.run());

        add(tempNextButton);
    }
}
