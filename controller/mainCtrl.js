const Students = require('../model/studentModel')
const jsonData = require('../lang.json')


const MainCtrl = {
  getLang: async (bot, chatId) => {
    try {
      await bot.sendMessage(chatId, 'Assalomu Aleykum \nTilni Tanlang', {
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'Uzbek',
              callback_data: 'lang uz'
            }],
            [{
              text: 'Rus',
              callback_data: 'lang ru'
            }]
          ]
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  getSuccess: async (chatId, contact, bot, text) => {
    try {
      if (text) {
        await Students.findOneAndUpdate({
          chatId
        }, {
          phone: text,
          step: 3
        })
      }
      if (contact) {
        await Students.findOneAndUpdate({
          chatId
        }, {
          phone: contact,
          step: 3
        })
      }
      const user = await Students.findOne({
        chatId
      })
      await bot.sendMessage(chatId, `Muvafaqiyatli bo'ldi\nIsm: ${user.name}\nGuruh: ${user.group}\nTelefon nomer: ${user.phone}`)
      // await bot.sendMessage(1329953638, `Shu user ro'xyatdan o'tdi\nIsm: ${user.name}\nGuruh: ${user.group}\nTelefon nomer: ${user.phone}`)
      await bot.sendMessage(chatId, jsonData.end[`${user.langs}`], {
        reply_markup: {
          remove_keyboard: true
        }
      })
      await bot.sendMessage(chatId, "https://youtu.be/AdXDaN0mqTk")
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MainCtrl