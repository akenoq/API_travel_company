/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debugLog;


function debugLog(str) {
    console.log(str);
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = globalBus;


const GLOBAL_OBJ = {
    pg: __webpack_require__(2)
};

function globalBus() {
    return GLOBAL_OBJ;
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("pg");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueryMaker__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tableCreator__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__debugLog__ = __webpack_require__(0);







let express = __webpack_require__(6);
let app = express();

let swaggerUi = __webpack_require__(7),
    swaggerDocument = __webpack_require__(8);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let pg = __webpack_require__(2);
let fs = __webpack_require__(9);

let qm = new __WEBPACK_IMPORTED_MODULE_1__QueryMaker__["a" /* default */](app, pg, fs);
Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().qm = qm;

Object(__WEBPACK_IMPORTED_MODULE_2__tableCreator__["a" /* default */])();

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
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("err api");
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(err);
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

        let ans = {
            arr: []
        };

        qm.request(`SELECT * FROM people WHERE u_nickname = $1;`, [nickname],
            (err) => {
                Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("NO_ADDING_ERROR_SELECT");
                Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(err);
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
                            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("NO_ADDING_ERROR_INSERT");
                            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(err);
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


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__debugLog__ = __webpack_require__(0);




class QueryMaker {
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
            __WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */].log("_____POOL_____ERROR_____");
        });

        this.pool = pool;
    }

    // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
    // const values = ['brianc', 'brian.m.carlson@gmail.com']

    request(queryString, values, callbackError, callbackResp) {
        const pool = this.pool;
        let respObj = {
            arr: []
        };
        pool.query(queryString, values, (err, res) => {
            if(err !== null) {
                Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("callbackError");
                callbackError(err);
            } else {
                Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("callbackNormal");
                respObj.arr = res.rows;
                callbackResp(respObj);
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueryMaker;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tableCreator;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__debugLog__ = __webpack_require__(0);





function tableCreator() {
    console.log("creating table");

    let resultObj = {
        arr:[]
    };

    Object(__WEBPACK_IMPORTED_MODULE_0__globalBus__["a" /* default */])().qm.request(`
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
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("table creating error");
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])(err);
        },
        () => {
            Object(__WEBPACK_IMPORTED_MODULE_1__debugLog__["a" /* default */])("table was created");
        }
    );
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("swagger-ui-express");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {"swagger":"2.0","info":{"version":"1.0.0","title":"Travel Company API","description":"Travel Company API, postgres","license":{"name":"MIT","url":"https://opensource.org/licenses/MIT"}},"host":"localhost:5333","basePath":"/api","tags":[{"name":"Users","description":"API for users in the system"}],"schemes":["http"],"consumes":["application/json"],"produces":["application/json"],"paths":{"/hello":{"get":{"tags":["Hello"],"summary":"Hello Node API","responses":{"200":{"description":"OK","schema":{}}}}},"/users":{"post":{"tags":["Users"],"description":"Create new user in system","parameters":[{"name":"user","in":"body","description":"User that we want to create","schema":{"$ref":"#/definitions/Form"}}],"produces":["application/json"],"responses":{"200":{"description":"New user is created","schema":{"$ref":"#/definitions/User"}}}},"get":{"tags":["Users"],"summary":"Get all users in system","responses":{"200":{"description":"OK","schema":{"$ref":"#/definitions/Users"}}}}},"/users/{userId}":{"parameters":[{"name":"userId","in":"path","required":true,"description":"ID of user that we want to find","type":"string"}],"get":{"tags":["Users"],"summary":"Get user with given ID","responses":{"200":{"description":"User is found","schema":{"$ref":"#/definitions/User"}}}},"delete":{"summary":"Delete user with given ID","tags":["Users"],"responses":{"200":{"description":"User is deleted","schema":{"$ref":"#/definitions/User"}}}},"put":{"summary":"Update user with give ID","tags":["Users"],"parameters":[{"name":"user","in":"body","description":"User with new values of properties","schema":{"$ref":"#/definitions/User"}}],"responses":{"200":{"description":"User is updated","schema":{"$ref":"#/definitions/User"}}}}}},"definitions":{"User":{"required":["u_id","u_nickname","u_password","u_firstname","u_lastname","u_citizenship","u_phone"],"properties":{"u_id":{"type":"integer","uniqueItems":true},"nickname":{"type":"string","uniqueItems":true},"password":{"type":"string"},"lastname":{"type":"string"},"firstname":{"type":"string"},"citizenship":{"type":"string"},"phone":{"type":"string"}}},"Form":{"required":["u_nickname","u_password"],"properties":{"nickname":{"type":"string","uniqueItems":true},"password":{"type":"string"}}},"Users":{"type":"array","$ref":"#/definitions/User"}}}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);