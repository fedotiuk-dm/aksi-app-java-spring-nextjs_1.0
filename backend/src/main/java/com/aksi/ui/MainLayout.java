package com.aksi.ui;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.avatar.Avatar;
import com.vaadin.flow.component.contextmenu.MenuItem;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Footer;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Header;
import com.vaadin.flow.component.html.ListItem;
import com.vaadin.flow.component.html.Nav;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.html.UnorderedList;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.menubar.MenuBar;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.RouterLink;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.theme.lumo.LumoUtility.AlignItems;
import com.vaadin.flow.theme.lumo.LumoUtility.BoxSizing;
import com.vaadin.flow.theme.lumo.LumoUtility.Display;
import com.vaadin.flow.theme.lumo.LumoUtility.FlexDirection;
import com.vaadin.flow.theme.lumo.LumoUtility.FontSize;
import com.vaadin.flow.theme.lumo.LumoUtility.FontWeight;
import com.vaadin.flow.theme.lumo.LumoUtility.Gap;
import com.vaadin.flow.theme.lumo.LumoUtility.Height;
import com.vaadin.flow.theme.lumo.LumoUtility.ListStyleType;
import com.vaadin.flow.theme.lumo.LumoUtility.Margin;
import com.vaadin.flow.theme.lumo.LumoUtility.Overflow;
import com.vaadin.flow.theme.lumo.LumoUtility.Padding;
import com.vaadin.flow.theme.lumo.LumoUtility.TextColor;
import com.vaadin.flow.theme.lumo.LumoUtility.Whitespace;

/**
 * Головний layout для додатку з навігацією
 */
@AnonymousAllowed
public class MainLayout extends AppLayout {

    private H1 viewTitle;

    public MainLayout() {
        setPrimarySection(Section.DRAWER);
        addDrawerContent();
        addHeaderContent();
    }

    private void addHeaderContent() {
        DrawerToggle toggle = new DrawerToggle();
        toggle.setAriaLabel("Меню");

        viewTitle = new H1();
        viewTitle.addClassNames(FontSize.LARGE, Margin.NONE);

        addToNavbar(true, toggle, viewTitle);
    }

    private void addDrawerContent() {
        H1 appName = new H1("AKSI");
        appName.addClassNames(FontSize.LARGE, FontWeight.BOLD, Margin.NONE);
        Header header = new Header(appName);

        Div scroller = new Div(createNavigation());
        scroller.addClassNames(BoxSizing.BORDER, Display.FLEX, FlexDirection.COLUMN, Gap.SMALL,
                               Height.FULL, Overflow.AUTO, Padding.MEDIUM);

        addToDrawer(header, scroller, createFooter());
    }

    private Nav createNavigation() {
        Nav nav = new Nav();
        nav.addClassNames(Display.FLEX, Overflow.AUTO, Padding.NONE, FlexDirection.COLUMN);
        nav.getElement().setAttribute("aria-labelledby", "views");

        // Створення пунктів навігації
        UnorderedList list = new UnorderedList();
        list.addClassNames(Display.FLEX, FlexDirection.COLUMN, Gap.SMALL, ListStyleType.NONE,
                          Margin.NONE, Padding.NONE);
        nav.add(list);

        // Головна сторінка
        list.add(createNavigationItem("Головна", DashboardView.class, VaadinIcon.DASHBOARD.create()));

        // Клієнти
        list.add(createNavigationItem("Клієнти", ClientsView.class, VaadinIcon.USERS.create()));

        // Замовлення
        list.add(createNavigationItem("Замовлення", OrdersView.class, VaadinIcon.PACKAGE.create()));

        return nav;
    }

    private ListItem createNavigationItem(String text, Class<? extends com.vaadin.flow.component.Component> viewClass, Icon icon) {
        RouterLink link = new RouterLink();
        link.addClassNames(Display.FLEX, AlignItems.CENTER, Padding.Horizontal.MEDIUM,
                          Padding.Vertical.SMALL, TextColor.BODY);
        link.setRoute(viewClass);

        Span linkText = new Span();
        linkText.add(icon, new Span(text));
        linkText.addClassNames(Display.FLEX, AlignItems.CENTER, FontWeight.MEDIUM,
                              FontSize.MEDIUM, Whitespace.NOWRAP);

        link.add(linkText);
        return new ListItem(link);
    }

    private Footer createFooter() {
        Footer layout = new Footer();

        // Показуємо інформацію про користувача, якщо він авторизований
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
            && !"anonymousUser".equals(authentication.getName())) {

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Avatar avatar = new Avatar(userDetails.getUsername());

            MenuBar userMenu = new MenuBar();
            MenuItem userMenuItem = userMenu.addItem(
                new Div(avatar, new Span(userDetails.getUsername()))
            );
            userMenuItem.getSubMenu().addItem("Вийти", e -> logout());

            layout.add(userMenu);
        }

        return layout;
    }

    private void logout() {
        getUI().ifPresent(ui -> ui.getPage().setLocation("/logout"));
    }

    @Override
    protected void afterNavigation() {
        super.afterNavigation();
        viewTitle.setText(getCurrentPageTitle());
    }

    private String getCurrentPageTitle() {
        PageTitle title = getContent().getClass().getAnnotation(PageTitle.class);
        return title == null ? "" : title.value();
    }
}
