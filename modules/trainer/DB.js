const { response } = require("express");
const dbcontext = require("../../DBCommon");

module.exports = {
    insertReminderVCRecordForTrainer: async function (vc_id) {
        try {
            var params = new Object();
            params.dVC_id = vc_id;
            return dbcontext.CallSP(dbcontext, "insertReminderVCRecordForTrainer", params);
        }
        catch (err) {
            var error = { "error": err }
            return error
        }
    },
    getReminderVCRecordForTrainer: async function (vc_id) {
        try {
            var params = new Object();
            params.dVC_id = vc_id;
            return dbcontext.CallSP(dbcontext, "getReminderVCRecordForTrainer", params);
        }
        catch (err) {
            var error = { "error": err }
            return error
        }
    },
};