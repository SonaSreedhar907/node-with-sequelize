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
db.models.PostImage = require('./postImages')(sequelize, Sequelize.DataTypes)


db.models.PostImage.belongsTo(db.models.Post, { foreignKey: 'postId', as: 'postImages' });
// as: 'postImages' is an alias you provide for the association. 
// This alias can be used when querying the database to reference this specific association.


// In your models/index.js

db.models.User.hasMany(db.models.Post, { foreignKey: 'userId', as: 'posts' });   //one-to-many relatioship
// when you retrieve a user and want to access their posts, you'll use user.posts.


db.models.Post.belongsTo(db.models.User, { foreignKey: 'userId', as: 'creator' }); //many-to-one relationship
// when you retrieve a post and want to access its creator (user), you'll use post.creator.


db.models.Comment.belongsTo(db.models.User, {foreignKey:'userId',as : 'user'})

db.models.Comment.belongsTo(db.models.Post, { foreignKey: 'postId', as: 'post' });

module.exports = { db, sequelize };
