(function () {
  const MENU_SELECTOR = 'header.ant-layout-header .ant-menu-overflow.ant-menu-root';
  const TG_URL = 'https://t.me/vashgc';
  const NEWS_URL = 'https://antolblog.accelsite.io/home';

  // Утилиты
  function q(sel, root = document) { return root.querySelector(sel); }
  function qa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // Создание элемента меню
  function makeMenuItem({ text, href = '#', id, onClick }) {
    const li = document.createElement('li');
    li.className = 'ant-menu-item custom-menu-item';
    li.dataset.injected = id;

    const span = document.createElement('span');
    span.className = 'ant-menu-title-content';

    const a = document.createElement('a');
    a.href = href;
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

  // Набор кнопок в правильной очередности
  function getCustomItems() {
    return [
      makeMenuItem({ text: 'Профиль', id: 'profile', onClick: () => q('.ant-modal-root')?.click() }),
      makeMenuItem({ text: 'Уведомления', id: 'notifications', onClick: () => q('.ant-drawer-right')?.click() }),
      makeMenuItem({ text: 'Курсы и материалы', id: 'courses', href: '/courses' }),
      makeMenuItem({ text: 'Доступы и оплаты', id: 'payments', href: '/payments' }),
      makeMenuItem({ text: 'Партнерская программа', id: 'partnership', href: '/partnership' }),
      makeMenuItem({ text: 'Канал Телеграм', id: 'telegram', href: TG_URL }),
      makeMenuItem({ text: 'Наши новости', id: 'news', href: NEWS_URL }),
      makeMenuItem({
        text: 'Техподдержка',
        id: 'support',
        onClick: () => {
          const chat = q('.fixed.shadow-lg.overflow-hidden.border.f-chat-wrapper._chat_floating_1ovvy_1');
          if (chat) {
            chat.classList.add('open');
            chat.style.display = 'block';
          }
        }
      })
    ];
  }

  // Вставка элементов
  function insertMenu(menu) {
    if (!menu) return false;
    qa('li[data-injected]', menu).forEach(el => el.remove());
    getCustomItems().forEach(item => menu.appendChild(item));
    return true;
  }

  // Запуск вставки
  function tryInsert() {
    insertMenu(q(MENU_SELECTOR)); // десктоп
    const drawer = q('.ant-drawer.ant-drawer-open'); // мобильное
    if (drawer) insertMenu(q('ul.ant-menu-vertical', drawer));
  }

  // Наблюдатель за изменениями DOM
  const observer = new MutationObserver(() => tryInsert());
  observer.observe(document.body, { childList: true, subtree: true });

  // Первый запуск
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryInsert();
  } else {
    document.addEventListener('DOMContentLoaded', tryInsert);
  }
})();
