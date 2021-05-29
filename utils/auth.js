module.exports = async (ctx, next) => {
    // 获取登录用户的id（如果有）
    let userId = ctx.session.userId;
    let path = ctx.path;
    // 判断有没有登录用户，如果有，则继续访问，没有则跳转登录界面
    if (!userId) {
        if (path === '/login') {
            await next();
        } else {
            ctx.redirect('/login');
        }

    } else {
        if (path === '/login') {
            ctx.redirect('/');
        } else {
            await next();
        }

    }
}