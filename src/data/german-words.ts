// Словарь немецких слов с переводами на русский
export interface GermanWord {
  german: string;
  russian: string;
  pronunciation?: string;
  category?: string;
}

export const germanWords: GermanWord[] = [
  // Основные слова
  { german: "Haus", russian: "дом", pronunciation: "хаус", category: "жилье" },
  { german: "Wasser", russian: "вода", pronunciation: "вассер", category: "природа" },
  { german: "Brot", russian: "хлеб", pronunciation: "брот", category: "еда" },
  { german: "Mutter", russian: "мать", pronunciation: "муттер", category: "семья" },
  { german: "Vater", russian: "отец", pronunciation: "фатер", category: "семья" },
  { german: "Kind", russian: "ребенок", pronunciation: "кинт", category: "семья" },
  { german: "Freund", russian: "друг", pronunciation: "фройнд", category: "люди" },
  { german: "Zeit", russian: "время", pronunciation: "цайт", category: "время" },
  { german: "Tag", russian: "день", pronunciation: "так", category: "время" },
  { german: "Nacht", russian: "ночь", pronunciation: "нахт", category: "время" },
  
  // Цвета
  { german: "rot", russian: "красный", pronunciation: "рот", category: "цвета" },
  { german: "blau", russian: "синий", pronunciation: "блау", category: "цвета" },
  { german: "grün", russian: "зеленый", pronunciation: "грюн", category: "цвета" },
  { german: "gelb", russian: "желтый", pronunciation: "гельб", category: "цвета" },
  { german: "schwarz", russian: "черный", pronunciation: "шварц", category: "цвета" },
  { german: "weiß", russian: "белый", pronunciation: "вайс", category: "цвета" },
  
  // Животные
  { german: "Hund", russian: "собака", pronunciation: "хунт", category: "животные" },
  { german: "Katze", russian: "кошка", pronunciation: "катце", category: "животные" },
  { german: "Pferd", russian: "лошадь", pronunciation: "пферт", category: "животные" },
  { german: "Vogel", russian: "птица", pronunciation: "фогель", category: "животные" },
  { german: "Fisch", russian: "рыба", pronunciation: "фиш", category: "животные" },
  
  // Еда
  { german: "Apfel", russian: "яблоко", pronunciation: "апфель", category: "еда" },
  { german: "Milch", russian: "молоко", pronunciation: "мильх", category: "еда" },
  { german: "Käse", russian: "сыр", pronunciation: "кэзе", category: "еда" },
  { german: "Fleisch", russian: "мясо", pronunciation: "флайш", category: "еда" },
  { german: "Reis", russian: "рис", pronunciation: "райс", category: "еда" },
  
  // Природа
  { german: "Baum", russian: "дерево", pronunciation: "баум", category: "природа" },
  { german: "Blume", russian: "цветок", pronunciation: "блюме", category: "природа" },
  { german: "Sonne", russian: "солнце", pronunciation: "зонне", category: "природа" },
  { german: "Mond", russian: "луна", pronunciation: "монт", category: "природа" },
  { german: "Stern", russian: "звезда", pronunciation: "штерн", category: "природа" },
  
  // Действия
  { german: "gehen", russian: "идти", pronunciation: "геен", category: "действия" },
  { german: "kommen", russian: "приходить", pronunciation: "коммен", category: "действия" },
  { german: "sehen", russian: "видеть", pronunciation: "зеен", category: "действия" },
  { german: "hören", russian: "слышать", pronunciation: "хёрен", category: "действия" },
  { german: "sprechen", russian: "говорить", pronunciation: "шпрехен", category: "действия" },
  
  // Эмоции
  { german: "glücklich", russian: "счастливый", pronunciation: "глюклих", category: "эмоции" },
  { german: "traurig", russian: "грустный", pronunciation: "траурих", category: "эмоции" },
  { german: "müde", russian: "усталый", pronunciation: "мюде", category: "эмоции" },
  { german: "hungrig", russian: "голодный", pronunciation: "хунгрих", category: "эмоции" },
  { german: "durstig", russian: "жаждущий", pronunciation: "дурстих", category: "эмоции" },
  
  // Числа
  { german: "eins", russian: "один", pronunciation: "айнс", category: "числа" },
  { german: "zwei", russian: "два", pronunciation: "цвай", category: "числа" },
  { german: "drei", russian: "три", pronunciation: "драй", category: "числа" },
  { german: "vier", russian: "четыре", pronunciation: "фир", category: "числа" },
  { german: "fünf", russian: "пять", pronunciation: "фюнф", category: "числа" },
  
  // Дни недели
  { german: "Montag", russian: "понедельник", pronunciation: "монтак", category: "дни недели" },
  { german: "Dienstag", russian: "вторник", pronunciation: "динстак", category: "дни недели" },
  { german: "Mittwoch", russian: "среда", pronunciation: "митвох", category: "дни недели" },
  { german: "Donnerstag", russian: "четверг", pronunciation: "доннерстак", category: "дни недели" },
  { german: "Freitag", russian: "пятница", pronunciation: "фрайтак", category: "дни недели" },
  { german: "Samstag", russian: "суббота", pronunciation: "замстак", category: "дни недели" },
  { german: "Sonntag", russian: "воскресенье", pronunciation: "зонтак", category: "дни недели" }
];

// Функция для получения случайного слова
export const getRandomWord = (): GermanWord => {
  const randomIndex = Math.floor(Math.random() * germanWords.length);
  return germanWords[randomIndex];
};

// Функция для получения слова по категории
export const getWordByCategory = (category: string): GermanWord | null => {
  const wordsInCategory = germanWords.filter(word => word.category === category);
  if (wordsInCategory.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * wordsInCategory.length);
  return wordsInCategory[randomIndex];
};

// Функция для получения всех категорий
export const getCategories = (): string[] => {
  const categories = new Set(germanWords.map(word => word.category).filter((category): category is string => Boolean(category)));
  return Array.from(categories);
};
