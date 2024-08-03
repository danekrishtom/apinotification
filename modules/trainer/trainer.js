const express = require("express");
var async = require("async");
const Router = express.Router();
const schedule = require('node-schedule');
const service = require("../../services/notification");
const dbcontext = require("./DB");

//REMINDER VC SCHEDULER START
Router.post("/sendTrainerVCNotification", async function (req, res) {
    try {
        let tasks = req.body.task_list;
        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                const timeString = tasks[i].notification_to_time;
                const [hourStr, minuteStr, secondStr] = timeString.split(":");
                const specificDate = tasks[i].notificationdate;
                specificDate.setHours(hourStr);
                specificDate.setMinutes(minuteStr);
                specificDate.setSeconds(secondStr);
                const scheduleDate = specificDate;
                const task = tasks[i];
                schedule.scheduleJob(scheduleDate, () => service.sendPushNotification(task.deviceToken, task.msg, task.title, task.notification_to_time));
                schedule.scheduleJob(scheduleDate, () => service.sendMailNotification(task.toMail, task.name, "Reminder VC", task.msg, task.language, task.mobile_no));
                schedule.scheduleJob(scheduleDate, () => service.sendSMSNotification(task.cc_code, task.mobile_no, task.msg, task.language));
                schedule.scheduleJob(scheduleDate, () => dbcontext.insertReminderVCRecordForTrainer(task.VC_id));
            }
            return res.send({ status: 200, msg: "Notification Scheduled Successfully.", data: [] })
        } else {
            return res.send({ status: 200, msg: "No Notification To Schedule.", data: [] })
        }
    } catch (err) {
        return res.send({ status: 500, msg: "Notification Scheduled Failed.", data: [] });
    }
});
//REMINDER VC SCHEDULER END

module.exports = Router;
