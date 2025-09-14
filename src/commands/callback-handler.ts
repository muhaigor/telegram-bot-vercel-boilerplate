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
          if (wordScheduler.isUserSubscribed(userId)) {
            await ctx.editMessageText(
              '✅ <b>Вы уже подписаны!</b>\n' +
              'Слова приходят автоматически каждые 15 секунд.\n' +
              'Учись легко и каждый день! 💪',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(true)
              }
            );
          } else {
            wordScheduler.subscribeUser(userId, chatId, ctx);
            await ctx.editMessageText(
              '✅ <b>Подписка активирована!</b>\n' +
              'Сейчас пришлю первое слово, а затем каждые 15 секунд буду присылать новые автоматически!\n' +
              'Учись легко и каждый день! 💪',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(true)
              }
            );
          }
          break;

        case 'stop':
          if (!wordScheduler.isUserSubscribed(userId)) {
            await ctx.editMessageText(
              '❌ <b>Вы не подписаны!</b>\n' +
              'Нажми "Подписаться", чтобы начать получать слова.',
              { 
                parse_mode: 'HTML',
                ...createMainKeyboard(false)
              }
            );
          } else {
            wordScheduler.unsubscribeUser(userId);
            await ctx.editMessageText(
              '❌ <b>Подписка отменена!</b>\n' +
              'Нажми "Подписаться", чтобы продолжить обучение.',
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
          const isUserSubscribed = wordScheduler.isUserSubscribed(userId);
          
          await ctx.editMessageText(
            `📊 <b>Статистика:</b>\n\n` +
            `📚 Слов в базе: <b>${totalWords}</b>\n` +
            `👥 Подписанных: <b>${stats.subscribedUsers}</b>\n` +
            `⏰ Интервал: <b>15 секунд</b>\n` +
            `🔄 Ваш статус: <b>${isUserSubscribed ? 'Подписан' : 'Не подписан'}</b>`,
            { 
              parse_mode: 'HTML',
              ...createStatsKeyboard()
            }
          );
          break;

        case 'menu':
          const isSubscribed = wordScheduler.isUserSubscribed(userId);
          const status = isSubscribed ? '✅ подписан' : '❌ не подписан';
          
          await ctx.editMessageText(
            `🎛️ <b>Меню</b>\n\n` +
            `📡 Статус: <b>${status}</b>\n` +
            `Выбери действие:`,
            { 
              parse_mode: 'HTML',
              ...createMenuKeyboard(isSubscribed)
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
