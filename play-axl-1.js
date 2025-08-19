(function () {
  // ---------- 1) CSS со стилями (высокая специфичность + частично !important) ----------
  const css = `
  :root {
    --axl-bg: #f5f6fa;
    --axl-card: #ffffff;
    --axl-border: #e9ecf1;
    --axl-text: #222;
    --axl-muted: #666;
    --axl-accent: #007aff;
    --axl-accent-2: #1769aa;
    --axl-success: #28a745;
    --axl-shadow: 0 8px 24px rgba(0,0,0,.08);
  }

  body.checkout-body{
    background: var(--axl-bg) !important;
    margin:0;
    padding:20px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  }

  /* общий контейнер, в который мы соберём корзину и форму */
  body.checkout-body .axl-checkout-grid{
    max-width: 1040px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(360px, 1fr);
    gap: 28px;
    align-items: start;
  }

  /* карточки */
  body.checkout-body .axl-card{
    background: var(--axl-card);
    border-radius: 16px;
    box-shadow: var(--axl-shadow);
    border: 1px solid var(--axl-border);
    padding: 24px;
  }

  /* корзина */
  body.checkout-body .axl-checkout-grid .a-checkout{
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  body.checkout-body .axl-checkout-grid .a-checkout .a-checkout-cart-holder{
    background: var(--axl-card);
    border-radius: 16px;
    border: 1px solid var(--axl-border);
    box-shadow: var(--axl-shadow);
    padding: 22px;
  }

  body.checkout-body .a-cart-title{
    font-size: 22px;
    font-weight: 700;
    color: var(--axl-text);
    margin: 0 0 16px 0;
  }

  body.checkout-body .c-item{
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--axl-border);
  }
  body.checkout-body .c-item:last-child{ border-bottom: none; }

  body.checkout-body .c-item-image{
    width: 80px; height: 80px; border-radius: 12px;
    background-size: cover; background-position: center;
  }
  body.checkout-body .c-item-info-holder{ align-self: start; }
  body.checkout-body .c-item-info-title{
    font-size: 18px; font-weight: 600; color: #333; margin-bottom: 4px;
  }
  body.checkout-body .c-item-info-desc{
    font-size: 14px; color: var(--axl-muted);
  }
  body.checkout-body .c-item-price{
    text-align: right; color: var(--axl-text); font-weight: 700;
  }
  body.checkout-body .c-item-save-base{
    font-size: 13px; color: #9aa2af; text-decoration: line-through; font-weight: 500;
  }

  /* итоги */
  body.checkout-body .a-cart-footer{
    margin-top: 18px; padding-top: 14px; border-top: 2px solid var(--axl-border);
  }
  body.checkout-body .ttl-secondary,
  body.checkout-body .ttl-main{
    display: flex; justify-content: space-between; align-items: center;
  }
  body.checkout-body .ttl-secondary{ color:#777; font-size:14px; margin-bottom:8px; }
  body.checkout-body .ttl-main{ font-size:18px; font-weight:800; color:#000; }

  /* форма */
  body.checkout-body .a-checkout-form-holder.axl-card{
    padding: 22px;
  }
  body.checkout-body .a-checkout-form{
    margin-top: 6px;
  }

  body.checkout-body .a-checkout-form-item{
    margin-bottom: 14px;
  }
  body.checkout-body .a-checkout-form-item label{
    display: block; margin-bottom: 6px; font-size: 14px; color:#444;
  }
  body.checkout-body .a-checkout-form-item input{
    width: 100%;
    padding: 12px 12px;
    border-radius: 10px;
    border: 1px solid #d8dbe2;
    font-size: 16px;
    outline: none;
    transition: box-shadow .2s, border-color .2s;
    background: #fff;
  }
  body.checkout-body .a-checkout-form-item input:focus{
    border-color: var(--axl-accent);
    box-shadow: 0 0 0 3px rgba(0,122,255,.18);
  }

  /* кнопки */
  body.checkout-body .stage-btn,
  body.checkout-body .a-checkout-pay-btn{
    display: inline-flex; align-items: center; justify-content: center;
    width: 100%; gap: 10px;
    text-align: center; padding: 14px 16px;
    border-radius: 12px; font-size: 16px; font-weight: 700;
    text-decoration: none; cursor: pointer; transition: transform .05s ease, background-color .2s ease;
    border: none;
  }

  body.checkout-body .stage-btn{
    background: var(--axl-accent); color:#fff;
  }
  body.checkout-body .stage-btn:hover{ background:#005ecb; }
  body.checkout-body .stage-btn:active{ transform: translateY(1px); }

  body.checkout-body .stage-btn.stage-btn-secondary{
    background:#eef1f5; color:#333;
  }
  body.checkout-body .stage-btn.stage-btn-secondary:hover{ background:#e3e7ee; }

  body.checkout-body .a-checkout-gateway-holder .a-checkout-pay-btn{
    background: var(--axl-success); color:#fff;
  }
  body.checkout-body .a-checkout-gateway-holder .a-checkout-pay-btn:hover{
    background:#218838;
  }
  body.checkout-body .a-checkout-gateway-holder .a-checkout-pay-btn .pay-text{
    font-weight: 700;
  }

  /* промокод */
  body.checkout-body .a-checkout-promocode .cart-link{
    color: var(--axl-accent-2);
    text-decoration: underline;
    cursor: pointer;
  }

  /* мобильный вид */
  @media (max-width: 860px){
    body.checkout-body .axl-checkout-grid{
      grid-template-columns: 1fr;
      gap: 20px;
    }
    body.checkout-body .c-item{
      grid-template-columns: 80px 1fr;
    }
    body.checkout-body .c-item-price{
      grid-column: 2 / 3; text-align: left; margin-top: 6px;
    }
  }
  `;

  // Вставка стилей
  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-axl', 'checkout-style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------- 2) Упорядочивание DOM: собираем корзину и форму в общий контейнер ----------
  let initialized = false;

  function initLayout() {
    if (initialized) return;

    // Блоки из реальной разметки пользователя
    const cartOuter = document.querySelector('.a-checkout');                 // контейнер с корзиной
    const cartHolder = document.querySelector('.a-checkout-cart-holder');    // внутренняя корзина
    const formHolder = document.querySelector('.a-checkout-form-holder');    // контейнер с формой

    if (!cartOuter && !cartHolder) return; // ждём появления
    if (!formHolder) return;               // ждём появления

    // Создаём родительскую сетку
    let grid = document.querySelector('.axl-checkout-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.className = 'axl-checkout-grid';
    }

    // Монтируем сетку: ставим её в DOM рядом с корзиной
    const mountRef = (cartOuter || cartHolder);
    const parent = mountRef.parentNode;
    if (!grid.isConnected) {
      parent.insertBefore(grid, mountRef);
    }

    // Перемещаем карточки в сетку (аккуратно, чтобы не ломать внутренние id/обработчики)
    // Левая колонка
    const leftCard = cartOuter || cartHolder;
    leftCard.classList.add('axl-card');
    grid.appendChild(leftCard);

    // Правая колонка (форма)
    formHolder.classList.add('axl-card');
    grid.appendChild(formHolder);

    initialized = true;
  }

  // ---------- 3) Поведение: плавный скролл к ошибке и автоподстройка ----------
  function enhanceUX() {
    const form = document.querySelector('.a-checkout-form');
    if (!form) return;

    // Плавный скролл к первой ошибке (если валидатор проставляет .error / .has-error)
    form.addEventListener('submit', function () {
      const firstError = form.querySelector('.error, .has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // ---------- 4) Инициализация: сразу и при динамических изменениях ----------
  function tryBoot() {
    initLayout();
    enhanceUX();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryBoot);
  } else {
    tryBoot();
  }

  // На случай, если чек-аут дорисовывается позже (виджет/ajax):
  const mo = new MutationObserver(() => {
    tryBoot();
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
