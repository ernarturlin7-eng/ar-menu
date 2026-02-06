// ========================================
// AR Menu - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('AR Menu загружен');
    
    // Инициализация
    initModelViewers();
    initARButtons();
    initAnalytics();
    
    // Показываем подсказку для первого посещения
    showFirstTimeHint();
});

// ========================================
// Инициализация Model Viewer
// ========================================

function initModelViewers() {
    const modelViewers = document.querySelectorAll('model-viewer');
    
    modelViewers.forEach((viewer, index) => {
        // Событие загрузки модели
        viewer.addEventListener('load', function() {
            console.log(`Модель ${index + 1} загружена`);
            
            // Добавляем класс для анимации
            viewer.classList.add('loaded');
            
            // Скрываем загрузчик
            const loading = viewer.querySelector('.model-loading');
            if (loading) {
                loading.style.display = 'none';
            }
        });
        
        // Событие ошибки загрузки
        viewer.addEventListener('error', function(event) {
            console.error(`Ошибка загрузки модели ${index + 1}:`, event.detail);
            
            // Показываем заглушку
            showModelPlaceholder(viewer);
        });
        
        // Событие клика по модели (для аналитики)
        viewer.addEventListener('click', function() {
            trackEvent('model_interaction', {
                model_index: index,
                action: 'click'
            });
        });
    });
}

// ========================================
// Обработка AR кнопок
// ========================================

function initARButtons() {
    const arButtons = document.querySelectorAll('.ar-button');
    
    arButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            console.log(`AR кнопка ${index + 1} нажата`);
            
            // Проверяем поддержку AR
            if (!isARSupported()) {
                showARNotSupportedMessage();
                return;
            }
            
            // Аналитика
            trackEvent('ar_button_click', {
                dish_index: index,
                timestamp: new Date().toISOString()
            });
            
            // Добавляем анимацию нажатия
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 300);
        });
    });
}

// ========================================
// Проверка поддержки AR
// ========================================

function isARSupported() {
    // Проверяем наличие API для AR
    const hasWebXR = 'xr' in navigator;
    const hasSceneViewer = /Android/i.test(navigator.userAgent);
    const hasQuickLook = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    return hasWebXR || hasSceneViewer || hasQuickLook;
}

// ========================================
// Сообщение о неподдержке AR
// ========================================

