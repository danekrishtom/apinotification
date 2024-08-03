var AWS = require('aws-sdk');
const axios = require('axios'); 
AWS.config.update({
    accessKeyId: 'AKIASZ5BWNCCS4UGEEKL',
    secretAccessKey: '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',
    region: 'me-south-1'
});
var applicationARN = "arn:aws:sns:me-south-1:193075767429:SMS_Name";
var sns = new AWS.SNS();
var SNSLibrary = function () { };
SNSLibrary.prototype.getEndpoint = function (token, callback) {
    if (token == "" || token == undefined) {
        callback("Token undefined or Empty", null);
    } else {
        sns.createPlatformEndpoint({
            PlatformApplicationArn: applicationARN,
            Token: token
        }, function (err, data) {
            if (err) {
                callback("Problem in Creating EndPoint", null);
                return;
            }
            callback(null, data);
        });
    }
}

SNSLibrary.prototype.sendMessage = function (arnEndPoint, mSGData, callbackmessage) {
    var endpointArn = arnEndPoint;
    var payload = {
        default: mSGData.msg,
        GCM: {
            data: { message: mSGData.msg, usersData: mSGData.additionalData }
        }
    };
    payload.GCM = JSON.stringify(payload.GCM);
    payload = JSON.stringify(payload);
    sns.publish({
        Message: payload,
        MessageStructure: 'json',
        TargetArn: endpointArn
    }, function (err, data) {
        if (err) {
            callbackmessage(err, null);
        }
        callbackmessage(null, data);
    })
}

SNSLibrary.prototype.sendNotification = function (data, callbackmessage) {
    try {
        const notificationPayload = {
            title: data.title,
            body: data.body,
        };
        const dataPayload = {
            custom_key: data.title,
            notification_foreground: true,
        };
        const fcmPayload = {
            notification: notificationPayload,
            data: dataPayload,
            registration_ids: data.tokens,
            priority: "high",
            content_available: true,
        }
        if (data.tokens.length > 0) {
            const fcm_api_url = "https://fcm.googleapis.com/fcm/send";
            const headers = {
                Authorization: "key=AAAAK7gOGig:APA91bFHzAy-S1HXWlOYoNpHdOucJE2NKaZLi7KQkiHz4fgW0oGyHc3097alHPE2ccFiRuc-lggeKMbzotFNdvQ39KwySn-xIGJFLfiSl4F6YfkCd3alU-2bEdmzQwX2MSF0B1Ip11Dj",
                'Content-Type': 'application/json'
            };
            axios.post(fcm_api_url, fcmPayload, { headers })
                .then(response => {
                    callbackmessage(null, data);
                })
                .catch(error => {
                    callbackmessage(error, null)
                });
        } else {
            callbackmessage("Error sending notification 500", null)
        }
    } catch (error) {
        callbackmessage(error, null)
    }
}

SNSLibrary.prototype.sendSMS = async function (data, callbacksms) {
    var params = {
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': 'Transactional'
            }
        },
        Message: data.msg,
        PhoneNumber: "+" + data.countryCode + "" + data.mobileNumber
    };
    var publishTextPromise = sns.publish(params).promise();
    await publishTextPromise.then(function (data) {
        callbacksms(null, data)
    }).catch(function (err) {
        callbacksms(err, null);
    });
}

module.exports = new SNSLibrary();
