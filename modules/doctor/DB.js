const { response } = require("express");
const dbcontext = require("../../DBCommon");

module.exports = {
    getNotificationForTodayBooking: async function (primary_id, module) {
        try {
            var params = new Object();
            params.dPrimaryId = primary_id;
            params.dModule = module;
            return dbcontext.CallSP(dbcontext, "getNotificationForTodayBookingInAppNotification", params);
        }
        catch (err) {
            var error = { "error": err }
            return error
        }
    },
    getDoctorNotificationCurrentContentById: async function (NotificationId) {
        try {
            var params = new Object();
            params.dNotificationId = NotificationId;
            return dbcontext.CallSP(dbcontext, "getRemainderNotificationContentByLang", params);
        }
        catch (err) {
            var error = { "error": err }
            return error
        }
    },
};