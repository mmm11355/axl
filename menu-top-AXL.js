(function () {

  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';

  const TG_URL = 'https://t.me/vashgc';   // <-- замените
  const NEWS_URL = 'https://antolblog.accelsite.io/home';                    // <-- замените

  function q(sel, root = document) { return root.querySelector(sel); }
  function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function findMenu() {
    return q(MENU_SELECTOR);
  }

  function findPartnershipItem(menu) {
    let li = menu.querySelector('li[data-menu-id$="/partnership"]');
    if (li) return li;
    return qa('li.ant-menu-item', menu).find(
      (x) => x.textContent.replace(/\s+/g, ' ').trim().includes('Партнерская программа')
    ) || null;
  }

  function makeMenuItem({ text, href, id }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.dataset.injected = id;
    li.dataset.menuId = "custom-" + id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = href;
    a.className = 'custom-link';
    if (/^https?:\/\//i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = text;

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function makeActionItem({ text, id, onClick }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.dataset.injected = id;
    li.dataset.menuId = "custom-" + id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'custom-link';
    a.textContent = text;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { onClick && onClick(); } catch (err) { /* no-op */ }
    });

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  // UI helpers: Профиль (модалка) и Уведомления (дровер)
  function ensureProfileModal() {
    let root = q('.ant-modal-root[data-injected="profile-modal"]');
    if (root) return root;

    root = document.createElement('div');
    root.className = 'ant-modal-root';
    root.dataset.injected = 'profile-modal';

    const mask = document.createElement('div');
    mask.className = 'ant-modal-mask';
    const wrap = document.createElement('div');
    wrap.className = 'ant-modal-wrap';
    const modal = document.createElement('div');
    modal.className = 'ant-modal';

    const content = document.createElement('div');
    content.className = 'ant-modal-content';
    const header = document.createElement('div');
    header.className = 'ant-modal-header';
    const title = document.createElement('div');
    title.className = 'ant-modal-title';
    title.textContent = 'Профиль';
    const close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.className = 'ant-modal-close';
    close.textContent = '×';

    const body = document.createElement('div');
    body.className = 'ant-modal-body';
    body.textContent = 'Здесь могла бы быть информация профиля.';

    close.addEventListener('click', () => { root.remove(); });
    mask.addEventListener('click', () => { root.remove(); });

    header.appendChild(title);
    content.appendChild(close);
    content.appendChild(header);
    content.appendChild(body);
    modal.appendChild(content);
    wrap.appendChild(modal);
    root.appendChild(mask);
    root.appendChild(wrap);

    document.body.appendChild(root);
    return root;
  }

  function openProfileModal() {
    ensureProfileModal();
  }

  function ensureNotificationsDrawer() {
    let drawer = q('.ant-drawer.ant-drawer-right.p-0.m-0.no-header[data-injected="notifications-drawer"]');
    if (drawer) return drawer;

    drawer = document.createElement('div');
    drawer.className = 'ant-drawer ant-drawer-right p-0 m-0 no-header';
    drawer.dataset.injected = 'notifications-drawer';

    const mask = document.createElement('div');
    mask.className = 'ant-drawer-mask';

    const wrapper = document.createElement('div');
    wrapper.className = 'ant-drawer-content-wrapper';

    const content = document.createElement('div');
    content.className = 'ant-drawer-content';

    const body = document.createElement('div');
    body.className = 'ant-drawer-body';
    body.textContent = 'Здесь могли бы быть уведомления.';

    const close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.className = 'ant-drawer-close';
    close.textContent = 'Закрыть';

    close.addEventListener('click', () => {
      drawer.classList.remove('ant-drawer-open');
      setTimeout(() => drawer.remove(), 200);
    });
    mask.addEventListener('click', () => {
      drawer.classList.remove('ant-drawer-open');
      setTimeout(() => drawer.remove(), 200);
    });

    content.appendChild(close);
    content.appendChild(body);
    wrapper.appendChild(content);
    drawer.appendChild(mask);
    drawer.appendChild(wrapper);

    document.body.appendChild(drawer);
    return drawer;
  }

  function openNotificationsDrawer() {
    const drawer = ensureNotificationsDrawer();
    drawer.classList.add('ant-drawer-open');
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

    const pivot = findPartnershipItem(menu);
    if (!pivot) return false;

    const profile = existsProfile || makeActionItem({ text: 'Профиль', id: 'profile', onClick: openProfileModal });
    const notifications = existsNotifications || makeActionItem({ text: 'Уведомления', id: 'notifications', onClick: openNotificationsDrawer });
    const achievements = existsAchievements || makeMenuItem({ text: 'Достижения', href: '/gamification', id: 'achievements' });

    const tg = existsTg || makeMenuItem({ text: 'Канал Телеграм', href: TG_URL, id: 'telegram' });
    const news = existsNews || makeMenuItem({ text: 'Наш Блог', href: NEWS_URL, id: 'news' });

    if (!existsProfile) pivot.insertAdjacentElement('afterend', profile);
    const afterProfile = menu.querySelector('li[data-injected="profile"]') || pivot;

    if (!existsNotifications) afterProfile.insertAdjacentElement('afterend', notifications);
    const afterNotifications = menu.querySelector('li[data-injected="notifications"]') || afterProfile;

    if (!existsAchievements) afterNotifications.insertAdjacentElement('afterend', achievements);
    const afterAchievements = menu.querySelector('li[data-injected="achievements"]') || afterNotifications;

    if (!existsTg) afterAchievements.insertAdjacentElement('afterend', tg);
    if (!existsNews) (menu.querySelector('li[data-injected="telegram"]') || afterAchievements).insertAdjacentElement('afterend', news);

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
      const profile = makeActionItem({ text: 'Профиль', id: 'profile-rest', onClick: openProfileModal });
      popup.appendChild(profile);
    }
    if (!existsNotifications) {
      const notifications = makeActionItem({ text: 'Уведомления', id: 'notifications-rest', onClick: openNotificationsDrawer });
      popup.appendChild(notifications);
    }
    if (!existsAchievements) {
      const achievements = makeMenuItem({ text: 'Достижения', href: '/gamification', id: 'achievements-rest' });
      popup.appendChild(achievements);
    }
    if (!existsTg) {
      const tg = makeMenuItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-rest' });
      popup.appendChild(tg);
    }
    if (!existsNews) {
      const news = makeMenuItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-rest' });
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
    mo.observe(header, { childList: true, subtree: true });

    // Отдельный наблюдатель для попапа троеточия
    const bodyMo = new MutationObserver(() => {
      insertIntoRestMenu();
    });
    bodyMo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();

(function () {

  const TG_URL = 'https://t.me/vashgc';  // замените на ваш канал
  const NEWS_URL = 'https://antolblog.accelsite.io/home';                    // замените на страницу новостей

  function makeMenuItem({ text, href, id }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.tabIndex = -1;
    li.dataset.injected = id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = href;
    a.className = 'custom-link';
    if (/^https?:\/\//i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.textContent = text;

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function makeActionItem({ text, id, onClick }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.tabIndex = -1;
    li.dataset.injected = id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'custom-link';
    a.textContent = text;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      try { onClick && onClick(); } catch (err) { /* no-op */ }
    });

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  // Простые дубликаты хелперов для мобильной части
  function ensureProfileModal() {
    let root = document.querySelector('.ant-modal-root[data-injected="profile-modal"]');
    if (root) return root;
    root = document.createElement('div');
    root.className = 'ant-modal-root';
    root.dataset.injected = 'profile-modal';

    const mask = document.createElement('div'); mask.className = 'ant-modal-mask';
    const wrap = document.createElement('div'); wrap.className = 'ant-modal-wrap';
    const modal = document.createElement('div'); modal.className = 'ant-modal';
    const content = document.createElement('div'); content.className = 'ant-modal-content';
    const header = document.createElement('div'); header.className = 'ant-modal-header';
    const title = document.createElement('div'); title.className = 'ant-modal-title'; title.textContent = 'Профиль';
    const close = document.createElement('button'); close.type = 'button'; close.className = 'ant-modal-close'; close.textContent = '×';
    const body = document.createElement('div'); body.className = 'ant-modal-body'; body.textContent = 'Здесь могла бы быть информация профиля.';

    close.addEventListener('click', () => { root.remove(); });
    mask.addEventListener('click', () => { root.remove(); });

    header.appendChild(title);
    content.appendChild(close);
    content.appendChild(header);
    content.appendChild(body);
    modal.appendChild(content);
    wrap.appendChild(modal);
    root.appendChild(mask);
    root.appendChild(wrap);
    document.body.appendChild(root);
    return root;
  }

  function openProfileModal() { ensureProfileModal(); }

  function ensureNotificationsDrawer() {
    let drawer = document.querySelector('.ant-drawer.ant-drawer-right.p-0.m-0.no-header[data-injected="notifications-drawer"]');
    if (drawer) return drawer;

    drawer = document.createElement('div');
    drawer.className = 'ant-drawer ant-drawer-right p-0 m-0 no-header';
    drawer.dataset.injected = 'notifications-drawer';

    const mask = document.createElement('div'); mask.className = 'ant-drawer-mask';
    const wrapper = document.createElement('div'); wrapper.className = 'ant-drawer-content-wrapper';
    const content = document.createElement('div'); content.className = 'ant-drawer-content';
    const body = document.createElement('div'); body.className = 'ant-drawer-body'; body.textContent = 'Здесь могли бы быть уведомления.';
    const close = document.createElement('button'); close.type = 'button'; close.className = 'ant-drawer-close'; close.textContent = 'Закрыть';

    close.addEventListener('click', () => {
      drawer.classList.remove('ant-drawer-open');
      setTimeout(() => drawer.remove(), 200);
    });
    mask.addEventListener('click', () => {
      drawer.classList.remove('ant-drawer-open');
      setTimeout(() => drawer.remove(), 200);
    });

    content.appendChild(close);
    content.appendChild(body);
    wrapper.appendChild(content);
    drawer.appendChild(mask);
    drawer.appendChild(wrapper);
    document.body.appendChild(drawer);
    return drawer;
  }

  function openNotificationsDrawer() {
    const drawer = ensureNotificationsDrawer();
    drawer.classList.add('ant-drawer-open');
  }

  function insertIntoMobileMenu() {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open');
    if (!drawer) return false;

    const menu = drawer.querySelector('ul.ant-menu-vertical');
    if (!menu) return false;

    const partnership = menu.querySelector('li[data-menu-id$="/partnership"]');
    if (!partnership) return false;

    // Профиль, Уведомления, Достижения — перед Телеграм/Новости
    if (!menu.querySelector('li[data-injected="profile-mobile"]')) {
      const profile = makeActionItem({ text: 'Профиль', id: 'profile-mobile', onClick: openProfileModal });
      partnership.insertAdjacentElement('afterend', profile);
    }
    const afterProfile = menu.querySelector('li[data-injected="profile-mobile"]') || partnership;

    if (!menu.querySelector('li[data-injected="notifications-mobile"]')) {
      const notifications = makeActionItem({ text: 'Уведомления', id: 'notifications-mobile', onClick: openNotificationsDrawer });
      afterProfile.insertAdjacentElement('afterend', notifications);
    }
    const afterNotifications = menu.querySelector('li[data-injected="notifications-mobile"]') || afterProfile;

    if (!menu.querySelector('li[data-injected="achievements-mobile"]')) {
      const achievements = makeMenuItem({ text: 'Достижения', href: '/gamification', id: 'achievements-mobile' });
      afterNotifications.insertAdjacentElement('afterend', achievements);
    }
    const afterAchievements = menu.querySelector('li[data-injected="achievements-mobile"]') || afterNotifications;

    if (!menu.querySelector('li[data-injected="telegram-mobile"]')) {
      const tg = makeMenuItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-mobile' });
      afterAchievements.insertAdjacentElement('afterend', tg);
    }
    if (!menu.querySelector('li[data-injected="news-mobile"]')) {
      const news = makeMenuItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-mobile' });
      const afterEl = menu.querySelector('li[data-injected="telegram-mobile"]') || afterAchievements;
      afterEl.insertAdjacentElement('afterend', news);
    }

    return true;
  }

  // Следим за открытием/закрытием drawer
  const observer = new MutationObserver(() => {
    insertIntoMobileMenu();
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
