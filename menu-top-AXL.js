(function () {
  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
  const TG_URL = 'https://t.me/yourchannel';   // <-- замените
  const NEWS_URL = '/news';                    // <-- замените

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

  function insertIntoMainMenu() {
    const menu = findMenu();
    if (!menu) return false;

    const existsTg = menu.querySelector('li[data-injected="telegram"]');
    const existsNews = menu.querySelector('li[data-injected="news"]');
    if (existsTg && existsNews) return true;

    const pivot = findPartnershipItem(menu);
    if (!pivot) return false;

    const tg = existsTg || makeMenuItem({ text: 'Телеграм', href: TG_URL, id: 'telegram' });
    const news = existsNews || makeMenuItem({ text: 'Наши новости', href: NEWS_URL, id: 'news' });

    if (!existsTg) pivot.insertAdjacentElement('afterend', tg);
    if (!existsNews) tg.insertAdjacentElement('afterend', news);

    return true;
  }

  function insertIntoRestMenu() {
    // попап, который Ant рисует при переполнении
    const popup = document.querySelector('.ant-menu-submenu-popup ul.ant-menu');
    if (!popup) return;

    const existsTg = popup.querySelector('li[data-injected="telegram-rest"]');
    const existsNews = popup.querySelector('li[data-injected="news-rest"]');

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
  const TG_URL = 'https://t.me/yourchannel';   // замените на ваш канал
  const NEWS_URL = '/news';                    // замените на страницу новостей

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

  function insertIntoMobileMenu() {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open');
    if (!drawer) return false;

    const menu = drawer.querySelector('ul.ant-menu-vertical');
    if (!menu) return false;

    const partnership = menu.querySelector('li[data-menu-id$="/partnership"]');
    if (!partnership) return false;

    if (!menu.querySelector('li[data-injected="telegram-mobile"]')) {
      const tg = makeMenuItem({ text: 'Телеграм', href: TG_URL, id: 'telegram-mobile' });
      partnership.insertAdjacentElement('afterend', tg);
    }
    if (!menu.querySelector('li[data-injected="news-mobile"]')) {
      const news = makeMenuItem({ text: 'Наши новости', href: NEWS_URL, id: 'news-mobile' });
      const afterEl = menu.querySelector('li[data-injected="telegram-mobile"]') || partnership;
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
