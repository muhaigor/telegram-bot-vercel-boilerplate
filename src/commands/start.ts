import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';

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
      await ctx.reply('✅ Вы уже получаете немецкие слова! Используйте /stop чтобы остановить.');
      return;
    }

    // Добавляем пользователя в расписание
    wordScheduler.addUser(userId, chatId, ctx);

    const welcomeMessage = `
🇩🇪 <b>Добро пожаловать в бота для изучения немецкого языка!</b>

📚 Теперь вы будете получать немецкие слова с переводом каждые 10 секунд.

<b>Доступные команды:</b>
/start - Начать получение слов
/stop - Остановить получение слов
/test - Получить тестовое слово
/stats - Статистика бота
/help - Помощь

Удачи в изучении немецкого! 🚀
    `;

    await ctx.reply(welcomeMessage, { parse_mode: 'HTML' });
  };
};
