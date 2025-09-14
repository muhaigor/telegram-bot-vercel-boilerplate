# 🚀 Инструкция по деплою на Vercel

## ✅ Исправления выполнены:

1. **Исправлен `vercel.json`:**
   - Изменен runtime с `python3.9` на `@vercel/python`
   - Это исправляет ошибку "Function Runtimes must have a valid version"

2. **Исправлен `api/index.py`:**
   - Улучшена обработка event loop
   - Исправлена структура функции `handler`

## 📋 Пошаговая инструкция:

### 1. Установите Vercel CLI:
```bash
npm install -g vercel
```

### 2. Войдите в аккаунт Vercel:
```bash
vercel login
```

### 3. Деплой проекта:
```bash
vercel --prod
```

### 4. Добавьте переменную окружения:
```bash
vercel env add BOT_TOKEN
```
Введите ваш токен бота.

### 5. Настройте webhook:
Замените `<YOUR_BOT_TOKEN>` и `your-app.vercel.app` на ваши значения:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-app.vercel.app/api/index"}'
```

## 🎯 Результат:

- ✅ Бот будет работать на Vercel
- ✅ Команды `/start`, `/stop`, `/stats` работают
- ✅ Inline-кнопки работают
- ❌ Автоматическая отправка слов НЕ работает (ограничение Vercel)

## 🏠 Для полной функциональности:

Используйте `bot_local.py` локально:
```bash
python bot_local.py
```

Там будет работать автоматическая отправка каждые 10 секунд!

---

**Готово к деплою! 🎉**
