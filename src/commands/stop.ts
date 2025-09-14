import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';
import { createMainKeyboard } from '../services/inline-keyboard';

export const stop = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    // Проверяем, активен ли пользователь
    if (!wordScheduler.isUserActive(userId)) {
      const keyboard = createMainKeyboard(false);
      await ctx.reply('ℹ️ Вы не получаете слова. Используйте кнопку ниже чтобы начать.', {
        parse_mode: 'HTML',
        ...keyboard
      });
      return;
    }

    // Удаляем пользователя из расписания
    const removed = wordScheduler.removeUser(userId);

    if (removed) {
      const keyboard = createMainKeyboard(false);
      await ctx.reply('❌ <b>Рассылка остановлена!</b>\nИспользуй кнопку ниже, чтобы возобновить обучение:', {
        parse_mode: 'HTML',
        ...keyboard
      });
    } else {
      await ctx.reply('❌ Ошибка при остановке получения слов');
    }
  };
};
