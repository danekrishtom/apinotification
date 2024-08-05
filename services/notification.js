const FCM = require('fcm-node');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const SNSLibrary = require('../library/snslibrary');
const config = require('../config');
const handlebars = require('handlebars');

var firebaseServerKey = 'AAAAK7gOGig:APA91bFHzAy-S1HXWlOYoNpHdOucJE2NKaZLi7KQkiHz4fgW0oGyHc3097alHPE2ccFiRuc-lggeKMbzotFNdvQ39KwySn-xIGJFLfiSl4F6YfkCd3alU-2bEdmzQwX2MSF0B1Ip11Dj';
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: config.mailSendFrom,
        pass: config.mailPassword
    }
});

let formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

let formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
}

module.exports = {
    sendPushNotification(deviceToken, msg, title, notification_to_time) {
        try {
            var fcm = new FCM(firebaseServerKey);
            var message = {
                to: deviceToken,
                notification: {
                    title: title,
                    body: msg
                },
                data: {
                    notification_foreground: true,
                    notification_time: notification_to_time
                }
            };
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong!" + err);
                } else {
                    console.log("Push Notification Send Successfully : ", response);
                }
            });
        } catch (e) {
            console.log("SMS Sent Error :", e);
            return e;
        }
    },

    sendMailNotification(toMail, name, title, msg, language, phoneno) {
        try {
            const now = new Date();
            const rescheduleContent = '';
            const formattedTime = formatAMPM(now);
            const formattedDate = formatDate(now);
            var filePath;
            if (language == 'ea') {
                filePath = path.join(__dirname, '../templates/notification_template_arabic.html');
            } else {
                filePath = path.join(__dirname, '../templates/notification_template.html');
            }
            const source = fs.readFileSync(filePath, 'utf-8').toString();
            const template = handlebars.compile(source);
            var mail_content = msg
            const replacements = {
                title,
                name,
                mail_content,
                rescheduleContent,
                phoneno,
                formattedTime,
                formattedDate
            };
            const htmlToSend = template(replacements);
            const options = {
                from: config.mailSendFrom,
                to: toMail,
                subject: title,
                html: htmlToSend
            };
            transporter.sendMail(options, function (err, info) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Sent:" + info.response);
            });
        } catch (e) {
            console.log("Mail Sent Error :", e);
            return e;
        }
    },

    sendSMSNotification(countryCode, mobileNumber, msg, language) {
        try {
            var data = {
                'countryCode': countryCode,
                'mobileNumber': mobileNumber,
                'msg': msg,
                "language": language,
            }
            return new Promise(resolve => {
                SNSLibrary.sendSMS(data, function (err, response) {
                    console.log(response);
                    if (err) {
                        console.log(err.message);
                        resolve(false);
                    } else {
                        console.log("Resolve Level Console Log", response);
                        resolve(true);
                    }
                })
            })
        } catch (e) {
            console.log("SMS Sent Error :", e);
            return e;
        }
    },
}