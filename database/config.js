/* 
    user: root;
    pass: R43r9ZINlCuBpzG4;
 */

const mongoose = require('mongoose');

const redis = require('redis');

const dbConnectionMongo = async() => {
    try {
        console.log('DB online');
        await mongoose.connect('mongodb+srv://admin:admin123@cluster0.dgmfo.mongodb.net/taller-nosql-2020', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la  ver logs');
    }
};

const getRedisClient = () => redis.createClient(6379);

module.exports = {
    dbConnectionMongo,
    getRedisClient
};