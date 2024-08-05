const express = require("express");
var async = require("async");
const Router = express.Router();
const schedule = require('node-schedule');
const service = require("../../services/notification");
const dbcontext = require("./DB");

//REMINDER VC SCHEDULER START
Router.post("/sendTrainerVCNotification", async function (req, res) {
    try {
        let tasks = req.body.task;
        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                const timeString = tasks[i].notification_to_time;
                const [hourStr, minuteStr, secondStr] = timeString.split(":");
                const specificDate = new Date(tasks[i].notificationdate);
                specificDate.setHours(hourStr);
                specificDate.setMinutes(minuteStr);
                specificDate.setSeconds(secondStr);
                const scheduleDate = specificDate;
                const task = tasks[i];
                await schedule.scheduleJob(scheduleDate, async () => await getTrainerVCNotification(task));
                await schedule.scheduleJob(scheduleDate, async () => await dbcontext.insertReminderVCRecordForTrainer(task.VC_id));
            }
            return res.send({ status: 200, msg: "Notification Scheduled Successfully.", data: [] })
        } else {
            return res.send({ status: 200, msg: "No Notification To Schedule.", data: [] })
        }
    } catch (err) {
        return res.send({ status: 500, msg: "Notification Scheduled Failed.", data: [] });
    }
});

async function getTrainerVCNotification(task) {
    try {
        var response = await dbcontext.getReminderVCRecordForTrainer(task.VC_id);
        if (response.length > 0) {
            if (response[0].MemberMsg != null) {
                service.sendPushNotification(task.deviceToken, response[0].MemberMsg, task.title, task.notification_to_time);
                service.sendMailNotification(task.toMail, task.name, "Reminder VC", response[0].MemberMsg, response[0].MemberMsgLang, task.mobile_no);
                service.sendSMSNotification(task.cc_code, task.mobile_no, response[0].MemberMsg, response[0].MemberMsgLang);
            } else if (response[0].TrainerMsg != null) {
                service.sendPushNotification(task.deviceToken, response[0].TrainerMsg, task.title, task.notification_to_time);
                service.sendMailNotification(task.toMail, task.name, "Reminder VC", response[0].TrainerMsg, response[0].TrainerMsgLang, task.mobile_no);
                service.sendSMSNotification(task.cc_code, task.mobile_no, response[0].TrainerMsg, response[0].TrainerMsgLang);
            }
            return;
        }
    } catch (err) {
        return err;
    }
}
//REMINDER VC SCHEDULER END

module.exports = Router;
