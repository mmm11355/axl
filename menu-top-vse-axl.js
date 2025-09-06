(function () {
    const MENU_SELECTOR_DESKTOP = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
    const MOBILE_DRAWER_SELECTOR = '.ant-drawer';
    const MOBILE_MENU_SELECTOR = '.ant-menu.ant-menu-vertical';

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

    let isDesktopMenuInitialized = false;
    let isMobileMenuInitialized = false;

    function syncMenus() {
        if (!isDesktopMenuInitialized) {
            const desktopMenu = document.querySelector(MENU_SELECTOR_DESKTOP);
            if (desktopMenu) {
                while (desktopMenu.firstChild) {
                    desktopMenu.removeChild(desktopMenu.firstChild);
                }
                menuItems.forEach(item => {
                    desktopMenu.appendChild(createMenuItem(item));
                });
                isDesktopMenuInitialized = true;
            }
        }
    
        if (!isMobileMenuInitialized) {
            const mobileMenu = document.querySelector(MOBILE_MENU_SELECTOR);
            if (mobileMenu) {
                while (mobileMenu.firstChild) {
                    mobileMenu.removeChild(mobileMenu.firstChild);
                }
                menuItems.forEach(item => {
                    mobileMenu.appendChild(createMenuItem(item));
                });
                isMobileMenuInitialized = true;
            }
        }
    }

    function boot() {
        const observer = new MutationObserver(() => {
            syncMenus();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        boot();
    } else {
        document.addEventListener('DOMContentLoaded', boot);
    }

    // Встроенные CSS-стили
    const style = document.createElement('style');
    style.textContent = `
        .ant-menu-item .ant-menu-title-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ant-menu-item .ant-menu-title-content .fa-icon {
            color: #000;
        }
        @media (min-width: 1100px) and (max-width: 1600px) {
            .ant-menu-item .ant-menu-title-content .menu-item-text {
                display: none !important;
            }
            .ant-menu-item .ant-menu-title-content {
                min-width: 50px;
                justify-content: center;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
        }
    `;
    document.head.appendChild(style);

})();
