const express=require("express")
const http=require("http")
const socketio=require("socket.io")
let users=[[],[],[],[]]
const bot="Chatbot"
// get username and room from url

const app=express()
const server=http.createServer(app)
const io=socketio(server)

const Message=require("./utility/message")
// const users=require("./utility/users")
//client connects         
io.on("connection",socket=>{
    const {username,room}=socket.handshake.query
    const userIndex=Number(room.replace("Room ",""))-1
  
   if(users[userIndex].includes(username))   
   {
  
       
    socket.emit("exist",true);   
    return

   }
   users[userIndex].push(username)
    socket.join(room)
        //broadcast
        socket.broadcast.to(room).emit("message",new Message(bot,`${username} has joined the Chat...`))
        
        socket.emit("message" , new  Message(bot,`Welcome ${username} to ${room}...`))

        io.to(room).emit("get-users",users[userIndex])
    
        
  

    
    
    // listeing chat messages
    socket.on("chat-message",(msg)=>{
        socket.broadcast.to(room).emit("message",new  Message(username,msg))
    })

    //runs when client disconnects  
    socket.on("disconnect",()=>{
        users[userIndex]=users[userIndex].filter(user=>user!==username)
        io.to(room).emit("get-users",users[userIndex])
        io.to(room).emit("message",new  Message(bot,`${username} has left...`))
    })
})  


const PORT=3000 || process.env.PORT

app.use(express.static("./public"))
server.listen(PORT,()=>{
    console.log(`Server is listening on PORT : ${PORT}`)
})     