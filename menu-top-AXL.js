(function () {
  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
  const TG_URL = 'https://t.me/vashgc'; // <-- замените
  const NEWS_URL = 'https://antolblog.accelsite.io/home'; // <-- замените

  function q(sel, root = document) {
    return root.querySelector(sel);
  }

  function qa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function findMenu() {
    return q(MENU_SELECTOR);
  }

  function findFirstMenuItem(menu) {
    return menu.querySelector('li.ant-menu-item') || null;
  }

  function makeMenuItem({
    text,
    href,
    id,
    onClick
  }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.dataset.injected = id;
    li.dataset.menuId = "custom-" + id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = href || '#';
    a.className = 'custom-link';
    if (/^https?:\/\//i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = text;
    if (onClick) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function insertIntoMainMenu() {
    const menu = findMenu();
    if (!menu) return false;

    const existsProfile = menu.querySelector('li[data-injected="profile"]');
    const existsNotifications = menu.querySelector('li[data-injected="notifications"]');
    const existsAchievements = menu.querySelector('li[data-injected="achievements"]');
    const existsTg = menu.querySelector('li[data-injected="telegram"]');
    const existsNews = menu.querySelector('li[data-injected="news"]');

    if (existsProfile && existsNotifications && existsAchievements && existsTg && existsNews) return true;

    const pivot = findFirstMenuItem(menu);
    if (!pivot) return false;

    // Новые кнопки
    const profile = existsProfile || makeMenuItem({
      text: 'Профиль',
      id: 'profile',
      onClick: () => {
        const modal = document.querySelector('.ant-modal-root');
        if (modal) modal.style.display = 'block'; // Управление видимостью
      }
    });

    const notifications = existsNotifications || makeMenuItem({
      text: 'Уведомления',
      id: 'notifications',
      onClick: () => {
        const drawer = document.querySelector('.ant-drawer.ant-drawer-right.p-0.m-0.no-header');
        if (drawer) drawer.classList.add('ant-drawer-open'); // Добавление класса для открытия
      }
    });

    const achievements = existsAchievements || makeMenuItem({
      text: 'Достижения',
      href: '/gamification',
      id: 'achievements'
    });

    // Существующие кнопки
    const tg = existsTg || makeMenuItem({
      text: 'Канал Телеграм',
      href: TG_URL,
      id: 'telegram'
    });
    const news = existsNews || makeMenuItem({
      text: 'Наш Блог',
      href: NEWS_URL,
      id: 'news'
    });

    if (!existsProfile) pivot.insertAdjacentElement('beforebegin', profile);
    if (!existsNotifications) profile.insertAdjacentElement('afterend', notifications);
    if (!existsAchievements) notifications.insertAdjacentElement('afterend', achievements);
    if (!existsTg) achievements.insertAdjacentElement('afterend', tg);
    if (!existsNews) tg.insertAdjacentElement('afterend', news);

    return true;
  }

  function insertIntoRestMenu() {
    // попап, который Ant рисует при переполнении
    const popup = document.querySelector('.ant-menu-submenu-popup ul.ant-menu');
    if (!popup) return;

    const existsProfile = popup.querySelector('li[data-injected="profile-rest"]');
    const existsNotifications = popup.querySelector('li[data-injected="notifications-rest"]');
    const existsAchievements = popup.querySelector('li[data-injected="achievements-rest"]');
    const existsTg = popup.querySelector('li[data-injected="telegram-rest"]');
    const existsNews = popup.querySelector('li[data-injected="news-rest"]');

    if (!existsProfile) {
      const profile = makeMenuItem({
        text: 'Профиль',
        id: 'profile-rest',
        onClick: () => {
          const modal = document.querySelector('.ant-modal-root');
          if (modal) modal.style.display = 'block';
        }
      });
      popup.insertBefore(profile, popup.firstChild);
    }
    if (!existsNotifications) {
      const notifications = makeMenuItem({
        text: 'Уведомления',
        id: 'notifications-rest',
        onClick: () => {
          const drawer = document.querySelector('.ant-drawer.ant-drawer-right.p-0.m-0.no-header');
          if (drawer) drawer.classList.add('ant-drawer-open');
        }
      });
      const afterEl = popup.querySelector('li[data-injected="profile-rest"]') || popup.firstChild;
      afterEl.insertAdjacentElement('afterend', notifications);
    }
    if (!existsAchievements) {
      const achievements = makeMenuItem({
        text: 'Достижения',
        href: '/gamification',
        id: 'achievements-rest'
      });
      const afterEl = popup.querySelector('li[data-injected="notifications-rest"]') || popup.querySelector('li[data-injected="profile-rest"]') || popup.firstChild;
      afterEl.insertAdjacentElement('afterend', achievements);
    }
    if (!existsTg) {
      const tg = makeMenuItem({
        text: 'Телеграм',
        href: TG_URL,
        id: 'telegram-rest'
      });
      popup.appendChild(tg);
    }
    if (!existsNews) {
      const news = makeMenuItem({
        text: 'Наши новости',
        href: NEWS_URL,
        id: 'news-rest'
      });
      popup.appendChild(news);
    }
  }

  function boot() {
    // Основное меню
    if (!insertIntoMainMenu()) {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (insertIntoMainMenu() || tries >= 60) clearInterval(timer);
      }, 250);
    }

    // Отслеживание мутаций
    const header = q('header.ant-layout-header') || document.body;
    const mo = new MutationObserver(() => {
      insertIntoMainMenu();
      insertIntoRestMenu();
    });
    mo.observe(header, {
      childList: true,
      subtree: true
    });

    // Отдельный наблюдатель для попапа троеточия
    const bodyMo = new MutationObserver(() => {
      insertIntoRestMenu();
    });
    bodyMo.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();

// Скрипт для мобильного меню
(function () {
  const TG_URL = 'https://t.me/vashgc'; // замените на ваш канал
  const NEWS_URL = 'https://antolblog.accelsite.io/home'; // замените на страницу новостей

  function makeMenuItem({
    text,
    href,
    id,
    onClick
  }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.tabIndex = -1;
    li.dataset.injected = id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = href || '#';
    a.className = 'custom-link';
    if (/^https?:\/\//i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = text;
    if (onClick) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    }

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function findFirstMenuItem(menu) {
    return menu.querySelector('li.ant-menu-item') || null;
  }

  function insertIntoMobileMenu() {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open');
    if (!drawer) return false;

    const menu = drawer.querySelector('ul.ant-menu-vertical');
    if (!menu) return false;

    const pivot = findFirstMenuItem(menu);
    if (!pivot) return false;

    // Новые кнопки
    if (!menu.querySelector('li[data-injected="profile-mobile"]')) {
      const profile = makeMenuItem({
        text: 'Профиль',
        id: 'profile-mobile',
        onClick: () => {
          const modal = document.querySelector('.ant-modal-root');
          if (modal) modal.style.display = 'block';
        }
      });
      pivot.insertAdjacentElement('beforebegin', profile);
    }
    if (!menu.querySelector('li[data-injected="notifications-mobile"]')) {
      const notifications = makeMenuItem({
        text: 'Уведомления',
        id: 'notifications-mobile',
        onClick: () => {
          const drawer = document.querySelector('.ant-drawer.ant-drawer-right.p-0.m-0.no-header');
          if (drawer) drawer.classList.add('ant-drawer-open');
        }
      });
      const afterEl = menu.querySelector('li[data-injected="profile-mobile"]') || pivot;
      afterEl.insertAdjacentElement('afterend', notifications);
    }
    if (!menu.querySelector('li[data-injected="achievements-mobile"]')) {
      const achievements = makeMenuItem({
        text: 'Достижения',
        href: '/gamification',
        id: 'achievements-mobile'
      });
      const afterEl = menu.querySelector('li[data-injected="notifications-mobile"]') || menu.querySelector('li[data-injected="profile-mobile"]') || pivot;
      afterEl.insertAdjacentElement('afterend', achievements);
    }

    // Существующие кнопки
    if (!menu.querySelector('li[data-injected="telegram-mobile"]')) {
      const tg = makeMenuItem({
        text: 'Телеграм',
        href: TG_URL,
        id: 'telegram-mobile'
      });
      const afterEl = menu.querySelector('li[data-injected="achievements-mobile"]') || menu.querySelector('li[data-injected="notifications-mobile"]') || menu.querySelector('li[data-injected="profile-mobile"]') || pivot;
      afterEl.insertAdjacentElement('afterend', tg);
    }
    if (!menu.querySelector('li[data-injected="news-mobile"]')) {
      const news = makeMenuItem({
        text: 'Наши новости',
        href: NEWS_URL,
        id: 'news-mobile'
      });
      const afterEl = menu.querySelector('li[data-injected="telegram-mobile"]') || menu.querySelector('li[data-injected="achievements-mobile"]') || menu.querySelector('li[data-injected="notifications-mobile"]') || menu.querySelector('li[data-injected="profile-mobile"]') || pivot;
      afterEl.insertAdjacentElement('afterend', news);
    }

    return true;
  }

  // Следим за открытием/закрытием drawer
  const observer = new MutationObserver(() => {
    insertIntoMobileMenu();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
