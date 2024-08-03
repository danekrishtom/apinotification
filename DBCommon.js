const mysql = require("mysql/");
const config = require("./config");

var Pool = mysql.createPool({
    connectionLimit: config.connectionLimit,
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
});

module.exports = {
    ExecuteQuery: function (reqquery) {
        return new Promise((resolve, reject) => {
            Pool.getConnection(function (err, conn) {
                if (err) {
                    console.error("Error getting database connection:", err);
                    reject(err);
                } else {
                    conn.query(reqquery, function (err2, result, fields) {
                        conn.release();
                        if (err2) {
                            reject(err2);
                        } else {
                            resolve(result[0]);
                        }
                    });
                }
            });
        });
    },

    CallSP: async function (_instance, sp_name, jsonparams) {
        try {
            var queryformation = jsonparams ? "call " + sp_name + "(" : "call " + sp_name + "()";
            if (jsonparams) {
                var keys = Object.keys(jsonparams);
                for (var i = 0; i < keys.length; i++) {
                    queryformation =
                        queryformation + "@" + keys[i] + ":='" + jsonparams[keys[i]] + "',";
                }
                queryformation = queryformation.substring(0, queryformation.length - 1);
                queryformation = queryformation + ")";
            }
            const response = await _instance.ExecuteQuery(queryformation);
            return response;
        } catch (err) {
            return err.message;
        }
    },
};