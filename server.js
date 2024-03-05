const express = require('express');
const cors = require('cors');
const db = require('./models');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const app = express();
const cookie = require('cookie-parser')
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie())

// Routes 
app.use('/api/auth',authRoutes)
app.use('/api/post', postRoutes);
app.use('/api/comment',commentRoutes)


//static images folder
app.use('/Images',express.static('./Images'))


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    // Set status code and send an error response
    res.status(500).send('Something went wrong!');
});



(async()=>{
    try {
        await db.sequelize.sync()
        console.log('Database synchronized successfully')
    } catch (error) {
        console.error('Error synchronizing database',error)
    }
})()

// Port
const PORT = process.env.PORT || 8000;

// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


