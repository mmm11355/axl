(function () {
    const MENU_SELECTOR_DESKTOP = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
    const MOBILE_MENU_SELECTOR = '.ant-drawer .ant-menu.ant-menu-vertical';

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
        text: 'Профиль',
        iconClass: faIcons.profile,
        onClick: () => document.querySelector('[data-profile-button], [aria-label="Профиль"], .open-profile, header .ant-avatar').click()
    }, {
        text: 'Уведомления',
        iconClass: faIcons.notifications,
        onClick: () => document.querySelector('[data-notifications-button], [aria-label="Уведомления"], .open-notifications, header .anticon-bell').click()
    }, {
        text: 'Курсы и материалы',
        href: '/courses',
        iconClass: faIcons.courses
    }, {
        text: 'Достижения',
        href: GAMIFICATION_URL,
        iconClass: faIcons.achievements
    }, {
        text: 'Доступы и оплаты',
        href: '/access',
        iconClass: faIcons.access
    }, {
        text: 'Партнерская программа',
        href: '/partnership',
        iconClass: faIcons.partnership
    }, {
        text: 'Телеграм',
        href: TG_URL,
        iconClass: faIcons.telegram
    }, {
        text: 'Новости',
        href: NEWS_URL,
        iconClass: faIcons.news
    }, {
        text: 'Техподдержка',
        iconClass: faIcons.support,
        onClick: () => document.querySelector('button.ant-btn-circle, [data-test-id="floating-chat-button"], [data-open-chat]').click()
    }];

    function enhanceMenu(menu) {
        if (!menu || menu.dataset.enhanced) {
            return;
        }

        const items = menu.querySelectorAll('.ant-menu-item');
        items.forEach(item => {
            const link = item.querySelector('a');
            const textContent = item.textContent.trim();
            
            const matchingItem = menuItems.find(mi => textContent.includes(mi.text));

            if (matchingItem) {
                if (link && matchingItem.href) {
                    link.href = matchingItem.href;
                }
                if (matchingItem.onClick) {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        matchingItem.onClick();
                    });
                }
                
                let iconElement = item.querySelector('.fa-icon');
                if (!iconElement) {
                    iconElement = document.createElement('i');
                    iconElement.className = `fa-icon ${matchingItem.iconClass}`;
                    const titleContent = item.querySelector('.ant-menu-title-content');
                    if (titleContent) {
                        titleContent.prepend(iconElement);
                    }
                }
            }
        });

        menu.dataset.enhanced = 'true';
    }

    function checkMenus() {
        const desktopMenu = document.querySelector(MENU_SELECTOR_DESKTOP);
        if (desktopMenu) {
            enhanceMenu(desktopMenu);
        }

        const mobileMenu = document.querySelector(MOBILE_MENU_SELECTOR);
        if (mobileMenu) {
            enhanceMenu(mobileMenu);
        }
    }

    function boot() {
        checkMenus();
        const observer = new MutationObserver(checkMenus);
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        boot();
    } else {
        document.addEventListener('DOMContentLoaded', boot);
    }
})();
