'use strict';

let {sequelize,defineModel,DataTypes}=require('../db');


let Model=defineModel('users',{
    username:{
        type:DataTypes.STRING(80),
        allowNull:false
    },
    password:{
        type:DataTypes.STRING(80),
        allowNull:false
    }
});

module.exports=Model
