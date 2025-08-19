(function(){
  // === Стили ===
  const style = document.createElement("style");
  style.innerHTML = `
  body.checkout-body{font-family:'Inter','Arial',sans-serif;background:#f7f7fa;padding:20px}
  .a-checkout{max-width:900px;margin:0 auto;background:#fff;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,0.08);padding:30px}
  .a-cart-title{font-size:22px;font-weight:600;color:#222;margin-bottom:20px}
  .c-item{display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid #eee}
  .c-item:last-child{border-bottom:none}
  .c-item-image{width:80px;height:80px;border-radius:12px;background-size:cover;background-position:center;flex-shrink:0}
  .c-item-info-holder{flex-grow:1;margin-left:15px}
  .c-item-info-title{font-size:18px;font-weight:600;margin-bottom:5px;color:#333}
  .c-item-info-desc{font-size:14px;color:#666}
  .c-item-price{font-size:16px;font-weight:600;color:#222}
  .c-item-save-base{font-size:14px;text-decoration:line-through;color:#999}
  .a-cart-footer{margin-top:20px;padding-top:15px;border-top:2px solid #eee}
  .ttl-secondary{display:flex;justify-content:space-between;font-size:14px;color:#777}
  .ttl-main{margin-top:10px;display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#000}
  .a-checkout-form{margin-top:30px}
  .a-checkout-form-item{margin-bottom:15px}
  .a-checkout-form-item label{display:block;font-size:14px;color:#444;margin-bottom:6px}
  .a-checkout-form-item input{width:100%;padding:12px;border-radius:10px;border:1px solid #ddd;font-size:16px;outline:none}
  .a-checkout-form-item input:focus{border-color:#007aff;box-shadow:0 0 0 2px rgba(0,122,255,0.2)}
  .stage-btn,.a-checkout-pay-btn{display:inline-block;width:100%;text-align:center;padding:14px;border-radius:12px;font-size:16px;font-weight:600;text-decoration:none;transition:all .2s;cursor:pointer}
  .stage-btn{background:#007aff;color:#fff}
  .stage-btn:hover{background:#005ecb}
  .a-checkout-pay-btn{background:#28a745;color:#fff;margin-top:15px}
  .a-checkout-pay-btn:hover{background:#218838}
  .stage-btn-secondary{background:#eee;color:#333;margin-top:10px}
  .stage-btn-secondary:hover{background:#ddd}
  @media(max-width:768px){.c-item{flex-direction:column;align-items:flex-start}.c-item-image{margin-bottom:10px}.c-item-price{margin-top:8px}}
  `;
  document.head.appendChild(style);

  // === JS (пример: скролл к ошибкам формы) ===
  document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector(".a-checkout-form");
    if(form){
      form.addEventListener("submit", function(){
        const firstError = form.querySelector(".error, .has-error");
        if(firstError){
          firstError.scrollIntoView({behavior:"smooth", block:"center"});
        }
      });
    }
  });
})();
