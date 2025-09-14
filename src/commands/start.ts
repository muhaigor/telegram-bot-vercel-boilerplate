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

    // Проверяем, не подписан ли уже пользователь
    if (wordScheduler.isUserSubscribed(userId)) {
      const keyboard = createMainKeyboard(true);
      await ctx.reply('✅ Вы уже подписаны на получение немецких слов! Используйте кнопки ниже для управления.', { 
        parse_mode: 'HTML',
        ...keyboard
      });
      return;
    }

    // Подписываем пользователя на получение слов
    wordScheduler.subscribeUser(userId, chatId, ctx);

    const welcomeMessage = `
👋 Привет! Я бот для изучения немецких слов.
Сейчас пришлю первое слово, а затем каждые 15 секунд буду присылать новые автоматически!
Учись легко и каждый день! 💪

✅ <b>Подписка активирована!</b>
Используй кнопки ниже для управления:
    `;

    const keyboard = createMainKeyboard(true);
    await ctx.reply(welcomeMessage, { 
      parse_mode: 'HTML',
      ...keyboard
    });
  };
};
