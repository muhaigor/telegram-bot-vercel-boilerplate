// Конфигурация бота
// ВАЖНО: Не коммитьте этот файл в git с реальными токенами!

export const config = {
  // Замените на ваш реальный токен бота
  BOT_TOKEN: '7325353221:AAEta0uc1hlRSOEDiIsvYkBwbgza7Y-oPlM',
  
  // Окружение - для Vercel всегда production
  NODE_ENV: 'production' as const,
  
  // Другие настройки
  DEBUG: false,
};

// Типы для TypeScript
export type Config = typeof config;
