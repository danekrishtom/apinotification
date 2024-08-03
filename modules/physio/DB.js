const { response } = require("express");
const dbcontext = require("../../DBCommon");

module.exports = {
    getPhysioNotificationCurrentContentById: async function (NotificationId) {
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