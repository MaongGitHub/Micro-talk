'use strict';

let fs = require('fs');
let path = require('path');
let router = require('koa-router')();

function searchControllers() {
    let files = fs.readdirSync(__dirname);
    return files.filter(name => {
        return name.endsWith('.js') && name != 'index.js';
    })
}

function registerForEachFile(files) {
    files.forEach(item => {
        let tmpPath = path.join(__dirname, item);

        let routerObj = require(tmpPath);

        for (let key in routerObj) {
            let arrValue = routerObj[key];
            let type = routerObj[key][0];
            if (type === 'get') {
            
                if (arrValue.length === 2) {
                    let fn = arrValue[1];
                    router.get(key, fn);
                } else {
                    let auth = arrValue[1];
                    let fn = arrValue[2];
                    router.get(key, auth, fn);
                }
            } else {
                
                if (arrValue.length === 2) {
                    let fn = arrValue[1];
                    router.post(key, fn);
                } else {
                    let auth = arrValue[1];
                    let fn = arrValue[2];
                    router.post(key, auth, fn);
                }
            }
        }
    })
}

module.exports = function () {
    let files = searchControllers();

    registerForEachFile(files);

    return router.routes();
}
