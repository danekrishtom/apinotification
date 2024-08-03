const service = require("./notification");
const doctordbcontext = require("../modules/doctor/DB");

let replaceHashString = (message, response) => {
    try {
        if (response.date != undefined) {
            message = message.replace('##DATE##', response.date)
        }
        if (response.task_name != undefined) {
            message = message.replace('##task_name##', response.task_name)
        }
        if (response.orderNumber != undefined) {
            message = message.replace('##order_number##', response.orderNumber)
        }
        if (response.medicineName != undefined) {
            message = message.replace('##medicine_name##', response.medicineName)
        }
        if (response.vendor != undefined) {
            message = message.replace('##vendor_name##', response.vendor)
        }
        if (response.member != undefined) {
            message = message.replace('##member_name##', response.member)
        }
        if (response.rating != undefined) {
            message = message.replace('##rating##', response.rating)
        }
        if (response.vendor_name1 != undefined) {
            message = message.replace('##vendor_name1##', response.vendor_name1)
        }
        if (response.booked_time != undefined) {
            message = message.replace('##book_time##', response.booked_time);
        }
        if (response.test_name != undefined) {
            message = message.replace('##test_name##', response.test_name);
        }
        if (response.rebook_date != undefined) {
            message = message.replace('##rebook_date##', response.rebook_date);
        }
        if (response.rebook_time != undefined) {
            message = message.replace('##rebook_time##', response.rebook_time);
        }
        if (response.bookdate != undefined) {
            message = message.replace('##book_date##', response.bookdate)
        }
        if (response.bookedtime != undefined) {
            message = message.replace('##book_time##', response.bookedtime)
        }
        if (response.changedate != undefined) {
            message = message.replace('##rebook_date##', response.rebook_date);
            message = message.replace('##book_date##', response.date)
        }
        if (response.changetime != undefined) {
            message = message.replace('##rebook_time##', response.rebook_time);
            message = message.replace('##book_time##', response.bookedtime)
        }
        if (response.package_name != undefined) {
            message = message.replace('##package_name##', response.package_name);
        }
        if (response.booked_time != undefined) {
            message = message.replace('##book_time##', response.booked_time);
        }
        if (response.task_name != undefined) {
            message = message.replace('##dutty_name##', response.task_name)
        }
        if (response.rebook_date != undefined) {
            message = message.replace('##rebook_date##', response.rebook_date);
        }
        if (response.rebook_time != undefined) {
            message = message.replace('##rebook_time##', response.rebook_time);
        }
        if (response.name != undefined) {
            message = message.replace('##NAME##', response.name)
        }
        if (response.doctorname != undefined) {
            message = message.replace('##doctor_name##', response.doctorname)
        }
        if (response.name != undefined && response.app_module == 'Member') {
            message = message.replace('##doctor_name##', response.doctorname)
            message = message.replace('##vendor_name##', response.labname)
        }
        if (response.vendor_name2 != undefined) {
            message = message.replace('##vendor_name2##', response.vendor_name2)
        }
        if (response.service != undefined) {
            message = message.replace('##SERVICE##', response.service)
        }
        if (response.fromdate != undefined) {
            message = message.replace('##FROMDATE##', response.fromdate)
        }
        if (response.todate != undefined) {
            message = message.replace('##TODATE##', response.todate)
        }
        if (response.doctor_1 != undefined) {
            message = message.replace('##DOCTOR1##', response.doctor_1)
        }
        if (response.speciality_1 != undefined) {
            message = message.replace('##SPECIALITY1##', response.speciality_1)
        }
        if (response.doctor_2 != undefined) {
            message = message.replace('##DOCTOR2##', response.doctor_2)
        }
        if (response.speciality_2 != undefined) {
            message = message.replace('##SPECIALITY2##', response.speciality_2)
        }
        if (response.nurse != undefined) {
            message = message.replace('##NURSE##', response.nurse)
        }
        if (response.fromdate1 != undefined) {
            message = message.replace('##FROMDATE1##', response.fromdate1)
        }
        if (response.todate1 != undefined) {
            message = message.replace('##TODATE1##', response.todate1)
        }
        if (response.vendor != undefined) {
            message = message.replace('##VENDOR##', response.vendor)
        }
        if (response.time != undefined) {
            message = message.replace('##TIME##', response.time)
        }
        if (response.totime != undefined) {
            message = message.replace('##TOTIME##', response.totime)
        }
        if (response.bookedtime != undefined) {
            message = message.replace('##BOOKEDTIME##', response.bookedtime)
        }
        if (response.speciality != undefined) {
            message = message.replace('##SPECIALITY##', response.speciality)
        }
        if (response.orderStatusId != undefined) {
            message = message.replace('##ORDERID##', response.orderStatusId)
        }
        if (response.doctorname != undefined) {
            message = message.replace('##DOCTORNAME##', response.doctorname)
        }
        if (response.pharmdate != undefined) {
            message = message.replace('##PHARMDATE##', response.pharmdate)
        }
        if (response.pharmtime != undefined) {
            message = message.replace('##PHARMTIME##', response.pharmtime)
        }
        if (response.changedate != undefined) {
            message = message.replace('##CHANGEDATE##', response.changedate)
        }
        if (response.changetime != undefined) {
            message = message.replace('##CHANGETIME##', response.changetime)
        }
        if (response.clinicname != undefined) {
            message = message.replace('##CLINICNAME##', response.clinicname)
        }
        if (response.toberesheduledate != undefined) {
            message = message.replace('##TOBERESHEDULEDATE##', response.toberesheduledate)
        }
        if (response.resheduledate != undefined) {
            message = message.replace('##RESHEDULEDATE##', response.resheduledate)
        }
        if (response.labname != undefined) {
            message = message.replace('##LABNAME##', response.labname)
        }
        if (response.parent_patient_name != '' && response.name !== response.parent_patient_name) {
            message = message.replace('##PATIENTNAME##', "for your family member " + response.name)
        }
        if (response.reschedule_from_date != undefined) {
            var dtft = DateFormatmsg(response.reschedule_from_date);
            message = message.replace('##RESHEDULEFROMDATE##', dtft)
        }
        if (response.reschedule_to_date != undefined) {
            var dtft = DateFormatmsg(response.reschedule_to_date)
            message = message.replace('##RESHEDULETODATE##', dtft)
        }
        if (response.pharmacyName != undefined) {
            message = message.replace('##PHARMACYNAME##', response.pharmacyName)
        }
        else {
            message = message.replace('##PATIENTNAME##', "")

        }
        return message;
    } catch (e) {
        return message;
    }
}

