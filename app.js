'use strict';

let Koa = require('koa');
let bodyParser = require('koa-bodyparser');
let controller = require('./controllers');

let staticRes = require('koa-static');
let templating = require('./templating');
let session = require('./session');
let models = require('./models');

let app = new Koa();

app.use(session(app));

app.use(staticRes(__dirname + '/statics'));

app.use(staticRes(__dirname + '/utils'));

app.use(bodyParser());

app.use(templating);

app.use(controller());

(async () => {
    console.log('正在初始化数据表。。。');
    //await models.sync();
})();

let port = 520;

app.listen(port);

console.log(`http://localhost:${port}`);
