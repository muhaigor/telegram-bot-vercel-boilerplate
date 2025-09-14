import { Telegraf } from 'telegraf';

import { about, start, stop, test, stats, help } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { config } from './config';
import { errorHandler, commandLogger, userActivityLogger } from './middleware';
import { wordScheduler } from './services/word-scheduler';

const BOT_TOKEN = config.BOT_TOKEN;
const ENVIRONMENT = config.NODE_ENV;

const bot = new Telegraf(BOT_TOKEN);

// Применяем middleware
bot.use(errorHandler);
bot.use(commandLogger);
bot.use(userActivityLogger);

// Регистрируем команды
bot.command('start', start());
bot.command('stop', stop());
bot.command('test', test());
bot.command('stats', stats());
bot.command('help', help());
bot.command('about', about());

// Обработчик для всех остальных сообщений
bot.on('message', greeting());

// Обработка завершения работы для очистки ресурсов
process.on('SIGINT', () => {
  console.log('Получен сигнал SIGINT, останавливаем бота...');
  wordScheduler.stopAll();
  bot.stop('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM, останавливаем бота...');
  wordScheduler.stopAll();
  bot.stop('SIGTERM');
  process.exit(0);
});

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
