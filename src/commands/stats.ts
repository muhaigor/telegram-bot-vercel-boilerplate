import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';
import { createStatsKeyboard } from '../services/inline-keyboard';
import { germanWords } from '../data/german-words';

export const stats = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;
    const stats = wordScheduler.getStats();
    const isUserSubscribed = userId ? wordScheduler.isUserSubscribed(userId) : false;
    const totalWords = germanWords.length;

    const statsMessage = `
📊 <b>Статистика бота:</b>

📚 Всего слов в базе: <b>${totalWords}</b>
👥 Подписанных пользователей: <b>${stats.subscribedUsers}</b>
⏰ Интервал отправки: <b>15 секунд</b>
🔄 Ваш статус: <b>${isUserSubscribed ? 'Подписан' : 'Не подписан'}</b>

Продолжай учиться! 🚀
    `;

    const keyboard = createStatsKeyboard();
    await ctx.reply(statsMessage, { 
      parse_mode: 'HTML',
      ...keyboard
    });
  };
};
