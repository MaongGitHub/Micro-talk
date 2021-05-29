'use strict';

let { Sequelize, DataTypes } = require('sequelize');
let { database, username, password, host, dialect } = require('./config');

let sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect
});


function defineModel(name, attrs) {
  let prop = {};

  prop.id = {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  };
  for (let key in attrs) {
    let value = attrs[key];
    prop[key] = value;
  }
  prop.createdAt = {
    type: DataTypes.STRING,
    allowNull: false
  }
  prop.updatedAt = {
    type: DataTypes.STRING,
    allowNull: false
  }
  prop.version = {
    type: DataTypes.BIGINT,
    allowNull: false
  }
  prop.remarks = {
    type: DataTypes.BIGINT,
    allowNull: true
  }


  let obj = sequelize.define(name, prop, {
    tableName: name,
    timestamps: false,
    hooks: {
      beforeValidate: function (obj) {
        let now = Date.now();
        let date = new Date(parseInt(now))
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? ('0' + MM) : MM
        let d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        let h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        let m = date.getMinutes()
        m = m < 10 ? ('0' + m) : m
        let s = date.getSeconds()
        s = s < 10 ? ('0' + s) : s
        let nowTime=y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        if (obj.isNewRecord) {
          obj.createdAt = nowTime;
          obj.updatedAt = nowTime;
          obj.version = 0;
        } else {
          obj.updatedAt = nowTime;
          obj.version += 1;
        }
      }
    }
  });
  return obj;
}

let obj = {
  sequelize,
  defineModel,
  DataTypes
};

module.exports = obj;