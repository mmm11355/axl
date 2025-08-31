(function () {
  // ====== Конфиг ======
  const MENU_SELECTOR_DESKTOP = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
  const OVERFLOW_POPUP_SELECTOR = '.ant-menu-submenu-popup ul.ant-menu';
  const MOBILE_DRAWER_SELECTOR = '.ant-drawer.ant-drawer-open';
  const MOBILE_MENU_SELECTOR = 'ul.ant-menu, ul.ant-menu-vertical';
  const TG_URL = 'https://t.me/vashgc';
  const NEWS_URL = 'https://antolblog.accelsite.io/home';
  const GAMIFICATION_URL = '/gamification';

  // ====== Утилиты ======
  const q  = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const click = (el) => el && el.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true,view:window}));

  const firstNativeItem = (menu) => menu.querySelector('li.ant-menu-item:not([data-injected])');
  const ensureOnce = (container, id) => container && !container.querySelector(`li[data-injected="${id}"]`);

  function makeLinkItem({ text, href, id }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.dataset.injected = id;
    li.dataset.menuId = 'custom-' + id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.className = 'custom-link';
    a.href = href;
    if (/^https?:\/\//i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    a.textContent = text;

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function makeActionItem({ text, id, handler }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.setAttribute('role', 'menuitem');
    li.dataset.injected = id;
    li.dataset.menuId = 'custom-' + id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'custom-link';
    a.textContent = text;
    a.addEventListener('click', (e) => { e.preventDefault(); handler && handler(); });

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  // Попытка аккуратно открыть/закрыть через реальные триггеры
  function toggleProfile() {
    const openModal = q('.ant-modal-root .ant-modal-wrap[aria-hidden="false"], .ant-modal-root .ant-modal-wrap:not([aria-hidden])');
    if (openModal && q('.ant-modal-close', openModal)) { click(q('.ant-modal-close', openModal)); return; }

    const triggers = [
      '[data-profile-button]',
      '[aria-label="Профиль"]',
      '.open-profile',
      'header .ant-avatar',
      'header .header-profile',
      'header .ant-dropdown-trigger .ant-avatar'
    ];
    for (const sel of triggers) { const el = q(sel); if (el) { click(el); return; } }

    const root = q('.ant-modal-root');
    if (root) {
      const wrap = q('.ant-modal-wrap', root);
      if (wrap) { wrap.style.display = 'block'; document.body.classList.add('ant-scrolling-effect'); }
    }
  }

  function toggleNotifications() {
    const openDrawer = q('.ant-drawer.ant-drawer-right.p-0.m-0.no-header.ant-drawer-open, .ant-drawer.ant-drawer-right.ant-drawer-open');
    if (openDrawer) { const closeBtn = q('.ant-drawer-close', openDrawer); if (closeBtn) click(closeBtn); else openDrawer.classList.remove('ant-drawer-open'); return; }

    const triggers = [
      '[data-notifications-button]',
      '[aria-label="Уведомления"]',
      '[aria-label="notifications"]',
      '.open-notifications',
      'header .anticon-bell',
      'header [class*="bell"]',
      'header .notification-button'
    ];
    for (const sel of triggers) { const el = q(sel); if (el) { click(el); return; } }

    const targetDrawer = q('.ant-drawer.ant-drawer-right.p-0.m-0.no-header');
    if (targetDrawer) targetDrawer.classList.add('ant-drawer-open');
  }

  // Открыть/показать чат техподдержки
  function openSupport() {
    // если чат уже открыт — закроем/переключим (если есть кнопка закрытия)
    const chatRoot = q('.fixed.shadow-lg.overflow-hidden.border.f-chat-wrapper._chat_floating_1ovvy_1');
    if (chatRoot) {
      // если есть явный триггер открытия — кликнем по нему
      const triggers = [
        '[data-open-chat]',
        '.f-chat-trigger',
        '.open-chat',
        '.chat-toggle',
        '.f-chat-wrapper .open' // запасной селектор
      ];
      for (const sel of triggers) { const el = q(sel); if (el) { click(el); return; } }

      // иначе просто покажем контейнер
      chatRoot.style.display = 'block';
      chatRoot.classList.add('open');
      return;
    }

    // если нет самого контейнера — попробуем кликнуть по возможному глобальному триггеру
    const globalTriggers = ['[data-open-chat]', '.f-chat-trigger', '.open-chat', '.chat-toggle'];
    for (const sel of globalTriggers) { const el = q(sel); if (el) { click(el); return; } }
  }

  // Вставка элементов ПЕРЕД первым нативным элементом
  function insertBeforeFirst(menu, items) {
    const pivot = firstNativeItem(menu) || menu.firstElementChild;
    items.slice().reverse().forEach((li) => { if (li) menu.insertBefore(li, pivot || null); });
  }

  function findPartnershipItem(menu) {
    let li = menu.querySelector('li[data-menu-id$="/partnership"]');
    if (li) return li;
    return qa('li.ant-menu-item', menu).find((x) =>
      x.textContent.replace(/\s+/g, ' ').trim().includes('Партнерская программа')
    ) || null;
  }

  // ====== Вставки в разные контейнеры (обновлены под нужный порядок) ======
  function injectDesktopMain() {
    const menu = q(MENU_SELECTOR_DESKTOP);
    if (!menu) return false;

    // убираем ранее вставленные элементы, чтобы избежать дублей
    qa('li[data-injected]', menu).forEach(el => el.remove());

    // создаём элементы (в порядке, который нужен)
    const liProfile = makeActionItem({ text: 'Профиль', id: 'profile', handler: toggleProfile });
    const liNotifications = makeActionItem({ text: 'Уведомления', id: 'notifications', handler: toggleNotifications });
    const liCourses = makeLinkItem({ text: 'Курсы и материалы', href: '/courses', id: 'courses' });
    const liPayments = makeLinkItem({ text: 'Доступы и оплаты', href: '/payments', id: 'payments' });

    // partnership: если нативный есть — не создаём дубль; иначе создаём
    const nativePart = findPartnershipItem(menu);
    const liPartnership = nativePart ? null : makeLinkItem({ text: 'Партнерская программа', href: '/partnership', id: 'partnership' });

    const liTelegram = makeLinkItem({ text: 'Канал Телеграм', href: TG_URL, id: 'telegram' });
    const liNews = makeLinkItem({ text: 'Наши новости', href: NEWS_URL, id: 'news' });
    const liSupport = makeActionItem({ text: 'Техподдержка', id: 'support', handler: openSupport });

    // если есть нативный элемент "Партнёрская программа" — вставим первые 4 пункта перед ним,
    // а затем добавим TG / News / Support сразу после нативной партнёрки
    if (nativePart) {
      const parent = nativePart.parentNode;
      // вставляем profile..payments перед nativePart
      [liPayments, liCourses, liNotifications, liProfile].forEach(li => { parent.insertBefore(li, nativePart); });
      // вставляем telegram, news, support после nativePart, сохраняя порядок
      nativePart.insertAdjacentElement('afterend', liTelegram);
      liTelegram.insertAdjacentElement('afterend', liNews);
      liNews.insertAdjacentElement('afterend', liSupport);
    } else {
      // иначе вставляем всё целиком перед первым нативным элементом
      const items = [liProfile, liNotifications, liCourses, liPayments, liPartnership, liTelegram, liNews, liSupport].filter(Boolean);
      insertBeforeFirst(menu, items);
    }

    return true;
  }

  function injectOverflowPopup() {
    const popup = q(OVERFLOW_POPUP_SELECTOR);
    if (!popup) return false;

    qa('li[data-injected]', popup).forEach(el => el.remove());

    // создаём элементы
    const liProfile = makeActionItem({ text: 'Профиль', id: 'profile-rest', handler: toggleProfile });
    const liNotifications = makeActionItem({ text: 'Уведомления', id: 'notifications-rest', handler: toggleNotifications });
    const liCourses = makeLinkItem({ text: 'Курсы и материалы', href: '/courses', id: 'courses-rest' });
    const liPayments = makeLinkItem({ text: 'Доступы и оплаты', href: '/payments', id: 'payments-rest' });
    const nativePart = findPartnershipItem(popup);
    const liPartnership = nativePart ? null : makeLinkItem({ text: 'Партнерская программа', href: '/partnership', id: 'partnership-rest' });
    const liTelegram = makeLinkItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-rest' });
    const liNews = makeLinkItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-rest' });
    const liSupport = makeActionItem({ text: 'Техподдержка', id: 'support-rest', handler: openSupport });

    if (nativePart) {
      // вставляем profile..payments перед nativePart
      const parent = nativePart.parentNode;
      [liPayments, liCourses, liNotifications, liProfile].forEach(li => { parent.insertBefore(li, nativePart); });
      // telegram/news/support после nativePart
      nativePart.insertAdjacentElement('afterend', liTelegram);
      liTelegram.insertAdjacentElement('afterend', liNews);
      liNews.insertAdjacentElement('afterend', liSupport);
    } else {
      // insert before first native
      const items = [liProfile, liNotifications, liCourses, liPayments, liPartnership, liTelegram, liNews, liSupport].filter(Boolean);
      insertBeforeFirst(popup, items);
    }

    return true;
  }

  function injectMobileMenu() {
    const drawer = q(MOBILE_DRAWER_SELECTOR);
    if (!drawer) return false;

    const menu = q(MOBILE_MENU_SELECTOR, drawer);
    if (!menu) return false;

    qa('li[data-injected]', menu).forEach(el => el.remove());

    // создаём элементы
    const liProfile = makeActionItem({ text: 'Профиль', id: 'profile-mobile', handler: toggleProfile });
    const liNotifications = makeActionItem({ text: 'Уведомления', id: 'notifications-mobile', handler: toggleNotifications });
    const liCourses = makeLinkItem({ text: 'Курсы и материалы', href: '/courses', id: 'courses-mobile' });
    const liPayments = makeLinkItem({ text: 'Доступы и оплаты', href: '/payments', id: 'payments-mobile' });

    const nativePart = findPartnershipItem(menu);
    const liPartnership = nativePart ? null : makeLinkItem({ text: 'Партнерская программа', href: '/partnership', id: 'partnership-mobile' });
    const liTelegram = makeLinkItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-mobile' });
    const liNews = makeLinkItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-mobile' });
    const liSupport = makeActionItem({ text: 'Техподдержка', id: 'support-mobile', handler: openSupport });

    if (nativePart) {
      const parent = nativePart.parentNode;
      [liPayments, liCourses, liNotifications, liProfile].forEach(li => { parent.insertBefore(li, nativePart); });
      nativePart.insertAdjacentElement('afterend', liTelegram);
      liTelegram.insertAdjacentElement('afterend', liNews);
      liNews.insertAdjacentElement('afterend', liSupport);
    } else {
      const items = [liProfile, liNotifications, liCourses, liPayments, liPartnership, liTelegram, liNews, liSupport].filter(Boolean);
      insertBeforeFirst(menu, items);
    }

    return true;
  }

  // ====== Загрузка и наблюдение ======
  function boot() {
    const tryAll = () => { injectDesktopMain(); injectOverflowPopup(); injectMobileMenu(); };

    // первичный прогон (+ ретраи на прогреве)
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (injectDesktopMain() && injectMobileMenu()) { clearInterval(t); }
      if (tries >= 60) clearInterval(t);
    }, 250);

    // мутации: шапка и тело (для попапа/дровера)
    const header = q('header.ant-layout-header') || document.body;
    const mo1 = new MutationObserver(tryAll);
    mo1.observe(header, { childList: true, subtree: true });

    const mo2 = new MutationObserver(tryAll);
    mo2.observe(document.body, { childList: true, subtree: true });

    // при ресайзе тоже проверим overflow
    window.addEventListener('resize', () => { injectDesktopMain(); injectOverflowPopup(); });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
