import { Context, MiddlewareFn } from 'telegraf';

// Middleware для обработки ошибок
export const errorHandler: MiddlewareFn<Context> = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Ошибка в middleware:', error);
    
    // Отправляем пользователю сообщение об ошибке
    try {
      await ctx.reply('❌ Произошла ошибка. Попробуйте позже или обратитесь к администратору.');
    } catch (replyError) {
      console.error('Ошибка при отправке сообщения об ошибке:', replyError);
    }
  }
};

// Middleware для логирования команд
export const commandLogger: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username;
  const command = ctx.message && 'text' in ctx.message ? ctx.message.text : 'unknown';
  
  console.log(`Команда от пользователя ${userId} (@${username}): ${command}`);
  
  await next();
};

// Middleware для проверки активности пользователя
export const userActivityLogger: MiddlewareFn<Context> = async (ctx, next) => {
  const userId = ctx.from?.id;
  const username = ctx.from?.username;
  const chatId = ctx.chat?.id;
  
  if (userId) {
    console.log(`Активность пользователя ${userId} (@${username}) в чате ${chatId}`);
  }
  
  await next();
};
