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

    // Проверяем, подписан ли пользователь
    if (!wordScheduler.isUserSubscribed(userId)) {
      const keyboard = createMainKeyboard(false);
      await ctx.reply('ℹ️ Вы не подписаны на получение слов. Используйте кнопку ниже чтобы подписаться.', {
        parse_mode: 'HTML',
        ...keyboard
      });
      return;
    }

    // Отписываем пользователя
    const removed = wordScheduler.unsubscribeUser(userId);

    if (removed) {
      const keyboard = createMainKeyboard(false);
      await ctx.reply('❌ <b>Подписка отменена!</b>\nИспользуй кнопку ниже, чтобы возобновить обучение:', {
        parse_mode: 'HTML',
        ...keyboard
      });
    } else {
      await ctx.reply('❌ Ошибка при остановке получения слов');
    }
  };
};
