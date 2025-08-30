(function () {

  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
  const TG_URL = 'https://t.me/vashgc';
  const NEWS_URL = 'https://antolblog.accelsite.io/home';
  const GAMIFICATION_URL = '/gamification';

  function q(sel, root = document) { return root.querySelector(sel); }
  function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function findMenu() {
    return q(MENU_SELECTOR);
  }

  function findFirstItem(menu) {
    return menu.querySelector('li.ant-menu-item');
  }

  function makeButtonItem({ text, id, onClick }) {
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
      if (typeof onClick === 'function') onClick();
    });

    span.appendChild(a);
    li.appendChild(span);
    return li;
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

  function addCustomButtons(menu, pivot) {
    if (!pivot) return;

    if (!menu.querySelector('li[data-injected="profile"]')) {
      const profile = makeButtonItem({
        text: 'Профиль',
        id: 'profile',
        onClick: () => {
          const trigger = document.querySelector('[data-profile-button], .open-profile, .ant-modal-root');
          if (trigger) trigger.click ? trigger.click() : (trigger.style.display = 'block');
        }
      });
      menu.insertBefore(profile, pivot);
    }

    if (!menu.querySelector('li[data-injected="notifications"]')) {
      const notifications = makeButtonItem({
        text: 'Уведомления',
        id: 'notifications',
        onClick: () => {
          const trigger = document.querySelector('[data-notifications-button], .open-notifications, .ant-drawer-right');
          if (trigger) trigger.click ? trigger.click() : trigger.classList.add('ant-drawer-open');
        }
      });
      menu.insertBefore(notifications, pivot);
    }

    if (!menu.querySelector('li[data-injected="achievements"]')) {
      const achievements = makeMenuItem({
        text: 'Достижения',
        href: GAMIFICATION_URL,
        id: 'achievements'
      });
      menu.insertBefore(achievements, pivot);
    }
  }

  function insertIntoMainMenu() {
    const menu = findMenu();
    if (!menu) return false;
    const pivot = findFirstItem(menu);
    if (!pivot) return false;
    addCustomButtons(menu, pivot);
    return true;
  }

  function insertIntoMobileMenu() {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open');
    if (!drawer) return false;

    const menu = drawer.querySelector('ul.ant-menu-vertical');
    if (!menu) return false;

    const pivot = menu.querySelector('li.ant-menu-item');
    if (!pivot) return false;

    addCustomButtons(menu, pivot);
    return true;
  }

  function boot() {
    if (!insertIntoMainMenu()) {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (insertIntoMainMenu() || tries >= 60) clearInterval(timer);
      }, 250);
    }

    const header = q('header.ant-layout-header') || document.body;
    const mo = new MutationObserver(() => {
      insertIntoMainMenu();
      insertIntoMobileMenu();
    });
    mo.observe(header, { childList: true, subtree: true });

    const bodyMo = new MutationObserver(() => {
      insertIntoMobileMenu();
    });
    bodyMo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

})();
