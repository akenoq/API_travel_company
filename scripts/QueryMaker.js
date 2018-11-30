"use strict";

import debugLog from './debugLog';

export default class QueryMaker {
    constructor(app, pg, fs) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        // sudo -u postgres psql
        // CREATE DATABASE my_1;
        const pool = new pg.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'my_1',
            password: '12345',
            port: 5432
        });

        pool.on('error', (err, client) => {
            debugLog.log("_____POOL_____ERROR_____");
        });

        this.pool = pool;
    }

    request(queryString, resultObj, callbackError, callbackResp) {
        const pool = this.pool;
        pool.query(queryString, [], (err, res) => {
            if(err !== null) {
                debugLog("callbackError");
                callbackError(err);
            } else {
                debugLog("callbackNormal");
                resultObj.arr = res.rows;
                callbackResp();
            }
        });
    }
}