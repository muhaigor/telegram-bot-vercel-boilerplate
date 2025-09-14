import requests
import random
import os

# 🔐 Токен из переменных окружения
TOKEN = os.getenv('BOT_TOKEN', '7325353221:AAEta0uc1hlRSOEDiIsvYkBwbgza7Y-oPlM')

# База слов: немецкое слово → русский перевод
GERMAN_WORDS = [
  {"ge": "riechen", "ru": "нюхать"},
  {"ge": "der geruch", "ru": "запах"},
  {"ge": "würde", "ru": "бы"},
  {"ge": "der ellenbogen", "ru": "локоть"},
  {"ge": "das ist verkehrt", "ru": "это неправильно"},
  {"ge": "damit", "ru": "с этим  что бы"},
  {"ge": "werfen", "ru": "кидать"},
  {"ge": "dringend", "ru": "срочно"},
  {"ge": "angenehm", "ru": "приятный"},
  {"ge": "froh", "ru": "радостный"},
  {"ge": "prima", "ru": "отличный"},
  {"ge": "komisch", "ru": "странный"},
  {"ge": "witzig", "ru": "смешной"},
  {"ge": "ruhig", "ru": "спокойный"},
  {"ge": "sicher", "ru": "уверенный"},
  {"ge": "verrückt", "ru": "сумасшедший"},
  {"ge": "schlau", "ru": "умный"},
  {"ge": "fleißig", "ru": "трудолюбивый"},
  {"ge": "faul", "ru": "ленивый"},
  {"ge": "vorsicht", "ru": "осторожно"}
]

# Список активных чатов (в реальном проекте это должно быть в базе данных)
active_chats = set()

def send_word_to_chat(chat_id):
    """Отправить слово в конкретный чат"""
    word_dict = random.choice(GERMAN_WORDS)
    german_word = word_dict["ge"]
    russian_translation = word_dict["ru"]
    message = f"🇩🇪 <b>{german_word}</b>\n🇷🇺 <i>{russian_translation}</i>"
    
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print(f"✅ Слово отправлено в чат {chat_id}")
            return True
        else:
            print(f"❌ Ошибка отправки в чат {chat_id}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Ошибка отправки в чат {chat_id}: {e}")
        return False

def handler(request):
    """Обработчик для отправки слов"""
    if request.method == "POST":
        try:
            data = request.get_json()
            chat_id = data.get('chat_id')
            
            if chat_id:
                success = send_word_to_chat(chat_id)
                return {"statusCode": 200, "body": {"success": success}}
            else:
                return {"statusCode": 400, "body": {"error": "chat_id required"}}
                
        except Exception as e:
            print(f"Ошибка в send_words handler: {e}")
            return {"statusCode": 500, "body": {"error": str(e)}}
    
    return {"statusCode": 200, "body": "OK"}
