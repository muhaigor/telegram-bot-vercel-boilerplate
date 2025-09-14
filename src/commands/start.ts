import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';
import { createMainKeyboard } from '../services/inline-keyboard';

export const start = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;

    if (!userId || !chatId) {
      await ctx.reply('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    // Добавляем пользователя в активные
    wordScheduler.addUser(userId, chatId, ctx);

    const welcomeMessage = `
👋 Привет! Я бот для изучения немецких слов.
Каждые 2 минуты 40 секунд я буду присылать тебе новое слово.
Учись легко и каждый день! 💪

✅ <b>Рассылка запущена!</b>
Используй кнопки ниже для управления:
    `;

    const keyboard = createMainKeyboard(true);
    await ctx.reply(welcomeMessage, { 
      parse_mode: 'HTML',
      ...keyboard
    });
  };
};
