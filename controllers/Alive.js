let { User, Message, Comment } = require('../models');
let auth = require('../utils/auth');

let index_fn = async (ctx, next) => {
    let username = ctx.session.userName;

    let msgs = JSON.parse(JSON.stringify(await Message.findAll({
        order: [
            ["id", "desc"]
        ]
    })));

    let comts = JSON.parse(JSON.stringify(await Comment.findAll()));

    let userIds = [];



    msgs.forEach(row => {
        userIds.push(row.fromUserId);
    });

    comts.forEach(row => {
        userIds.push(row.fromUserId);
    });


    let userAll = await User.findAll({
        where: {
            id: userIds
        }
    })


    comts.forEach(row => {
        let currentUser = userAll.filter(user => {
            return row.fromUserId === user.id;
        })[0];
        row.comUserName = currentUser.username;
    });


    msgs.forEach(msg => {
        let msgComment = comts.filter(item => {
            return item.msgId === msg.id;
        });
        let currentUser = userAll.filter(row => {
            return row.id === msg.fromUserId;
        })[0];
        msg.msgUserName = currentUser.username;
        msg.comments = msgComment;
    });

    console.log(msgs);

    let obj = {
        username: username,
        msgs: msgs
    };
    ctx.render('index.html', obj);
}
let login_fn = async (ctx, next) => {
    ctx.render('login.html');
}
let register_fn = async (ctx, next) => {
    ctx.render('register.html')
}

let loginDone_fn = async (ctx, next) => {
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';

    console.log(username);
    console.log(password);
    let res;
    let u1 = await User.findOne({
        where: {
            username: username,
            password: password
        }
    }).then((row) => {
        let user = JSON.stringify(row);
        let u2 = JSON.parse(user);
        console.log(user);
        console.log(u2);

        if (user !== 'null') {
            ctx.session.userId = row.id;
            ctx.session.userName = row.username;
            res = { code: 200, msg: '登录成功' };
        } else {
            res = { code: 1000, msg: '用户名或密码错误，请重试' };
        }
    });
    ctx.body = res;
}
let registerDone_fn = async (ctx, next) => {
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';
    let confirmpassword = ctx.request.body.confirmpassword || '';

    console.log(username);
    console.log(password);
    console.log(confirmpassword);

    if (username.length > 0 && password.length > 0 && confirmpassword.length > 0 && password === confirmpassword) {
        let userDemo = await User.findOne({ where: { username: username } });
        console.log(JSON.stringify(userDemo));
        let res = '';


        if (userDemo) {

            res = { code: 1000, msg: '当前用户名已经注册，请确认后重试' };
        } else {
            let u1 = User.create({
                username: username,
                password: password
            });
            res = { code: 200, msg: '注册成功' };
        }

        ctx.body = JSON.stringify(res);

    } else {
        console.log('用户名或密码不能为空；并且两次密码应该相同');
    }
}
let logout_fn = async (ctx, next) => {
    ctx.session = null;

    ctx.body = { code: 200, msg: '注销成功' };
}
let say_fn = async (ctx, next) => {
    let msgSay = ctx.request.body.msgSay || '';
    let userId = ctx.session.userId;
    let msg1 = await Message.create({
        fromUserId: userId,
        content: msgSay
    });

    let data = JSON.stringify(msg1)


    console.log(msgSay);

    ctx.body = { code: 200, data, msg: '发表成功' };
}
let comment_fn = async (ctx, next) => {
    let msgId = ctx.request.body.msgId || '';
    let userId = ctx.session.userId;
    let commentText = ctx.request.body.content || '';
    let msg1 = await Comment.create({
        fromUserId: userId,
        msgId: msgId,
        content: commentText
    });


    let fromUser = await User.findOne({
        where: {
            id: userId
        }
    });


    let msg = await Message.findOne({
        where: {
            id: msgId
        }
    });

    let toUser = await User.findOne({
        where: {
            id: msg.fromUserId
        }
    });

    let data = JSON.parse(JSON.stringify(msg1));

    data.fromUserName = fromUser.username;
    data.toUserName = toUser.username;

    ctx.body = { code: 200, data, msg: '发表成功' };
}

module.exports = {
    '/': ['get', auth, index_fn],
    '/login': ['get', auth, login_fn],
    '/logout': ['post', logout_fn],
    '/register': ['get', register_fn],
    '/loginDone': ['post', loginDone_fn],
    '/registerDone': ['post', registerDone_fn],
    '/say': ['post', say_fn],
    '/comment': ['post', comment_fn],
}