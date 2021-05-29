let { defineModel, DataTypes } = require('../db');


let model = defineModel('messages', {
    fromUserId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    content: DataTypes.STRING(80)
});

module.exports = model;