function showARNotSupportedMessage() {
    const message = document.createElement('div');
    message.className = 'ar-not-supported-message';
    message.innerHTML = `
        <div class="message-content">
            <div class="message-icon">⚠️</div>
            <h3>AR недоступен</h3>
            <p>К сожалению, ваше устройство не поддерживает технологию дополненной реальности.</p>
            <p>Попробуйте использовать современный смартфон с iOS (iPhone 6s и новее) или Android с поддержкой ARCore.</p>
            <button class="close-message" onclick="this.parentElement.parentElement.remove()">Понятно</button>
        </div>
    `;
    
    // Добавляем стили для сообщения
    const style = document.createElement('style');
    style.textContent = `
        .ar-not-supported-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .message-content {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 500px;
            text-align: center;
            animation: slideUp 0.3s ease;
        }
        
        .message-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .message-content h3 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            margin-bottom: 15px;
            color: #1a1a1a;
        }
        
        .message-content p {
            color: #6b6b6b;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .close-message {
            background: linear-gradient(135deg, #d4a574 0%, #e8c9a5 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
            transition: transform 0.2s;
        }
        
        .close-message:hover {
            transform: scale(1.05);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
}

// ========================================
// Заглушка для моделей
// ========================================

function showModelPlaceholder(viewer) {
    const placeholder = document.createElement('div');
    placeholder.className = 'model-placeholder';
    placeholder.innerHTML = `
        <div class="placeholder-content">
            <div class="placeholder-icon">🍽️</div>
            <p>3D модель временно недоступна</p>
            <small>Попробуйте обновить страницу</small>
        </div>
    `;
    
    // Стили для заглушки
    const style = document.createElement('style');
    style.textContent = `
        .model-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f3f0;
            border-radius: 16px;
        }
        
        .placeholder-content {
            text-align: center;
            color: #6b6b6b;
        }
        
        .placeholder-icon {
            font-size: 4rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .placeholder-content p {
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .placeholder-content small {
            font-size: 0.85rem;
            opacity: 0.7;
        }
    `;
    
    if (!document.querySelector('#placeholder-styles')) {
        style.id = 'placeholder-styles';
        document.head.appendChild(style);
    }
    
    viewer.shadowRoot.appendChild(placeholder);
}

// ========================================
// Подсказка для первого посещения
// ========================================

function showFirstTimeHint() {
    // Проверяем, был ли пользователь на сайте ранее
    const hasVisited = localStorage.getItem('ar_menu_visited');
    
    if (!hasVisited) {
        // Показываем приветственное сообщение через 2 секунды
        setTimeout(() => {
            showWelcomeHint();
            localStorage.setItem('ar_menu_visited', 'true');
        }, 2000);
    }
}

function showWelcomeHint() {
    const hint = document.createElement('div');
    hint.className = 'welcome-hint';
    hint.innerHTML = `
        <div class="hint-content">
            <div class="hint-icon">👋</div>
            <p>Добро пожаловать! Нажмите на любое блюдо, чтобы посмотреть его в AR.</p>
            <button class="hint-close" onclick="this.parentElement.parentElement.remove()">Понятно</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .welcome-hint {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            animation: slideUpFade 0.5s ease;
        }
        
        .hint-content {
            background: white;
            border-radius: 16px;
            padding: 20px 25px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 90vw;
            border: 2px solid #d4a574;
        }
        
        .hint-icon {
            font-size: 2rem;
        }
        
        .hint-content p {
            margin: 0;
            color: #2c2c2c;
            font-size: 0.95rem;
            flex: 1;
        }
        
        .hint-close {
            background: linear-gradient(135deg, #d4a574 0%, #e8c9a5 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.2s;
        }
        
        .hint-close:hover {
            transform: scale(1.05);
        }
        
        @keyframes slideUpFade {
            from {
                opacity: 0;
                transform: translate(-50%, 20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        @media (max-width: 768px) {
            .hint-content {
                flex-direction: column;
                text-align: center;
                padding: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(hint);
    
    // Автоматически скрываем через 8 секунд
    setTimeout(() => {
        if (hint.parentElement) {
            hint.style.animation = 'slideDownFade 0.5s ease';
            setTimeout(() => hint.remove(), 500);
        }
    }, 8000);
}

// ========================================
// Аналитика (простая версия)
// ========================================

function initAnalytics() {
    // Отслеживаем время на странице
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        trackEvent('session_end', {
            time_spent: timeSpent
        });
    });
    
    // Отслеживаем скролл
    let hasScrolled = false;
    window.addEventListener('scroll', function() {
        if (!hasScrolled && window.scrollY > 100) {
            hasScrolled = true;
            trackEvent('user_scrolled', {
                scroll_depth: window.scrollY
            });
        }
    });
}

function trackEvent(eventName, eventData) {
    console.log(`[Analytics] ${eventName}:`, eventData);
    
    // Здесь можно добавить отправку данных в Google Analytics, Yandex.Metrica и т.д.
    // Пример: gtag('event', eventName, eventData);
    
    // Сохраняем события локально для демонстрации
    const events = JSON.parse(localStorage.getItem('ar_menu_events') || '[]');
    events.push({
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
    });
    
    // Храним только последние 50 событий
    if (events.length > 50) {
        events.shift();
    }
    
    localStorage.setItem('ar_menu_events', JSON.stringify(events));
}

// ========================================
// Утилиты
// ========================================

// Плавная прокрутка к элементу
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Проверка видимости элемента
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Дебаунс функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспорт функций для использования в консоли (для отладки)
window.ARMenu = {
    trackEvent,
    isARSupported,
    showARNotSupportedMessage
};

console.log('🍽️ AR Menu готов к использованию!');
console.log('Доступные функции: window.ARMenu');
