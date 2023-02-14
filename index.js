const express= require('express');
const socketio=require('socket.io');
const http=require('http');
const toTitleCase=require('./utility/toTitleCase.js')

const {addUser,removeUser,getUser,getUsersInRoom}=require('./user.js');
const PORT=process.env.PORT||5000;
const router = require('./router');
const app = express();
const server=http.createServer(app);
require('dotenv').config();
const cors=require('cors');
corsOptions={
    cors: true,
    origins:process.env.origin,
   }
   const io = socketio(server, corsOptions);

   app.use(router);
   app.use(cors());
io.on('connection',(socket)=>{
    socket.on('join',({name,room},callback)=>{
        const {error,user}=addUser({id:socket.id,name,room});

        if(error) return callback(error);
        socket.join(user.room);

        socket.emit('message',{user:'admin',text:`${toTitleCase(user.name)},welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${toTitleCase(user.name)} has joined`});

        
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});

        callback();
    });     
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);

        io.to(user.room).emit('message',{user:user.name,text:message});
        io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});
        callback();
    });
    socket.on('disconnect',()=>{
        const user= removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message',{user:"admin",text:`${toTitleCase(user.name)} has left.`})
            io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});
        }
    });
});


app.use(router);
server.listen(PORT,()=>console.log(`--Server has started on port ${PORT}--`));;