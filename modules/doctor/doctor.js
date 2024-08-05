const express = require("express");
var async = require("async");
const Router = express.Router();
const schedule = require('node-schedule');
const common = require("../../services/common");
const service = require("../../services/notification");
const dbcontext = require("./DB");

//TODAY BOOKING SCHEDULER START
Router.post("/sendDoctorTodayBookingNotification", async function (req, res) {
    try {
        let tasks = req.body.task;
        if (tasks != null && tasks != undefined && tasks != '') {
            let convertedDate = '';
            if (tasks.bookDate != '' && tasks.bookDate != null && tasks.bookTime != '' && tasks.bookTime != null) {
                const timeString = tasks.bookTime;
                const [hourStr, minuteStr, secondStr] = timeString.split(":");
                const specificDate = tasks.bookDate;
                const [year, month, day] = specificDate.split("-");
                let date = new Date(year, parseInt(month) - 1, day, parseInt(hourStr), parseInt(minuteStr), parseInt('0'), 0);
                date.setHours(date.getHours() - 3);
                let hours = date.getHours().toString().padStart(2, '0');
                let minutes = date.getMinutes().toString().padStart(2, '0');
                let seconds = date.getSeconds().toString().padStart(2, '0');
                convertedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            }
            const scheduleDate = new Date(convertedDate);
            let sendDate = null;
            let startStr = '00:00';
            let endStr = '03:00';
            let currentStr = tasks.bookTime;
            let [startHours, startMinutes] = startStr.split(':').map(Number);
            let startTime = new Date();
            startTime.setHours(startHours, startMinutes, 0, 0);
            let [endHours, endMinutes] = endStr.split(':').map(Number);
            let endTime = new Date();
            endTime.setHours(endHours, endMinutes, 59, 0);
            let [currentHours, currentMinutes] = currentStr.split(':').map(Number);
            let currentTime = new Date();
            currentTime.setHours(currentHours, currentMinutes, 0, 0);
            if(currentTime >= startTime && currentTime <= endTime){
              let date = scheduleDate;
              date.setDate(date.getDate() - 1);
              sendDate = date;
            }else{
              sendDate = scheduleDate;
            }
            schedule.scheduleJob(sendDate, () => common.sendMultipleFormatNotifications(tasks.module, tasks.content_type, tasks.primaryId));
            return res.send({ status: 200, msg: "Notification Scheduled Successfully.", data: [] })
        } else {
            return res.send({ status: 200, msg: "No Notification To Schedule.", data: [] })
        }
    } catch (err) {
        return res.send({ status: 500, msg: "Notification Scheduled Failed.", data: [] });
    }
});
//TODAY BOOKING SCHEDULER END

//REMINDER VC SCHEDULER START
Router.post("/sendDoctorVCNotification", async function (req, res) {
    try {
        let tasks = req.body.task;
        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                const timeString = tasks[i].notification_to_time;
                const [hourStr, minuteStr, secondStr] = timeString.split(":");
                const specificDate = tasks[i].notificationdate;
                const [year, month, day] = specificDate.split("-");
                let date = new Date(year, parseInt(month) - 1, day, parseInt(hourStr), parseInt(minuteStr), parseInt('0'), 0);
                let hours = date.getHours().toString().padStart(2, '0');
                let minutes = date.getMinutes().toString().padStart(2, '0');
                let seconds = date.getSeconds().toString().padStart(2, '0');
                let convertedDate = '';
                convertedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
                const scheduleDate = new Date(convertedDate);
                const task = tasks[i];
                schedule.scheduleJob(scheduleDate, () => executeVCJob(task.notification_id));
            }
            return res.send({ status: 200, msg: "Notification Scheduled Successfully.", data: [] })
        } else {
            return res.send({ status: 200, msg: "No Notification To Schedule.", data: [] })
        }
    } catch (err) {
        return res.send({ status: 500, msg: "Notification Scheduled Failed.", data: [] });
    }
});

async function executeVCJob(id) {
    try {
        const language_res = await dbcontext.getDoctorNotificationCurrentContentById(id);
        if (!language_res || !Array.isArray(language_res) || language_res.length === 0) {
            console.error("No data returned or invalid format. Stopping the service.");
            return;
        }
        const doctorData = language_res[0];
        const PushNotificationContentMsg = doctorData.PushNotificationContentMsg;
        const fcm_token = doctorData.fcm_token;
        const name = doctorData.name;
        const mobile_no = doctorData.mobile_no;
        const email = doctorData.email;
        const country_code = doctorData.country_code;
        const content_title = doctorData.content_title;
        const language = doctorData.language;
        service.sendPushNotification(fcm_token, PushNotificationContentMsg, "Reminder VC", new Date());
        service.sendMailNotification(email, name, "Reminder VC", PushNotificationContentMsg, language, mobile_no);
        service.sendSMSNotification(country_code, mobile_no, PushNotificationContentMsg, language);
    } catch (error) {
        throw error;
    }
}
//REMINDER VC SCHEDULER END

module.exports = Router;
