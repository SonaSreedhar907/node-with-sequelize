module.exports = (sequelize,DataTypes)=>{
    const PostImage = sequelize.define('postimage',
     {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        postId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false
        }
     },
     {
        timestamps: false,
     }
    )
    return PostImage
}