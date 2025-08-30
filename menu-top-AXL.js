(function () {
  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';

  const TG_URL = 'https://t.me/vashgc';
  const NEWS_URL = 'https://antolblog.accelsite.io/home';
  const ACHIEVEMENTS_URL = '/gamification';

  function q(sel, root = document) { return root.querySelector(sel); }
  function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function makeMenuItem({ text, href = '#', id, onClick }) {
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
    a.textContent = text;

    if (onClick) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        onClick();
      });
    } else if (/^https?:\/\//i.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }

    span.appendChild(a);
    li.appendChild(span);
    return li;
  }

  function getCustomItems() {
    return [
      makeMenuItem({
        text: 'Профиль',
        id: 'profile',
        onClick: () => {
          const modalTrigger = document.querySelector('[data-open-profile], .ant-modal-root');
          if (modalTrigger) modalTrigger.click();
        }
      }),
      makeMenuItem({
        text: 'Уведомления',
        id: 'notifications',
        onClick: () => {
          const notifTrigger = document.querySelector('[data-open-notifications], .ant-drawer-right');
          if (notifTrigger) notifTrigger.click();
        }
      }),
      makeMenuItem({
        text: 'Курсы и материалы',
        id: 'courses',
        href: '/courses'
      }),
      makeMenuItem({
        text: 'Доступы и оплаты',
        id: 'payments',
        href: '/payments'
      }),
      makeMenuItem({
        text: 'Партнерская программа',
        id: 'partnership',
        href: '/partnership'
      }),
      makeMenuItem({
        text: 'Канал Телеграм',
        id: 'telegram',
        href: TG_URL
      }),
      makeMenuItem({
        text: 'Наши новости',
        id: 'news',
        href: NEWS_URL
      })
    ];
  }

  function insertIntoMenu(menu) {
    if (!menu) return false;

    // Удаляем старые
    qa('li[data-injected]', menu).forEach(el => el.remove());

    // Находим "Партнерская программа", чтобы вставлять ДО неё все остальные
    const pivot = menu.querySelector('li[data-menu-id$="/partnership"]') || menu.firstElementChild;
    if (!pivot) return false;

    const items = getCustomItems();
    items.reverse().forEach(item => pivot.insertAdjacentElement('beforebegin', item));

    return true;
  }

  function insertIntoMobileMenu() {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open');
    if (!drawer) return false;

    const menu = drawer.querySelector('ul.ant-menu-vertical');
    if (!menu) return false;

    insertIntoMenu(menu);
    return true;
  }

  function boot() {
    // Десктоп
    if (!insertIntoMenu(q(MENU_SELECTOR))) {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (insertIntoMenu(q(MENU_SELECTOR)) || tries >= 60) clearInterval(timer);
      }, 250);
    }

    // Мутации
    const mo = new MutationObserver(() => {
      insertIntoMenu(q(MENU_SELECTOR));
      insertIntoMobileMenu();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
