(function () {
    const MENU_SELECTOR_DESKTOP = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
    const MOBILE_MENU_SELECTOR = '.ant-drawer.ant-drawer-open .ant-menu.ant-menu-vertical';
    const MOBILE_DRAWER_OPEN_CLASS = 'ant-drawer-open';

    const TG_URL = 'https://t.me/vashgc';
    const NEWS_URL = 'https://antolblog.accelsite.io/home';
    const GAMIFICATION_URL = '/gamification';

    const faIcons = {
        profile: 'fa-solid fa-user',
        notifications: 'fa-solid fa-bell',
        courses: 'fa-solid fa-book',
        achievements: 'fa-solid fa-trophy',
        access: 'fa-solid fa-lock',
        partnership: 'fa-solid fa-handshake',
        telegram: 'fa-brands fa-telegram',
        news: 'fa-solid fa-newspaper',
        support: 'fa-solid fa-circle-question'
    };

    const menuItems = [{
        id: 'profile',
        text: 'Профиль',
        href: '#',
        iconClass: faIcons.profile,
        onClick: () => document.querySelector('[data-profile-button], [aria-label="Профиль"], .open-profile, header .ant-avatar').click()
    }, {
        id: 'notifications',
        text: 'Уведомления',
        href: '#',
        iconClass: faIcons.notifications,
        onClick: () => document.querySelector('[data-notifications-button], [aria-label="Уведомления"], .open-notifications, header .anticon-bell').click()
    }, {
        id: 'courses',
        text: 'Курсы и материалы',
        href: '/courses',
        iconClass: faIcons.courses
    }, {
        id: 'achievements',
        text: 'Достижения',
        href: GAMIFICATION_URL,
        iconClass: faIcons.achievements
    }, {
        id: 'access',
        text: 'Доступы и оплаты',
        href: '/access',
        iconClass: faIcons.access
    }, {
        id: 'partnership',
        text: 'Партнерская программа',
        href: '/partnership',
        iconClass: faIcons.partnership
    }, {
        id: 'telegram',
        text: 'Телеграм',
        href: TG_URL,
        iconClass: faIcons.telegram
    }, {
        id: 'news',
        text: 'Новости',
        href: NEWS_URL,
        iconClass: faIcons.news
    }, {
        id: 'support',
        text: 'Техподдержка',
        href: '#',
        iconClass: faIcons.support,
        onClick: () => document.querySelector('button.ant-btn-circle, [data-test-id="floating-chat-button"], [data-open-chat]').click()
    }];

    function createMenuItem(itemConfig) {
        const li = document.createElement('li');
        li.className = `ant-menu-item custom-menu-item custom-menu-item-${itemConfig.id}`;
        li.setAttribute('role', 'menuitem');
        li.dataset.injected = itemConfig.id;

        const link = document.createElement('a');
        link.href = itemConfig.href;
        link.className = 'custom-link';
        if (itemConfig.href && itemConfig.href.startsWith('http')) {
            link.target = '_blank';
            link.rel = 'noopener';
        }
        if (itemConfig.onClick) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                itemConfig.onClick();
            });
        }

        const span = document.createElement('span');
        span.className = 'ant-menu-title-content';

        const icon = document.createElement('i');
        icon.className = `fa-icon ${itemConfig.iconClass}`;
        span.appendChild(icon);

        const textNode = document.createElement('span');
        textNode.className = 'menu-item-text';
        textNode.textContent = itemConfig.text;
        span.appendChild(document.createTextNode('\u00A0\u00A0'));
        span.appendChild(textNode);

        link.appendChild(span);
        li.appendChild(link);
        return li;
    }

    function isMenuInitialized(menu) {
        return menu.dataset.synced === 'true';
    }

    function syncMenu(menu) {
        if (!menu || isMenuInitialized(menu)) {
            return;
        }

        // Удаляем старые, добавленные скриптом элементы
        Array.from(menu.querySelectorAll('li[data-injected]')).forEach(el => el.remove());

        const fragment = document.createDocumentFragment();
        const existingItems = Array.from(menu.querySelectorAll('li.ant-menu-item'));

        menuItems.forEach(itemConfig => {
            const existing = existingItems.find(el => el.textContent.trim().includes(itemConfig.text));
            if (existing) {
                const span = existing.querySelector('.ant-menu-title-content');
                if (span && !span.querySelector('.fa-icon')) {
                    const icon = document.createElement('i');
                    icon.className = `fa-icon ${itemConfig.iconClass}`;
                    span.insertAdjacentElement('afterbegin', icon);
                }
                fragment.appendChild(existing);
            } else {
                fragment.appendChild(createMenuItem(itemConfig));
            }
        });

        // Заменяем все элементы в меню
        while (menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
        menu.appendChild(fragment);
        menu.dataset.synced = 'true';
    }

    function setupObservers() {
        // Observer для десктопного меню
        const desktopMenuObserver = new MutationObserver((mutationsList, observer) => {
            const desktopMenu = document.querySelector(MENU_SELECTOR_DESKTOP);
            if (desktopMenu && !isMenuInitialized(desktopMenu)) {
                syncMenu(desktopMenu);
            }
        });
        desktopMenuObserver.observe(document.body, { childList: true, subtree: true });

        // Observer для мобильного меню
        const mobileMenuObserver = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains(MOBILE_DRAWER_OPEN_CLASS)) {
                    const mobileMenu = document.querySelector(MOBILE_MENU_SELECTOR);
                    if (mobileMenu && !isMenuInitialized(mobileMenu)) {
                        syncMenu(mobileMenu);
                    }
                }
            });
        });
        const mobileDrawer = document.querySelector('.ant-drawer');
        if (mobileDrawer) {
            mobileMenuObserver.observe(mobileDrawer, { attributes: true });
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setupObservers();
    } else {
        document.addEventListener('DOMContentLoaded', setupObservers);
    }
})();
