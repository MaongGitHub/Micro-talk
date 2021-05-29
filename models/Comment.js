let { defineModel, DataTypes } = require('../db');


let model = defineModel('comments', {
    fromUserId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    msgId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    content: DataTypes.STRING(80)
});

module.exports = model;