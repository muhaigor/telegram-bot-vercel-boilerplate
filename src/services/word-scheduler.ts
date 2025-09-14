import { Context, Telegraf } from 'telegraf';
import { getRandomWord, GermanWord } from '../data/german-words';

// Интерфейс для подписанного пользователя
interface SubscribedUser {
  userId: number;
  chatId: number;
  isActive: boolean;
}

// Класс для управления расписанием отправки слов
export class WordScheduler {
  private subscribedUsers: Map<number, SubscribedUser> = new Map();
  private readonly intervalMs: number = 15000; // 15 секунд
  private globalIntervalId: NodeJS.Timeout | null = null;
  private bot: Telegraf | null = null;

  // Инициализировать бота и запустить глобальный таймер
  public initialize(bot: Telegraf): void {
    this.bot = bot;
    this.startGlobalTimer();
    console.log('WordScheduler инициализирован, глобальный таймер запущен');
  }

  // Запустить глобальный таймер для отправки слов всем подписанным пользователям
  private startGlobalTimer(): void {
    if (this.globalIntervalId) {
      clearInterval(this.globalIntervalId);
    }

    this.globalIntervalId = setInterval(async () => {
      await this.sendWordsToAllSubscribers();
    }, this.intervalMs);

    console.log(`Глобальный таймер запущен с интервалом ${this.intervalMs}мс`);
  }

  // Отправить слова всем подписанным пользователям
  private async sendWordsToAllSubscribers(): Promise<void> {
    if (!this.bot) return;

    const word = getRandomWord();
    const message = this.formatWordMessage(word);

    for (const [userId, user] of this.subscribedUsers) {
      if (user.isActive) {
        try {
          await this.bot.telegram.sendMessage(user.chatId, message, { parse_mode: 'HTML' });
        } catch (error) {
          console.error(`Ошибка отправки слова пользователю ${userId}:`, error);
          // При ошибке отправки отписываем пользователя
          this.unsubscribeUser(userId);
        }
      }
    }
  }

  // Подписать пользователя на получение слов
  public subscribeUser(userId: number, chatId: number, ctx: Context): void {
    // Отправляем первое слово сразу
    this.sendFirstWord(ctx);

    this.subscribedUsers.set(userId, {
      userId,
      chatId,
      isActive: true
    });

    console.log(`Пользователь ${userId} подписан на получение слов`);
  }

  // Отписать пользователя от получения слов
  public unsubscribeUser(userId: number): boolean {
    const user = this.subscribedUsers.get(userId);
    if (user) {
      this.subscribedUsers.delete(userId);
      console.log(`Пользователь ${userId} отписан от получения слов`);
      return true;
    }
    return false;
  }

  // Проверить, подписан ли пользователь
  public isUserSubscribed(userId: number): boolean {
    const user = this.subscribedUsers.get(userId);
    return user ? user.isActive : false;
  }

  // Получить количество подписанных пользователей
  public getSubscribedUsersCount(): number {
    return this.subscribedUsers.size;
  }

  // Остановить глобальный таймер и очистить всех пользователей
  public stopAll(): void {
    if (this.globalIntervalId) {
      clearInterval(this.globalIntervalId);
      this.globalIntervalId = null;
    }
    this.subscribedUsers.clear();
    console.log('Глобальный таймер остановлен, все пользователи отписаны');
  }

  // Отправить первое слово сразу при запуске
  private async sendFirstWord(ctx: Context): Promise<void> {
    try {
      const word = getRandomWord();
      const message = `🎯 <b>Первое слово:</b>\n\n${this.formatWordMessage(word)}`;
      await ctx.reply(message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error('Ошибка отправки первого слова:', error);
    }
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
  public getStats(): { subscribedUsers: number; intervalMs: number } {
    return {
      subscribedUsers: this.subscribedUsers.size,
      intervalMs: this.intervalMs
    };
  }
}

// Создаем единственный экземпляр сервиса
export const wordScheduler = new WordScheduler();
