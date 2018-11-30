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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__debugLog__ = __webpack_require__(0);




class QueryMaker {
    constructor(app, pg, fs) {
        this.app = app;
        this.pg = pg;
        this.fs = fs;

        const pool = new pg.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'my_database',
            password: '12345',
            port: 5432
        });

        pool.on('error', (err, client) => {
            __WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */].log("_____POOL_____ERROR_____");
        });

        this.pool = pool;
    }

    request(queryString, resultObj, callbackError, callbackResp) {
        const pool = this.pool;
        pool.query(queryString, [], (err, res) => {
            if(err !== null) {
                Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("callbackError");
                callbackError(err);
            } else {
                Object(__WEBPACK_IMPORTED_MODULE_0__debugLog__["a" /* default */])("callbackNormal");
                resultObj.arr = res.rows;
                callbackResp();
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueryMaker;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueryMaker__ = __webpack_require__(3);
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
app.get('/api/', (request, response) => {
    response.end("HELLO NODE API");
});

// Описываем функцию для получения списка всех людей в БД
app.get('/api/get_all_records', (request, response) => {
    console.log("GET ALL RECORDS");
    let ans = {
        arr: []
    };

    qm.request("SELECT * FROM people ORDER BY man_id ASC;", ans,
        (err) => {
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])("err api");
            Object(__WEBPACK_IMPORTED_MODULE_3__debugLog__["a" /* default */])(err);
        },
        () => {
            const answer = ans.arr;
            response.end(JSON.stringify(answer));
            console.log("get ans");
    });
});

// Описываем функцию для добавления человека в БД
app.post('/api/add_one_record', (request, response) => {
    console.log("POST ONE RECORD");
    let bigString = "";
    request.on('data', (data) => {
        bigString += data;
    }).on('end', () => {
        const dataObj = JSON.parse(bigString);

        const nickname = dataObj.nickname;
        const age = dataObj.age;

        let ans = {
            arr: []
        };

        qm.request("SELECT * FROM people WHERE man_nickname = '" + nickname + "';", ans, () => {
            if(ans.arr.length > 0) {
                const answer = {
                    message: "NO_ADDING"
                };
                response.end(JSON.stringify(answer));
            } else {
                qm.request("INSERT INTO people (man_nickname, man_age) VALUES ('" + nickname + "', " + age + ");", {}, () => {
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tableCreator;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__QueryMaker__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__globalBus__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__debugLog__ = __webpack_require__(0);






function tableCreator() {
    console.log("creating table");

    let resultObj = {
        arr:[]
    };

    Object(__WEBPACK_IMPORTED_MODULE_1__globalBus__["a" /* default */])().qm.request(`
        CREATE TABLE IF NOT EXISTS people (
            man_id BIGSERIAL PRIMARY KEY,
            man_nickname TEXT,
            man_age INTEGER
        );`,
        resultObj,
        (err) => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("table creating error");
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])(err);
        },
        () => {
            Object(__WEBPACK_IMPORTED_MODULE_2__debugLog__["a" /* default */])("table was created");
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

module.exports = {"swagger":"2.0","info":{"version":"1.0.0","title":"Yet Another Node.js Blogg Application API","description":"Yet Another Node.js Blogg Application API","license":{"name":"MIT","url":"https://opensource.org/licenses/MIT"}},"host":"localhost:5333","basePath":"/api","tags":[{"name":"Users","description":"API for users in the system"}],"schemes":["http"],"consumes":["application/json"],"produces":["application/json"],"paths":{"/":{"get":{"tags":["Hello"],"summary":"Hello Node API","responses":{"200":{"description":"OK","schema":{}}}}},"/users":{"post":{"tags":["Users"],"description":"Create new user in system","parameters":[{"name":"user","in":"body","description":"User that we want to create","schema":{"$ref":"#/definitions/User"}}],"produces":["application/json"],"responses":{"200":{"description":"New user is created","schema":{"$ref":"#/definitions/User"}}}},"get":{"tags":["Users"],"summary":"Get all users in system","responses":{"200":{"description":"OK","schema":{"$ref":"#/definitions/Users"}}}}},"/users/{userId}":{"parameters":[{"name":"userId","in":"path","required":true,"description":"ID of user that we want to find","type":"string"}],"get":{"tags":["Users"],"summary":"Get user with given ID","responses":{"200":{"description":"User is found","schema":{"$ref":"#/definitions/User"}}}},"delete":{"summary":"Delete user with given ID","tags":["Users"],"responses":{"200":{"description":"User is deleted","schema":{"$ref":"#/definitions/User"}}}},"put":{"summary":"Update user with give ID","tags":["Users"],"parameters":[{"name":"user","in":"body","description":"User with new values of properties","schema":{"$ref":"#/definitions/User"}}],"responses":{"200":{"description":"User is updated","schema":{"$ref":"#/definitions/User"}}}}}},"definitions":{"User":{"required":["email","_id"],"properties":{"_id":{"type":"string","uniqueItems":true},"email":{"type":"string","uniqueItems":true},"lastName":{"type":"string"},"firstName":{"type":"string"}}},"Users":{"type":"array","$ref":"#/definitions/User"}}}

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })
/******/ ]);