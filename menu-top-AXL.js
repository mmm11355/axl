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
    // 1) если уже открыто — закрыть крестиком
    const openModal = q('.ant-modal-root .ant-modal-wrap[aria-hidden="false"], .ant-modal-root .ant-modal-wrap:not([aria-hidden])');
    if (openModal && q('.ant-modal-close', openModal)) { click(q('.ant-modal-close', openModal)); return; }

    // 2) попробовать триггеры профиля в шапке
    const triggers = [
      '[data-profile-button]',
      '[aria-label="Профиль"]',
      '.open-profile',
      'header .ant-avatar, header .header-profile, header .ant-dropdown-trigger .ant-avatar'
    ];
    for (const sel of triggers) { const el = q(sel); if (el) { click(el); return; } }

    // 3) fallback — если модалка уже в DOM, но скрыта, попробуем подсветить (как крайняя мера)
    const root = q('.ant-modal-root');
    if (root) {
      const wrap = q('.ant-modal-wrap', root);
      if (wrap) { wrap.style.display = 'block'; document.body.classList.add('ant-scrolling-effect'); }
    }
  }

  function toggleNotifications() {
    // 1) если уже открыт — закрыть
    const openDrawer = q('.ant-drawer.ant-drawer-right.p-0.m-0.no-header.ant-drawer-open');
    if (openDrawer) { const closeBtn = q('.ant-drawer-close', openDrawer); if (closeBtn) click(closeBtn); else openDrawer.classList.remove('ant-drawer-open'); return; }

    // 2) попробовать клик по триггерам колокольчика
    const triggers = [
      '[data-notifications-button]',
      '[aria-label="Уведомления"]',
      '[aria-label="notifications"]',
      '.open-notifications',
      'header .anticon-bell, header [class*="bell"], header .notification-button'
    ];
    for (const sel of triggers) { const el = q(sel); if (el) { click(el); return; } }

    // 3) fallback — принудительно открыть нужный дровер
    const targetDrawer = q('.ant-drawer.ant-drawer-right.p-0.m-0.no-header');
    if (targetDrawer) targetDrawer.classList.add('ant-drawer-open');
  }

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

  // ====== Вставки в разные контейнеры ======
  function injectDesktopMain() {
    const menu = q(MENU_SELECTOR_DESKTOP);
    if (!menu) return false;

    // Три кнопки ДО всех основных
    if (ensureOnce(menu, 'profile')) {
      const li = makeActionItem({ text: 'Профиль', id: 'profile', handler: toggleProfile });
      insertBeforeFirst(menu, [li]);
    }
    if (ensureOnce(menu, 'notifications')) {
      const li = makeActionItem({ text: 'Уведомления', id: 'notifications', handler: toggleNotifications });
      insertBeforeFirst(menu, [li]);
    }
    if (ensureOnce(menu, 'achievements')) {
      const li = makeLinkItem({ text: 'Достижения', href: GAMIFICATION_URL, id: 'achievements' });
      insertBeforeFirst(menu, [li]);
    }

    // TG / Блог — как раньше: после "Партнерская программа"
    const pivot = findPartnershipItem(menu) || menu.lastElementChild;
    if (ensureOnce(menu, 'telegram')) {
      const tg = makeLinkItem({ text: 'Канал Телеграм', href: TG_URL, id: 'telegram' });
      pivot ? pivot.insertAdjacentElement('afterend', tg) : menu.appendChild(tg);
    }
    if (ensureOnce(menu, 'news')) {
      const news = makeLinkItem({ text: 'Наш Блог', href: NEWS_URL, id: 'news' });
      const afterEl = menu.querySelector('li[data-injected="telegram"]') || pivot;
      afterEl ? afterEl.insertAdjacentElement('afterend', news) : menu.appendChild(news);
    }

    return true;
  }

  function injectOverflowPopup() {
    const popup = q(OVERFLOW_POPUP_SELECTOR);
    if (!popup) return false;

    // prepend три кнопки
    if (ensureOnce(popup, 'profile-rest')) {
      popup.insertBefore(makeActionItem({ text: 'Профиль', id: 'profile-rest', handler: toggleProfile }), popup.firstChild);
    }
    if (ensureOnce(popup, 'notifications-rest')) {
      popup.insertBefore(makeActionItem({ text: 'Уведомления', id: 'notifications-rest', handler: toggleNotifications }), popup.firstChild);
    }
    if (ensureOnce(popup, 'achievements-rest')) {
      popup.insertBefore(makeLinkItem({ text: 'Достижения', href: GAMIFICATION_URL, id: 'achievements-rest' }), popup.firstChild);
    }

    // TG / Блог — в конец попапа
    if (ensureOnce(popup, 'telegram-rest')) {
      popup.appendChild(makeLinkItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-rest' }));
    }
    if (ensureOnce(popup, 'news-rest')) {
      popup.appendChild(makeLinkItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-rest' }));
    }

    return true;
  }

  function injectMobileMenu() {
    const drawer = q(MOBILE_DRAWER_SELECTOR);
    if (!drawer) return false;

    const menu = q(MOBILE_MENU_SELECTOR, drawer);
    if (!menu) return false;

    // prepend три кнопки
    if (ensureOnce(menu, 'profile-mobile')) {
      insertBeforeFirst(menu, [makeActionItem({ text: 'Профиль', id: 'profile-mobile', handler: toggleProfile })]);
    }
    if (ensureOnce(menu, 'notifications-mobile')) {
      insertBeforeFirst(menu, [makeActionItem({ text: 'Уведомления', id: 'notifications-mobile', handler: toggleNotifications })]);
    }
    if (ensureOnce(menu, 'achievements-mobile')) {
      insertBeforeFirst(menu, [makeLinkItem({ text: 'Достижения', href: GAMIFICATION_URL, id: 'achievements-mobile' })]);
    }

    // TG / Блог — после "Партнерская программа", если найдём её; иначе в конец
    const pivot = findPartnershipItem(menu) || menu.lastElementChild;
    if (ensureOnce(menu, 'telegram-mobile')) {
      const tg = makeLinkItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-mobile' });
      pivot ? pivot.insertAdjacentElement('afterend', tg) : menu.appendChild(tg);
    }
    if (ensureOnce(menu, 'news-mobile')) {
      const news = makeLinkItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-mobile' });
      const afterEl = menu.querySelector('li[data-injected="telegram-mobile"]') || pivot;
      afterEl ? afterEl.insertAdjacentElement('afterend', news) : menu.appendChild(news);
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
