//Archivo principal
const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');
////////////////////
//Settings
app.set('port', process.env.PORT||3000); //Toma un puerto configurado y si no, el 3000


//Statics files.
app.use(express.static(path.join(__dirname, 'public')));

//Start
const server = app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
    
})

io = socketIO(server) //Mantiene la configuración

//Websockets.
//Cuando alguien se conectas
io.on('connection', (socket)=>{
    // console.log('New connection', socket.id); //Id del socket, que envía eventos diferentes.
    socket.on('chat:message',(data)=>{
        io.sockets.emit('server:message', data);
    })

    socket.on('chat:typing',(data)=>{
        //todos excepto yo
        socket.broadcast.emit('server:someonetyping', data);
    })

    
});