module.exports = {
    sendMultipleFormatNotifications: async function (module, process_type, primary_id) {
        var response = null;
        if ((module == 'Doctor' || module == 'Physio') && process_type == 'TodayBooking') {
            response = await doctordbcontext.getNotificationForTodayBooking(primary_id, module);
        }

        if (response == null && response.error != undefined) {
            res.send({ status: 0, msg: 'Failed', data: response.error });
        } else {
            for (var i = 0; i < response.length; i++) {
                var currentResponse = response[i];
                var title = '';
                if (process_type == "TodayBooking") {
                    title = "Today Booking" + " Notification - " + module;
                }
                if (module == "Member") {
                    title = process_type + " Notification - Member";
                }
                if (title == "") {
                    title = process_type + " Notification - " + module;
                }
                var toEmail = currentResponse.email;
                var name = currentResponse.name;
                var phoneno = currentResponse.phoneno;
                var cccode = currentResponse.cc_code;
                var deviceToken = currentResponse.fcm_token;
                var parentPatientName = currentResponse.parent_patient_name;
                var contentLanguage = currentResponse.language
                var EmailContentMsg = replaceHashString(currentResponse.EmailContentMsg, currentResponse);
                var SMSContentMsg = replaceHashString(currentResponse.SMSContentMsg, currentResponse);
                var PushNotificationContentMsg = replaceHashString(currentResponse.PushNotificationContentMsg, currentResponse);
                if (EmailContentMsg != null && toEmail != null) {
                    if (parentPatientName != '' && parentPatientName !== name && (name == "" || name == null)) {
                        name = parentPatientName;
                    }
                    service.sendMailNotification(toEmail, name, title, EmailContentMsg, contentLanguage, phoneno);
                }
                if (SMSContentMsg != null && phoneno != null) {
                    service.sendSMSNotification(cccode, phoneno, SMSContentMsg, contentLanguage);
                }
                if (PushNotificationContentMsg != null && deviceToken != null) {
                    service.sendPushNotification(deviceToken, PushNotificationContentMsg, title, new Date());
                }
            }
        }
    },
};