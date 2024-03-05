// index.js
const dbConfig = require('../config/dbConfig.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DATABASE,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.DIALECT,
    }
);

const db = {};

db.sequelize = sequelize;
db.models = {};
db.models.User = require('./user')(sequelize, Sequelize.DataTypes);
db.models.Post = require('./post')(sequelize, Sequelize.DataTypes)
db.models.Comment = require('./comment')(sequelize, Sequelize.DataTypes)

// In your models/index.js

db.models.User.hasMany(db.models.Post, { foreignKey: 'userId', as: 'posts' });
db.models.Post.belongsTo(db.models.User, { foreignKey: 'userId', as: 'creator' });



db.models.Comment.belongsTo(db.models.User, {foreignKey:'userId',as : 'user'})

db.models.Comment.belongsTo(db.models.Post, { foreignKey: 'postId', as: 'post' });

module.exports = { db, sequelize };
