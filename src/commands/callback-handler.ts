import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';
import { createMainKeyboard, createStatsKeyboard, createMenuKeyboard } from '../services/inline-keyboard';
import { germanWords } from '../data/german-words';

export const callbackHandler = () => {
  return async (ctx: Context) => {
    const query = ctx.callbackQuery;
    if (!query || !('data' in query)) return;

    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;
    const data = query.data;

    if (!userId || !chatId) {
      await ctx.answerCbQuery('❌ Ошибка: не удалось определить пользователя');
      return;
    }

    await ctx.answerCbQuery();

    try {
      switch (data) {
        case 'start':
          if (wordScheduler.isUserActive(userId)) {
            await ctx.editMessageText(
              '✅ <b>Рассылка уже запущена!</b>\n' +
              'Сейчас пришлю первое слово, а затем каждые 15 секунд буду присылать новые.\n' +
              'Учись легко и каждый день! 💪',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(true)
              }
            );
          } else {
            wordScheduler.addUser(userId, chatId, ctx);
            await ctx.editMessageText(
              '✅ <b>Рассылка запущена!</b>\n' +
              'Сейчас пришлю первое слово, а затем каждые 15 секунд буду присылать новые.\n' +
              'Учись легко и каждый день! 💪',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(true)
              }
            );
          }
          break;

        case 'stop':
          if (!wordScheduler.isUserActive(userId)) {
            await ctx.editMessageText(
              '❌ <b>Рассылка уже остановлена!</b>\n' +
              'Нажми "Запустить", чтобы продолжить обучение.',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(false)
              }
            );
          } else {
            wordScheduler.removeUser(userId);
            await ctx.editMessageText(
              '❌ <b>Рассылка остановлена!</b>\n' +
              'Нажми "Запустить", чтобы продолжить обучение.',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(false)
              }
            );
          }
          break;

        case 'stats':
          const stats = wordScheduler.getStats();
          const totalWords = germanWords.length;
          const isUserActive = wordScheduler.isUserActive(userId);
          
          await ctx.editMessageText(
            `📊 <b>Статистика:</b>\n\n` +
            `📚 Слов в базе: <b>${totalWords}</b>\n` +
            `👥 Активных: <b>${stats.activeUsers}</b>\n` +
            `⏰ Интервал: <b>15 секунд</b>\n` +
            `🔄 Ваш статус: <b>${isUserActive ? 'Активен' : 'Неактивен'}</b>`,
            { 
              parse_mode: 'HTML',
              ...createStatsKeyboard()
            }
          );
          break;

        case 'menu':
          const isActive = wordScheduler.isUserActive(userId);
          const status = isActive ? '✅ активна' : '❌ остановлена';
          
          await ctx.editMessageText(
            `🎛️ <b>Меню</b>\n\n` +
            `📡 Статус: <b>${status}</b>\n` +
            `Выбери действие:`,
            { 
              parse_mode: 'HTML',
              ...createMenuKeyboard(isActive)
            }
          );
          break;

        default:
          await ctx.answerCbQuery('❌ Неизвестная команда');
      }
    } catch (error) {
      console.error('Ошибка в callback handler:', error);
      await ctx.answerCbQuery('❌ Произошла ошибка');
    }
  };
};
