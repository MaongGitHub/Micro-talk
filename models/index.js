'use strict';

let fs=require('fs');

let {sequelize}=require('../db');

function searchFiles() {
    let files=fs.readdirSync(__dirname);
    return files.filter(name=>{
        return name.endsWith('.js')&&name!=='index.js';
    })
}

function registerModels(files) {
    let obj={};
    files.forEach(name=>{
        let modelName=name.substring(0,name.length-3);
        obj[modelName]=require(__dirname+'/'+name);
    })
    return obj;
}

let files=searchFiles();

let obj=registerModels(files);

obj.sync=async()=>{
    if(process.env==='product'){
        console.log('当前是生产环境，不能强制修改数据表或者删除数据表');
    }else{
        return sequelize.sync({force:true})
    }
}

module.exports=obj;