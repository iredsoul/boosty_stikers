console.log('Boosty Stickers: Extension loaded at', new Date().toLocaleString());

const initializeStickers = () => {
    const chatContainer = document.querySelector('.StreamChatToggler-scss--module_chatWrapper_AGZeG');
    const chatRoot = document.querySelector('.StreamChatToggler-scss--module_root_vjXzV');
    let chatInput = document.querySelector('div[contenteditable="true"]'); // Более общий селектор

    console.log('Boosty Stickers: Chat container:', !!chatContainer, chatContainer);
    console.log('Boosty Stickers: Chat input:', !!chatInput, chatInput ? chatInput.outerHTML : 'Not found');
    console.log('Boosty Stickers: Chat root:', !!chatRoot, chatRoot);

    if (!chatContainer || !chatRoot) {
        console.error('Boosty Stickers: Chat container or root not found');
        return;
    }

    if (!chatInput) {
        console.warn('Boosty Stickers: Chat input (contenteditable) not found, will retry with observer');
    } else {
        console.log('Boosty Stickers: Chat input found initially:', chatInput.outerHTML);
    }

    if (document.querySelector('#sticker-button')) {
        console.log('Boosty Stickers: Button already exists');
        return;
    }

    // Создаём кнопку для стикеров
    const stickerButton = document.createElement('button');
    stickerButton.id = 'sticker-button';
    stickerButton.textContent = '🎨 Stickers';
    stickerButton.style.margin = '5px';
    stickerButton.style.padding = '5px 10px';
    stickerButton.style.cursor = 'pointer';

    // Добавляем кнопку
    const appendButton = () => {
        if (chatInput && chatInput.parentNode) {
            chatInput.parentNode.parentNode.appendChild(stickerButton);
            console.log('Boosty Stickers: Button added near input');
        } else {
            chatRoot.appendChild(stickerButton);
            console.log('Boosty Stickers: Button added to chat root');
        }
    };

    appendButton();

    // Создаём контейнер для стикеров
    const stickerPanel = document.createElement('div');
    stickerPanel.id = 'sticker-panel';
    stickerPanel.style.display = 'none';
    stickerPanel.style.position = 'fixed';
    stickerPanel.style.background = '#e0e0e0';
    stickerPanel.style.border = '2px solid #333';
    stickerPanel.style.padding = '15px';
    stickerPanel.style.zIndex = '100000';
    stickerPanel.style.maxWidth = '200px';
    stickerPanel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
    document.body.appendChild(stickerPanel);
    console.log('Boosty Stickers: Sticker panel created');

    // Добавляем текстовую метку
    const panelLabel = document.createElement('p');
    panelLabel.textContent = 'Sticker Panel';
    panelLabel.style.margin = '0 0 10px 0';
    panelLabel.style.fontWeight = 'bold';
    panelLabel.style.color = '#000';
    stickerPanel.appendChild(panelLabel);

    // Список стикеров
    const stickers = [
        { code: 'Kappa', url: chrome.runtime.getURL('stickers/Kappa.png') },
        { code: 'LUL', url: chrome.runtime.getURL('stickers/LUL.png') },
        { code: 'SeemsGood', url: chrome.runtime.getURL('stickers/SeemsGood.png') },
        { code: 'Meow', url: chrome.runtime.getURL('stickers/Meow.png') },
        { code: 'NotLikeThis', url: chrome.runtime.getURL('stickers/NotLikeThis.png') },
        { code: 'Biblethump', url: chrome.runtime.getURL('stickers/Biblethump.png') }
    ];
    console.log('Boosty Stickers: Available stickers:', stickers);

    // Проверяем доступность стикеров
    stickers.forEach((sticker, index) => {
        const img = new Image();
        img.src = sticker.url;
        img.onload = () => console.log(`Boosty Stickers: Sticker ${index + 1} loaded successfully: ${sticker.url}`);
        img.onerror = () => console.error(`Boosty Stickers: Failed to load sticker ${index + 1}: ${sticker.url}`);
    });

    // Заполняем панель стикеров
    if (stickers.length === 0) {
        console.error('Boosty Stickers: No stickers available');
        const errorText = document.createElement('p');
        errorText.textContent = 'No stickers found';
        errorText.style.color = 'red';
        stickerPanel.appendChild(errorText);
    } else {
        stickers.forEach(sticker => {
            const img = document.createElement('img');
            img.src = sticker.url;
            img.className = 'sticker';
            img.style.width = '28px';
            img.style.height = '28px';
            img.style.margin = '5px';
            img.style.cursor = 'pointer';
            img.title = sticker.code;
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Boosty Stickers: Sticker selected:', sticker.code, sticker.url);
                if (chatInput) {
                    chatInput.focus();
                    document.execCommand('insertText', false, ` ${sticker.code} `);
                    console.log('Boosty Stickers: Inserted sticker code:', sticker.code);
                    stickerPanel.style.display = 'none';
                } else {
                    console.error('Boosty Stickers: Cannot insert sticker code, input not found');
                }
            });
            stickerPanel.appendChild(img);
        });
    }

    // Обработчик клика по кнопке
    stickerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('Boosty Stickers: Sticker button clicked');
        const isPanelOpen = stickerPanel.style.display === 'block';
        stickerPanel.style.display = isPanelOpen ? 'none' : 'block';
        if (!isPanelOpen) {
            const rect = stickerButton.getBoundingClientRect();
            const top = Math.min(rect.bottom + window.scrollY + 5, window.innerHeight - 220);
            const left = Math.min(rect.left + window.scrollX, window.innerWidth - 220);
            stickerPanel.style.top = `${top}px`;
            stickerPanel.style.left = `${left}px`;
            console.log('Boosty Stickers: Sticker panel opened at top:', stickerPanel.style.top, 'left:', stickerPanel.style.left);
            const panelRect = stickerPanel.getBoundingClientRect();
            console.log('Boosty Stickers: Panel visibility - top:', panelRect.top, 'left:', panelRect.left, 'width:', panelRect.width, 'height:', panelRect.height);
        } else {
            console.log('Boosty Stickers: Sticker panel closed');
        }
    });

    // Отслеживание новых сообщений в чате
    const replaceStickersInChat = () => {
        const messages = chatContainer.querySelectorAll('div[class*="Message-scss--module_message"]');
        messages.forEach(message => {
            if (message.dataset.processed) return;
            let text = message.textContent;
            let modified = false;
            stickers.forEach(sticker => {
                const regex = new RegExp(`\\b${sticker.code}\\b`, 'g');
                if (text.match(regex)) {
                    const img = document.createElement('img');
                    img.src = sticker.url;
                    img.style.maxWidth = '28px';
                    img.style.maxHeight = '28px';
                    img.alt = sticker.code;
                    message.innerHTML = message.innerHTML.replace(regex, img.outerHTML);
                    modified = true;
                }
            });
            if (modified) {
                message.dataset.processed = 'true';
                console.log('Boosty Stickers: Replaced sticker codes in message:', message.textContent);
            }
        });
    };

    // MutationObserver для отслеживания новых сообщений
    const chatObserver = new MutationObserver(() => {
        replaceStickersInChat();
    });
    chatObserver.observe(chatContainer, { childList: true, subtree: true });

    // MutationObserver для отслеживания появления поля ввода
    const inputObserver = new MutationObserver(() => {
        chatInput = document.querySelector('div[contenteditable="true"]');
        if (chatInput && !document.querySelector('#sticker-button')) {
            console.log('Boosty Stickers: Chat input detected:', chatInput.outerHTML);
            appendButton();
        }
    });

    inputObserver.observe(document.body, { childList: true, subtree: true });

    // Первоначальная проверка сообщений
    replaceStickersInChat();
};

// Задержка перед инициализацией для ожидания загрузки DOM
setTimeout(() => {
    console.log('Boosty Stickers: Attempting initialization after delay');
    initializeStickers();

    // MutationObserver для ожидания загрузки чата
    const observer = new MutationObserver((mutations, obs) => {
        const chatContainer = document.querySelector('.StreamChatToggler-scss--module_chatWrapper_AGZeG');
        if (chatContainer && !document.querySelector('#sticker-button')) {
            console.log('Boosty Stickers: Chat container detected, initializing at', new Date().toLocaleString());
            initializeStickers();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}, 2000); // Задержка увеличена до 2 секунд