package com.aksi.ui;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.LumoUtility;

import jakarta.annotation.security.PermitAll;

/**
 * Головна сторінка дашборда
 */
@Route(value = "", layout = MainLayout.class)
@PageTitle("Головна | AKSI")
@PermitAll
public class DashboardView extends VerticalLayout {

    public DashboardView() {
        addClassName("dashboard-view");
        setDefaultHorizontalComponentAlignment(Alignment.STRETCH);
        add(getStats());
    }

    private Component getStats() {
        HorizontalLayout stats = new HorizontalLayout();
        stats.addClassName("stats");
        stats.setDefaultVerticalComponentAlignment(FlexComponent.Alignment.CENTER);
        stats.add(
            createStatCard("Загальна кількість клієнтів", "1,234", VaadinIcon.USERS, "primary"),
            createStatCard("Активні замовлення", "89", VaadinIcon.PACKAGE, "success"),
            createStatCard("Виконані замовлення", "456", VaadinIcon.CHECK_CIRCLE, "contrast"),
            createStatCard("Загальний дохід", "₴125,430", VaadinIcon.MONEY, "error")
        );
        return stats;
    }

    private Component createStatCard(String title, String value, VaadinIcon icon, String theme) {
        Div card = new Div();
        card.addClassNames(LumoUtility.Background.CONTRAST_5, LumoUtility.BorderRadius.LARGE,
                          LumoUtility.Padding.LARGE);

        Div header = new Div();
        header.addClassNames(LumoUtility.Display.FLEX, LumoUtility.AlignItems.CENTER,
                           LumoUtility.JustifyContent.BETWEEN);

        Span titleSpan = new Span(title);
        titleSpan.addClassNames(LumoUtility.FontSize.SMALL, LumoUtility.TextColor.SECONDARY);

        Icon iconComponent = icon.create();
        iconComponent.addClassNames(LumoUtility.TextColor.PRIMARY);
        iconComponent.getElement().getThemeList().add(theme);

        header.add(titleSpan, iconComponent);

        H3 valueHeader = new H3(value);
        valueHeader.addClassNames(LumoUtility.FontSize.XXLARGE, LumoUtility.Margin.NONE);

        card.add(header, valueHeader);
        return card;
    }
}
