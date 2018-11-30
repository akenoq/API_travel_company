"use strict";

const GLOBAL_OBJ = {
    pg: require('pg')
};

export default function globalBus() {
    return GLOBAL_OBJ;
}