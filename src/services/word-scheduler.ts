import { Context, Telegraf } from 'telegraf';
import { getRandomWord, GermanWord } from '../data/german-words';

// Интерфейс для активного пользователя
interface ActiveUser {
  userId: number;
  chatId: number;
  isActive: boolean;
}

// Класс для управления расписанием отправки слов
export class WordScheduler {
  private activeUsers: Map<number, ActiveUser> = new Map();
  private readonly intervalMs: number = 10000; // 10 секунд для тестирования
  private globalIntervalId: NodeJS.Timeout | null = null;
  private bot: Telegraf | null = null;

  // Инициализировать бота
  public initialize(bot: Telegraf): void {
    this.bot = bot;
    console.log('🚀 WordScheduler инициализирован');
  }

  // Запустить глобальный таймер для отправки слов всем активным пользователям
  private startGlobalTimer(): void {
    if (this.globalIntervalId) {
      clearInterval(this.globalIntervalId);
    }

    this.globalIntervalId = setInterval(async () => {
      console.log('⏰ Таймер сработал, отправляем слова...');
      await this.sendWordsToAllActiveUsers();
    }, this.intervalMs);

    console.log(`⏰ Глобальный таймер запущен с интервалом ${this.intervalMs}мс (${this.intervalMs/1000} секунд)`);
  }

  // Отправить слова всем активным пользователям
  private async sendWordsToAllActiveUsers(): Promise<void> {
    console.log('🔍 Проверяем условия для отправки слов...');
    
    if (!this.bot) {
      console.log('❌ Бот не инициализирован');
      return;
    }
    
    if (this.activeUsers.size === 0) {
      console.log('ℹ️ Нет активных пользователей для отправки слов');
      return;
    }

    console.log(`📤 Отправляем слова ${this.activeUsers.size} активным пользователям`);
    console.log('👥 Активные пользователи:', Array.from(this.activeUsers.keys()));
    
    const word = getRandomWord();
    const message = this.formatWordMessage(word);
    console.log(`📝 Слово: ${word.ge} - ${word.ru}`);

    // Отправляем всем активным пользователям
    for (const [userId, user] of this.activeUsers) {
      if (user.isActive) {
        try {
          console.log(`📨 Отправляем слово пользователю ${userId} в чат ${user.chatId}`);
          await this.bot.telegram.sendMessage(user.chatId, message, { parse_mode: 'HTML' });
          console.log(`✅ Слово успешно отправлено пользователю ${userId}`);
        } catch (error) {
          console.error(`❌ Ошибка отправки в чат ${user.chatId}:`, error);
          // При ошибке отправки удаляем пользователя
          this.activeUsers.delete(userId);
          console.log(`🗑️ Пользователь ${userId} удален из активных из-за ошибки`);
        }
      } else {
        console.log(`⚠️ Пользователь ${userId} неактивен, пропускаем`);
      }
    }
  }

  // Добавить пользователя в активные
  public addUser(userId: number, chatId: number, ctx: Context): void {
    this.activeUsers.set(userId, {
      userId,
      chatId,
      isActive: true
    });

    console.log(`✅ Пользователь ${userId} добавлен в активные (всего активных: ${this.activeUsers.size})`);
    
    // Запускаем таймер только если это первый пользователь
    if (this.activeUsers.size === 1 && !this.globalIntervalId) {
      this.startGlobalTimer();
    }
  }

  // Удалить пользователя из активных
  public removeUser(userId: number): boolean {
    const user = this.activeUsers.get(userId);
    if (user) {
      this.activeUsers.delete(userId);
      console.log(`❌ Пользователь ${userId} удален из активных (осталось активных: ${this.activeUsers.size})`);
      
      // Останавливаем таймер если не осталось активных пользователей
      if (this.activeUsers.size === 0 && this.globalIntervalId) {
        clearInterval(this.globalIntervalId);
        this.globalIntervalId = null;
        console.log('⏹️ Таймер остановлен - нет активных пользователей');
      }
      
      return true;
    }
    return false;
  }

  // Проверить, активен ли пользователь
  public isUserActive(userId: number): boolean {
    const user = this.activeUsers.get(userId);
    return user ? user.isActive : false;
  }

  // Получить количество активных пользователей
  public getActiveUsersCount(): number {
    return this.activeUsers.size;
  }

  // Остановить глобальный таймер и очистить всех пользователей
  public stopAll(): void {
    if (this.globalIntervalId) {
      clearInterval(this.globalIntervalId);
      this.globalIntervalId = null;
    }
    this.activeUsers.clear();
    console.log('Глобальный таймер остановлен, все пользователи удалены');
  }

  // Отправить сообщение со словом
  private async sendWordMessage(ctx: Context, word: GermanWord): Promise<void> {
    const message = this.formatWordMessage(word);
    await ctx.reply(message, { parse_mode: 'HTML' });
  }

  // Форматировать сообщение со словом
  private formatWordMessage(word: GermanWord): string {
    let message = `🇩🇪 <b>${word.ge}</b>\n`;
    message += `🇷🇺 <i>${word.ru}</i>`;

    return message;
  }

  // Отправить тестовое слово пользователю
  public async sendTestWord(ctx: Context): Promise<void> {
    const word = getRandomWord();
    const message = this.formatWordMessage(word);
    await ctx.reply(`📚 <b>Тестовое слово:</b>\n\n${message}`, { parse_mode: 'HTML' });
  }

  // Получить статистику
  public getStats(): { activeUsers: number; intervalMs: number } {
    return {
      activeUsers: this.activeUsers.size,
      intervalMs: this.intervalMs
    };
  }
}

// Создаем единственный экземпляр сервиса
export const wordScheduler = new WordScheduler();
