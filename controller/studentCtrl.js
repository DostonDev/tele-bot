const Students = require('../model/studentModel')
const jsonData = require('../lang.json')

const studentCtrl = {
  create: async (chatId) => {
    try {
      const student = new Students({
        chatId: chatId
      })
      await student.save()
    } catch (error) {
      console.log(error)
    }
  },
  getStudentGroupName: async (chatId, text, bot, lang) => {
    try {
      await Students.findOneAndUpdate({
        chatId
      }, {
        name: text,
        step: 1
      })
      await bot.sendMessage(chatId, jsonData.group[`${lang}`], {
        reply_markup: {
          inline_keyboard: [
            [{
              text: "5",
              callback_data: "group 5"
            }, {
              text: "6",
              callback_data: "group 6"
            }],
            [{
              text: "7",
              callback_data: "group 7"
            }, {
              text: "8",
              callback_data: "group 8"
            }],
          ]
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = studentCtrl