'use strict';

let nunjucks=require('nunjucks');

function createEnv(path,opts) {
    path=path||'views';
    opts=opts||{};
    let envOptions={
        autoescape :opts.autoescape || true,
        throwOnUndefined :opts.throwOnUndefined || false,
        trimBlocks : opts.trimBlocks || false,
        lstripBlocks :opts.lstripBlocks || false,
        watch :opts.watch||true,
        noCache :opts.noCache || true
    }
    let env=nunjucks.configure('views',envOptions);

    return env;
}

module.exports=async(ctx,next)=>{
    let env=createEnv();
    ctx.render=function (views,model) {
        ctx.body=env.render(views,model);
    }
    await next();
}