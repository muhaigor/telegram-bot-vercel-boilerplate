import { Markup } from 'telegraf';

// Создание inline-кнопок для управления ботом
export const createMainKeyboard = (isActive: boolean) => {
  const buttons = [];
  
  if (isActive) {
    buttons.push([Markup.button.callback('🛑 Остановить рассылку', 'stop')]);
  } else {
    buttons.push([Markup.button.callback('▶️ Запустить рассылку', 'start')]);
  }
  
  buttons.push(
    [Markup.button.callback('📊 Статистика', 'stats')],
    [Markup.button.callback('🔄 Обновить меню', 'menu')]
  );
  
  return Markup.inlineKeyboard(buttons);
};

// Создание клавиатуры для статистики
export const createStatsKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('▶️ Запустить рассылку', 'start')],
    [Markup.button.callback('🛑 Остановить рассылку', 'stop')],
    [Markup.button.callback('🔄 Обновить меню', 'menu')]
  ]);
};

// Создание клавиатуры для меню
export const createMenuKeyboard = (isActive: boolean) => {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        isActive ? '🛑 Остановить' : '▶️ Запустить', 
        isActive ? 'stop' : 'start'
      )
    ],
    [Markup.button.callback('📊 Статистика', 'stats')]
  ]);
};
