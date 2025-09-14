// api/webhook.js
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Привет! Я бот для изучения немецких слов.'));
bot.help((ctx) => ctx.reply('Используй /start'));

export default async function handler(req, res) {
  return bot.handleUpdate(req.body, res);
}