import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';

export const stop = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;

    if (!userId) {
      await ctx.reply('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    // Проверяем, активен ли пользователь
    if (!wordScheduler.isUserActive(userId)) {
      await ctx.reply('ℹ️ Вы не получаете слова. Используйте /start чтобы начать.');
      return;
    }

    // Удаляем пользователя из расписания
    const removed = wordScheduler.removeUser(userId);

    if (removed) {
      await ctx.reply('⏹️ Получение слов остановлено. Используйте /start чтобы начать снова.');
    } else {
      await ctx.reply('❌ Ошибка при остановке получения слов');
    }
  };
};
