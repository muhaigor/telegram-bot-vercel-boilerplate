import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';

export const stats = () => {
  return async (ctx: Context) => {
    const userId = ctx.from?.id;
    const stats = wordScheduler.getStats();
    const isUserActive = userId ? wordScheduler.isUserActive(userId) : false;

    const statsMessage = `
📊 <b>Статистика бота</b>

👥 Активных пользователей: <b>${stats.activeUsers}</b>
⏱️ Интервал отправки: <b>${stats.intervalMs / 1000} секунд</b>
🔄 Ваш статус: <b>${isUserActive ? 'Активен' : 'Неактивен'}</b>

${isUserActive 
  ? '✅ Вы получаете немецкие слова' 
  : 'ℹ️ Используйте /start чтобы начать получать слова'
}
    `;

    await ctx.reply(statsMessage, { parse_mode: 'HTML' });
  };
};
