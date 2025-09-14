import { Context } from 'telegraf';
import { wordScheduler } from '../services/word-scheduler';

export const test = () => {
  return async (ctx: Context) => {
    try {
      await wordScheduler.sendTestWord(ctx);
    } catch (error) {
      console.error('Ошибка отправки тестового слова:', error);
      await ctx.reply('❌ Ошибка при отправке тестового слова');
    }
  };
};
