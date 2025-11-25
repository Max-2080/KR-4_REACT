// App.js
import React, { useState, useRef, useEffect } from 'react';

// Компонент для отображения сообщений
const Message = ({ text, isUser }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {text}
      </div>
      <div className="message-time">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

// Компонент индикатора набора текста
const TypingIndicator = () => {
  return (
    <div className="message bot-message typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

// Основной компонент приложения
const App = () => {
  // Состояние для хранения списка сообщений
  const [messages, setMessages] = useState([]);
  // Состояние для текущего вводимого текста
  const [inputText, setInputText] = useState('');
  // Состояние для индикатора набора текста ботом
  const [isTyping, setIsTyping] = useState(false);
  // Ref для автоматической прокрутки к новым сообщениям
  const messagesEndRef = useRef(null);

  // Функция для прокрутки к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Эффект для прокрутки при изменении сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Функция для генерации ответа бота
  const generateBotResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    // Простые правила ответов на основе ключевых слов
    if (lowerCaseMessage.includes('привет') || lowerCaseMessage.includes('здравствуй')) {
      return 'Привет! Рад вас видеть! Чем могу помочь?';
    } else if (lowerCaseMessage.includes('как дела') || lowerCaseMessage.includes('как ты')) {
      return 'У меня всё прекрасно! Я всего лишь программа, но стараюсь быть полезным. А у вас?';
    } else if (lowerCaseMessage.includes('пока') || lowerCaseMessage.includes('до свидания')) {
      return 'До свидания! Буду рад пообщаться снова!';
    } else if (lowerCaseMessage.includes('спасибо')) {
      return 'Всегда пожалуйста! Обращайтесь, если понадобится помощь.';
    } else if (lowerCaseMessage.includes('имя') || lowerCaseMessage.includes('зовут')) {
      return 'Меня зовут Ботти! Я ваш виртуальный помощник.';
    } else if (lowerCaseMessage.includes('погода')) {
      return 'К сожалению, я не имею доступа к данным о погоде. Но за окном всегда хорошая погода для общения!';
    } else if (lowerCaseMessage.includes('время')) {
      return `Сейчас ${new Date().toLocaleTimeString()}. Время летит, когда интересно общаешься!`;
    } else if (lowerCaseMessage.includes('помощь') || lowerCaseMessage.includes('команды')) {
      return 'Я могу ответить на вопросы о погоде, времени, рассказать о себе. Просто напишите что-нибудь!';
    } else if (lowerCaseMessage.includes('шутка') || lowerCaseMessage.includes('анекдот')) {
      const jokes = [
        'Почему программисты путают Хэллоуин и Рождество? Потому что Oct 31 = Dec 25!',
        'Как называется утка-программист? Duck-type!',
        'Почему Python не мог завести себе девушку? Потому что у него не было класса!'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else {
      // Случайные ответы для неизвестных запросов
      const randomResponses = [
        'Интересный вопрос! К сожалению, мои знания ограничены.',
        'Понял вас. Можете рассказать об этом подробнее?',
        'Извините, я еще учусь. Можете переформулировать вопрос?',
        'Спасибо за сообщение! Я становлюсь умнее с каждым вашим вопросом.',
        'Записал ваш запрос. В будущем я смогу давать более точные ответы!',
        'Это выходит за рамки моих текущих возможностей, но я работаю над улучшением!',
        'Интересно! А что вы сами думаете по этому поводу?'
      ];
      return randomResponses[Math.floor(Math.random() * randomResponses.length)];
    }
  };

  // Функция обработки отправки сообщения
  const handleSendMessage = () => {
    // Проверяем, что сообщение не пустое
    if (inputText.trim() === '') return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Имитируем задержку ответа бота
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  // Обработчик нажатия клавиш
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Эффект для первоначального сообщения бота
  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: 'Привет! Я Бот - ваш виртуальный помощник. Спросите меня о чем угодно!',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="app">
      <div className="chat-container">
        {/* Заголовок чата */}
        <div className="chat-header">
          <div className="bot-avatar">
            <span>🤖</span>
          </div>
          <div className="chat-info">
            <h2>Ботти</h2>
            <p>Виртуальный помощник</p>
          </div>
          <div className="status-indicator online"></div>
        </div>

        {/* Область сообщений */}
        <div className="messages-container">
          {messages.map(message => (
            <Message
              key={message.id}
              text={message.text}
              isUser={message.isUser}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Панель ввода сообщения */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваше сообщение..."
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputText.trim() === ''}
              className="send-button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
