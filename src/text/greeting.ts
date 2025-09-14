import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string, options?: any) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
    ...options,
  });

const greeting = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

  const messageId = ctx.message?.message_id;
  const userName = ctx.message?.from.first_name || 'друг';

  if (messageId) {
    const greetingMessage = `
🇩🇪 Привет, ${userName}! 

Я бот для изучения немецкого языка. Я автоматически отправляю немецкие слова с переводом каждые 15 секунд всем подписанным пользователям!

<b>Используйте команды:</b>
/start - Подписаться на получение слов
/stop - Отписаться от получения слов
/help - Помощь
/test - Тестовое слово
    `;
    
    await replyToMessage(ctx, messageId, greetingMessage, { parse_mode: 'HTML' });
  }
};

export { greeting };
