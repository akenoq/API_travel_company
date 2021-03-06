"use strict";

import globalBus from './globalBus';
import QueryMaker from './QueryMaker';
import tableCreator from './tableCreator';
import debugLog from "./debugLog";

let express = require("express");
let app = express();

let swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./../swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let pg = require('pg');
let fs = require('fs');

let qm = new QueryMaker(app, pg, fs);
globalBus().qm = qm;

tableCreator();

// Запускаем сервер
let port = 5333;
app.listen(port);
console.log("Server works on port " + port);

// Разрешаем междоменные запросы
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// HELLO NODE API
app.get('/api/hello', (request, response) => {
    response.end("HELLO NODE API");
});

// Описываем функцию для получения списка всех людей в БД
app.get('/api/users', (request, response) => {
    console.log("GET ALL RECORDS");
    let ans = {
        arr: []
    };

    qm.request("SELECT * FROM people ORDER BY u_id ASC;", [],
        (err) => {
            debugLog("err api");
            debugLog(err);
        },
        (ans) => {
            const answer = ans.arr;
            response.end(JSON.stringify(answer));
            console.log("get ans");
    });
});

// app.get('/api/users/:u_id', () => {});

// Описываем функцию для добавления человека в БД
app.post('/api/users', (request, response) => {
    console.log("POST ONE RECORD");
    let bigString = "";
    request.on('data', (data) => {
        bigString += data;
    }).on('end', () => {
        const dataObj = JSON.parse(bigString);

        const nickname = dataObj.nickname;
        const password = dataObj.password;
        const firstname = dataObj.firstname;
        const lastname = dataObj.lastname;
        const citizenship = dataObj.citizenship;
        const phone = dataObj.phone;

        qm.request(`SELECT * FROM people WHERE u_nickname = $1;`, [nickname],
            (err) => {
                debugLog("NO_ADDING_ERROR_SELECT");
                debugLog(err);
            },
            (ans) => {
                if(ans.arr.length > 0) {
                    const answer = {
                        message: "NO_ADDING_ALREADY_EXIST"
                    };
                    response.end(JSON.stringify(answer));
                } else {
                    qm.request(`INSERT INTO people (u_nickname, u_password) VALUES ($1, $2);`, [nickname, password],
                        (err) => {
                            debugLog("NO_ADDING_ERROR_INSERT");
                            debugLog(err);
                        },
                        (ans) => {
                        const answer = {
                            message: "ADDING_SUCCESS"
                        };
                        response.end(JSON.stringify(answer));
                    });
                }
        });
    });
});
