"use strict";

import globalBus from "./globalBus";
import debugLog from "./debugLog";

export default function tableCreator() {
    console.log("creating table");

    let resultObj = {
        arr:[]
    };

    globalBus().qm.request(`
        CREATE TABLE IF NOT EXISTS people (
            u_id BIGSERIAL PRIMARY KEY,
            u_nickname TEXT,
            u_password TEXT,
            u_firstname TEXT,
            u_lastname TEXT,
            u_citizenship TEXT,
            u_phone TEXT
        );`,
        resultObj,
        (err) => {
            debugLog("table creating error");
            debugLog(err);
        },
        () => {
            debugLog("table was created");
        }
    );
}