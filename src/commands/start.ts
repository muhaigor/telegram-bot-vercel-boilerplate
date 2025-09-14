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

    // Проверяем, не активен ли уже пользователь
    if (wordScheduler.isUserActive(userId)) {
      const keyboard = createMainKeyboard(true);
      await ctx.reply('✅ Вы уже получаете немецкие слова! Используйте кнопки ниже для управления.', { 
        parse_mode: 'HTML',
        ...keyboard
      });
      return;
    }

    // Добавляем пользователя в расписание
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
