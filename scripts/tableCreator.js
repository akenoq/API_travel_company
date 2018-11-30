"use strict";

import QueryMaker from './QueryMaker';
import globalBus from "./globalBus";
import debugLog from "./debugLog";

export default function tableCreator() {
    console.log("creating table");

    let resultObj = {
        arr:[]
    };

    globalBus().qm.request(`
        CREATE TABLE IF NOT EXISTS people (
            man_id BIGSERIAL PRIMARY KEY,
            man_nickname TEXT,
            man_age INTEGER
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