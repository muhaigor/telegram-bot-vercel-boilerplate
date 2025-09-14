import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';
import { createStatsKeyboard } from '../services/inline-keyboard';
import { germanWords } from '../data/german-words';

export const stats = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;
    const stats = wordScheduler.getStats();
    const isUserActive = userId ? wordScheduler.isUserActive(userId) : false;
    const totalWords = germanWords.length;

    const statsMessage = `
📊 <b>Статистика бота:</b>

📚 Всего слов в базе: <b>${totalWords}</b>
👥 Активных пользователей: <b>${stats.activeUsers}</b>
⏰ Интервал отправки: <b>2 минуты 40 секунд</b>

Продолжай учиться! 🚀
    `;

    const keyboard = createStatsKeyboard();
    await ctx.reply(statsMessage, { 
      parse_mode: 'HTML',
      ...keyboard
    });
  };
};
