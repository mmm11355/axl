 (function() {
        // Конфигурация: замените URL и текст на свои
        const IMAGE_URL = 'https://con.xl.ru/6jlybDEtBkSGd740E0rLsQ/images/bWToGxz2skmtOwSBYjxbLg.png';
        const HEADER_SELECTOR = 'header.ant-layout-header._header_1yti5_1';
        const MAIN_CONTENT_SELECTOR = 'main.ant-layout-content.overflow-auto';

        const TITLE_TEXT = 'МАГАЗИН ГОТОВЫХ РЕШЕНИЙ';
        const DESCRIPTION_TEXT = 'Здесь вас ждут готовые решения, коды и скрипты, которые помогут быстро и красиво справится с самой не стандартной задачей!';



        function insertImageBlock() {
            const header = document.querySelector(HEADER_SELECTOR);
            const mainContent = document.querySelector(MAIN_CONTENT_SELECTOR);

            if (header && mainContent) {
                if (document.querySelector('.injected-image-block')) {
                    return;
                }

                // Создаем контейнер-обёртку для всего блока (изображение + текст)
                const mainWrapper = document.createElement('div');
                mainWrapper.className = 'injected-image-block';
                mainWrapper.style.width = '80%';
mainWrapper.style.maxwidth = 'max-content';
mainWrapper.style.borderradius = '40px';
mainWrapper.style.background = '#ddac888a';
mainWrapper.style.margin = '0 auto';
                mainWrapper.style.padding = '20px';
                mainWrapper.style.boxSizing = 'border-box';
                mainWrapper.style.display = 'flex';
                mainWrapper.style.alignItems = 'center';
                mainWrapper.style.gap = '20px'; // Отступ между изображением и текстом
                mainWrapper.style.flexWrap = 'wrap'; // Перенос на новую строку на мобильных

                // Создаем контейнер для изображения (левая часть)
                const imageContainer = document.createElement('div');
                imageContainer.style.flex = '1';
                imageContainer.style.minWidth = '250px'; // Минимальная ширина, чтобы не сжималось слишком сильно

                const img = document.createElement('img');
                img.src = IMAGE_URL;
                img.alt = 'Адаптивное изображение';
                img.style.width = '100%';
                img.style.height = '300px';
                img.style.objectFit = 'cover';
                img.style.display = 'block';

                imageContainer.appendChild(img);

                // Создаем контейнер для текста (правая часть)
                const textContainer = document.createElement('div');
                textContainer.style.flex = '1';
                textContainer.style.minWidth = '250px'; // Минимальная ширина

                const title = document.createElement('h2');
                title.textContent = TITLE_TEXT;
                title.style.margin = '0 0 10px';
                title.style.fontSize = '24px';
                title.style.fontWeight = 'bold';
                title.style.color = '#333';

                const description = document.createElement('p');
                description.textContent = DESCRIPTION_TEXT;
                description.style.margin = '0';
                description.style.fontSize = '16px';
                description.style.lineHeight = '1.5';
                description.style.color = '#666';

                textContainer.appendChild(title);
                textContainer.appendChild(description);

                mainWrapper.appendChild(imageContainer);
                mainWrapper.appendChild(textContainer);

                header.insertAdjacentElement('afterend', mainWrapper);

                console.log('Блок с изображением и текстом успешно вставлен.');
            } else {
                console.error('Не удалось найти один из элементов.');
            }
        }

        const observer = new MutationObserver((mutations, obs) => {
            const header = document.querySelector(HEADER_SELECTOR);
            const mainContent = document.querySelector(MAIN_CONTENT_SELECTOR);
            if (header && mainContent) {
                insertImageBlock();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('DOMContentLoaded', insertImageBlock);
    })();
