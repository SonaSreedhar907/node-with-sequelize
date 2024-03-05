module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
      'post',
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        image: {
          type: DataTypes.ARRAY(DataTypes.STRING), // Updated to support an array of image paths
        },
        category: {
          type: DataTypes.STRING,
          defaultValue: 'uncategorized',
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        timestamps: true,
        freezeTableName: true,
      }
    );
  
    return Post;
  };
  