import { Context } from 'telegraf';
import { getRandomWord, GermanWord } from '../data/german-words';

// Интерфейс для активного пользователя
interface ActiveUser {
  userId: number;
  chatId: number;
  intervalId: NodeJS.Timeout;
  isActive: boolean;
}

// Класс для управления расписанием отправки слов
export class WordScheduler {
  private activeUsers: Map<number, ActiveUser> = new Map();
  private readonly intervalMs: number = 10000; // 10 секунд

  // Добавить пользователя в расписание
  public addUser(userId: number, chatId: number, ctx: Context): void {
    // Если пользователь уже активен, сначала остановить его
    this.removeUser(userId);

    const intervalId = setInterval(async () => {
      try {
        const word = getRandomWord();
        await this.sendWordMessage(ctx, word);
      } catch (error) {
        console.error(`Ошибка отправки слова пользователю ${userId}:`, error);
        // При ошибке отправки удаляем пользователя из расписания
        this.removeUser(userId);
      }
    }, this.intervalMs);

    this.activeUsers.set(userId, {
      userId,
      chatId,
      intervalId,
      isActive: true
    });

    console.log(`Пользователь ${userId} добавлен в расписание отправки слов`);
  }

  // Удалить пользователя из расписания
  public removeUser(userId: number): boolean {
    const user = this.activeUsers.get(userId);
    if (user) {
      clearInterval(user.intervalId);
      this.activeUsers.delete(userId);
      console.log(`Пользователь ${userId} удален из расписания`);
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

  // Остановить всех пользователей
  public stopAll(): void {
    this.activeUsers.forEach((user) => {
      clearInterval(user.intervalId);
    });
    this.activeUsers.clear();
    console.log('Все пользователи удалены из расписания');
  }

  // Отправить сообщение со словом
  private async sendWordMessage(ctx: Context, word: GermanWord): Promise<void> {
    const message = this.formatWordMessage(word);
    await ctx.reply(message, { parse_mode: 'HTML' });
  }

  // Форматировать сообщение со словом
  private formatWordMessage(word: GermanWord): string {
    let message = `🇩🇪 <b>${word.german}</b>\n`;
    message += `🇷🇺 <i>${word.russian}</i>\n`;
    
    if (word.pronunciation) {
      message += `🔊 [${word.pronunciation}]\n`;
    }
    
    if (word.category) {
      message += `📂 ${word.category}`;
    }

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
