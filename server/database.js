//database.js
const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('minecraft','root','', {
    host: '127.0.0.1',
    dialect: 'mysql'
})

async function connect () {
    try {
        await sequelize.authenticate();
        console.log('connection has been established successfully.');
    } catch (error) {
        console.error('เชื่อมต่อผิดพลาด')
    }
}

async function sync() {
    try{
        await sequelize.sync();
        console.log('symchtonized');
    }catch(error){
        console.log("error : ", error);
        
    }
    
}module.exports = {
    sequelize,
    connect,
    sync,
}