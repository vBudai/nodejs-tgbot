const TelegramApi = require('node-telegram-bot-api');
const { exit } = require('process');
const {gameOptions, againOptions} = require('./options.js')

require('./token.js')

const bot = new TelegramApi(token, {polling: true})

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадываю - ты угадываешь', gameOptions);
    const randomNumber = Math.floor( Math.random() * 10 );
    chats[chatId] = randomNumber;
}

const start = async () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало'},
        {command: '/info', description: 'Информация об игре'},
        {command: '/game', description: 'Играть'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        switch(text){
            case '/start':
                return bot.sendMessage(chatId, 'Добро пожаловать в игру «Угадай цифру»!');
                
            case '/info':
                return bot.sendMessage(chatId, 'В данной игре бот загадывает число от 0 до 9\n',
                                        '\tТебе предстоит его отгадать!\n',
                                        '\tУдачи :)');

            case '/game':
                return startGame(chatId);

            default:
                return bot.sendMessage(chatId, 'Ничего не понял, но очень интересно');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId);
        }
        if(data == chats[chatId]){
            return bot.sendMessage(chatId, `Молодец, ты отгадал цифру ${data}`, againOptions)
        }
        else{
            return bot.sendMessage(chatId, `Молодец, ты не отгадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();