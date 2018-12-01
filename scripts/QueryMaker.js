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

    /**
     * Request with values array to pg
     * @param queryString - template sql query
     * @param values - array of parameters for template
     * @param callbackError
     * @param callbackResp
     */
    request(queryString, values, callbackError, callbackResp) {
        const pool = this.pool;
        let respObj = {
            arr: []
        };
        pool.query(queryString, values, (err, res) => {
            if(err !== null) {
                debugLog("callbackError");
                callbackError(err);
            } else {
                debugLog("callbackNormal");
                respObj.arr = res.rows;
                callbackResp(respObj);
            }
        });
    }
}