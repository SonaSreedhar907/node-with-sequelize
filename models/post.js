module.exports = (sequelize,DataTypes)=>{
   const Post = sequelize.define('post',{
    userId:{
        type : DataTypes.STRING,
        allowNull: false
    },
    content:{
        type : DataTypes.STRING,
        allowNull : false
    },
    title:{
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    image : {
        type : DataTypes.STRING,
        defaultValue : 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    category:{
        type: DataTypes.STRING,
        defaultValue : 'uncategorized'
    },
    slug:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
   },{
    timestamps:true,
    freezeTableName : true,
})

   return Post
}