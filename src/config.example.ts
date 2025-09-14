// Пример конфигурации бота
// Скопируйте этот файл в config.ts и замените значения на реальные

export const config = {
  // Замените на ваш реальный токен бота от @BotFather
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
  
  // Окружение - для Vercel всегда production
  NODE_ENV: 'production' as const,
  
  // Другие настройки
  DEBUG: false,
};

// Типы для TypeScript
export type Config = typeof config;
