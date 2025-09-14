from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackQueryHandler
import asyncio
import random
import logging
import os
import json
import requests

# 🔐 Токен из переменных окружения
TOKEN = os.getenv('BOT_TOKEN', '7325353221:AAEta0uc1hlRSOEDiIsvYkBwbgza7Y-oPlM')

# База слов: немецкое слово → русский перевод
GERMAN_WORDS = [
  {"ge": "riechen", "ru": "нюхать"},
  {"ge": "der geruch", "ru": "запах"},
  {"ge": "würde", "ru": "бы"},
  {"ge": "der ellenbogen", "ru": "локоть"},
  {"ge": "das ist verkehrt", "ru": "это неправильно"},
  {"ge": "damit", "ru": "с этим  что бы"},
  {"ge": "werfen", "ru": "кидать"},
  {"ge": "dringend", "ru": "срочно"},
  {"ge": "angenehm", "ru": "приятный"},
  {"ge": "froh", "ru": "радостный"},
  {"ge": "prima", "ru": "отличный"},
  {"ge": "komisch", "ru": "странный"},
  {"ge": "witzig", "ru": "смешной"},
  {"ge": "ruhig", "ru": "спокойный"},
  {"ge": "sicher", "ru": "уверенный"},
  {"ge": "verrückt", "ru": "сумасшедший"},
  {"ge": "schlau", "ru": "умный"},
  {"ge": "fleißig", "ru": "трудолюбивый"},
  {"ge": "faul", "ru": "ленивый"},
  {"ge": "vorsicht", "ru": "осторожно"}
]

# Словарь для хранения активных чатов
active_chats = set()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    active_chats.add(chat_id)

    keyboard = [
        [InlineKeyboardButton("🛑 Остановить рассылку", callback_data='stop')],
        [InlineKeyboardButton("📊 Статистика", callback_data='stats')],
        [InlineKeyboardButton("🔄 Обновить меню", callback_data='menu')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "👋 Привет! Я бот для изучения немецких слов.\n"
        "Каждые 2 минуты 40 секунд я буду присылать тебе новое слово.\n"
        "Учись легко и каждый день! 💪\n\n"
        "✅ <b>Рассылка запущена!</b>\n"
        "Используй кнопки ниже для управления:",
        parse_mode="HTML",
        reply_markup=reply_markup
    )

async def stop(update: Update, context: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    if chat_id in active_chats:
        active_chats.remove(chat_id)
        status = "остановлена"
    else:
        status = "уже остановлена"

    keyboard = [
        [InlineKeyboardButton("▶️ Запустить рассылку", callback_data='start')],
        [InlineKeyboardButton("📊 Статистика", callback_data='stats')],
        [InlineKeyboardButton("🔄 Обновить меню", callback_data='menu')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        f"❌ <b>Рассылка {status}!</b>\n"
        "Используй кнопку ниже, чтобы возобновить обучение:",
        parse_mode="HTML",
        reply_markup=reply_markup
    )

async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    total_words = len(GERMAN_WORDS)
    active_users = len(active_chats)

    keyboard = [
        [InlineKeyboardButton("▶️ Запустить рассылку", callback_data='start')],
        [InlineKeyboardButton("🛑 Остановить рассылку", callback_data='stop')],
        [InlineKeyboardButton("🔄 Обновить меню", callback_data='menu')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        f"📊 <b>Статистика бота:</b>\n\n"
        f"📚 Всего слов в базе: <b>{total_words}</b>\n"
        f"👥 Активных пользователей: <b>{active_users}</b>\n"
        f"⏰ Интервал отправки: <b>2 минуты 40 секунд</b>\n\n"
        f"Продолжай учиться! 🚀",
        parse_mode="HTML",
        reply_markup=reply_markup
    )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    chat_id = query.message.chat_id

    if query.data == 'start':
        active_chats.add(chat_id)
        await query.edit_message_text(
            "✅ <b>Рассылка запущена!</b>\n"
            "Каждые 2 минуты 40 секунд ты будешь получать новые слова.\n"
            "Учись легко и каждый день! 💪",
            parse_mode="HTML",
            reply_markup=query.message.reply_markup
        )
    elif query.data == 'stop':
        active_chats.discard(chat_id)
        await query.edit_message_text(
            "❌ <b>Рассылка остановлена!</b>\n"
            "Нажми 'Запустить', чтобы продолжить обучение.",
            parse_mode="HTML",
            reply_markup=query.message.reply_markup
        )
    elif query.data == 'stats':
        total_words = len(GERMAN_WORDS)
        active_users = len(active_chats)
        await query.edit_message_text(
            f"📊 <b>Статистика:</b>\n\n"
            f"📚 Слов в базе: <b>{total_words}</b>\n"
            f"👥 Активных: <b>{active_users}</b>",
            parse_mode="HTML",
            reply_markup=query.message.reply_markup
        )
    elif query.data == 'menu':
        status = "✅ активна" if chat_id in active_chats else "❌ остановлена"
        keyboard = [
            [InlineKeyboardButton("▶️ Запустить" if chat_id not in active_chats else "🛑 Остановить", callback_data='start' if chat_id not in active_chats else 'stop')],
            [InlineKeyboardButton("📊 Статистика", callback_data='stats')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(
            f"🎛️ <b>Меню</b>\n\n"
            f"📡 Статус: <b>{status}</b>\n"
            f"Выбери действие:",
            parse_mode="HTML",
            reply_markup=reply_markup
        )

# Глобальная переменная для приложения
application = None

def create_app():
    global application
    if application is None:
        # Настройка логирования
        logging.basicConfig(level=logging.INFO)
        
        # Создаём приложение
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем обработчики
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("stop", stop))
        application.add_handler(CommandHandler("stats", stats))
        application.add_handler(CallbackQueryHandler(button_callback))
        
        print("✅ Бот готов к работе!")
    
    return application

# Функция для Vercel
def handler(request):
    app = create_app()
    
    if request.method == "POST":
        # Обработка webhook
        try:
            # Создаем новый event loop
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            # Инициализируем приложение
            loop.run_until_complete(app.initialize())
            
            # Получаем данные из запроса
            update_data = request.get_json()
            if update_data:
                update = Update.de_json(update_data, app.bot)
                if update:
                    loop.run_until_complete(app.process_update(update))
            
            # Завершаем работу
            loop.run_until_complete(app.shutdown())
            
        except Exception as e:
            print(f"Ошибка в handler: {e}")
        finally:
            if 'loop' in locals():
                loop.close()
    
    return {"statusCode": 200, "body": "OK"}