const TOKEN = "5830692250:AAGGB7iCFG0fvujDZVVTK4O4Ky6KnGNjm6A"
const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const express = require('express')
const studentCtrl = require('./controller/studentCtrl')
const studentModel = require('./model/studentModel')
const jsonData = require('./lang.json')
const MainCtrl = require('./controller/mainCtrl')
const app = express()
const URL = 'mongodb://0.0.0.0:27017/student'
const adminChatId = '1329953638'

app.listen(5000, () => {
  console.log('Listening')
})

mongoose.connect(URL, {
  useNewUrlParser: true
}, err => {
  if (err) {
    throw err
  }
  console.log("Conected")
})



const bot = new TelegramBot(TOKEN, {
  polling: true
})



bot.on('message', async msg => {


  const text = msg.text
  const chatId = msg.chat.id
  const user = await studentModel.findOne({
    chatId
  })
  if (!user) {
    studentCtrl.create(chatId)
    MainCtrl.getLang(bot, chatId)
    return
  }
  const step = user.step

  if (text === '/start') {
    await studentModel.findOneAndUpdate({
      chatId
    }, {
      step: 0
    })
    MainCtrl.getLang(bot, chatId)
  }
  if (text !== '/start') {
    switch (step) {
      case 0: {
        studentCtrl.getStudentGroupName(chatId, text, bot, user.langs)
        break
      }
      case 1: {
        studentCtrl.getStudentGroupName(chatId, text, bot, user.langs)
        break
      }
      case 2: {
        if (text) {
          MainCtrl.getSuccess(chatId, text, bot)
          break
        }
        const contact = msg.contact.phone_number
        if (contact) {
          MainCtrl.getSuccess(chatId, contact, bot)
          break
        }

      }

    }
  }




})
bot.addListener("callback_query", async (query) => {
  const queryText = query.data.split(" ")[0]
  const data = query.data.split(" ")[1]
  const chatId = query.message.chat.id
  const user = await studentModel.findOne({
    chatId
  })
  if (!user) {
    studentCtrl.create(chatId)
    MainCtrl.getLang(bot, chatId)
    return
  }
  const step = user.step

  if (queryText === "lang") {
    await studentModel.findOneAndUpdate({
      chatId
    }, {
      langs: data
    })
    console.log(data);

    await bot.sendMessage(chatId, jsonData.name[`${data}`])
    bot.deleteMessage(chatId, query.message.message_id);


  } else
  if (queryText === "group") {
    await studentModel.findOneAndUpdate({
      chatId
    }, {
      group: data,
      step: 2
    })
    await bot.sendMessage(chatId, jsonData.phoneNumber[`${user.langs}`], {
      reply_markup: {
        keyboard: [
          [{
            text: jsonData.contact[user.langs],
            request_contact: true
          }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      }
    })
    bot.deleteMessage(chatId, query.message.message_id);
  }
})