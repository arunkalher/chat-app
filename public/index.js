import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";


document.addEventListener("DOMContentLoaded", () => {
    const getCurrTime=()=>{
        let d=new Date()
        return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',"hour12":true}).toLowerCase()


    }
 
  
    const cssRoot = document.querySelector(":root")
    let socket=null
    let theme = true //white false-black
    let userN
    let scrolled=false
    let menu_expanded=false
    let prevRoom="Room 1"
    let setTime=null
    const changeTheme = () => {

        console.log("change theme")
        theme = !theme

        if (theme) {
            // white
            cssRoot.style.setProperty("--white", "white")
            cssRoot.style.setProperty("--black", "black")
            cssRoot.style.setProperty("--electric-blue-1", "var(--steel-blue")
            cssRoot.style.setProperty("--my-msg", "rgb(126 34 206)")
            
            document.getElementById("send-ico").src="./images//send.png"
            document.getElementById("theme-icon").style.justifyContent = "start"
        }
        else {
            cssRoot.style.setProperty("--white", "black")
            cssRoot.style.setProperty("--black", "white")
            cssRoot.style.setProperty("--electric-blue-1", "var(--electric-blue)")
            cssRoot.style.setProperty("--my-msg", "steelblue")
            document.getElementById("send-ico").src="./images//send-2.png"
            document.getElementById("theme-icon").style.justifyContent = "end"
        }
    }
    const dowmMenu=()=>{
        const downs=document.getElementsByClassName("room-down")
        document.getElementById("room0").innerText=""
      
        for(const down of downs)
        {   
            if(!menu_expanded)
            down.style.display="block"
        else
        down.style.display="none"
        }
        if(!menu_expanded)
        document.getElementById("down").innerText="▲"
        else
        document.getElementById("down").innerText="▼"
      
        if(menu_expanded)
        document.getElementById("room0").innerText=prevRoom
        
        menu_expanded=!menu_expanded
    }
    document.getElementById("down").addEventListener("click", () => { dowmMenu() })
    const rooms=document.getElementsByClassName("room-down")
    for (const room of rooms)
    {
        room.addEventListener("click",(event)=>{
            prevRoom=event.target.innerText
            document.getElementById("room0").innerText=event.target.innerText
            const downs=document.getElementsByClassName("room-down")
            for(const down of downs)
            {   
            down.style.display="none"
            }
        
      
        document.getElementById("down").innerText="▼"
        menu_expanded=false
       
       
        })
        menu_expanded=!menu_expanded
        
        
    }
  
    document.getElementById("show-users").addEventListener("click",(event)=>{
        if(event.target.innerText=="Show")
        {
            document.getElementById("users").style.display="block"
            document.getElementById("messages").style.flexBasis="65%"
            document.getElementById("show-users").innerText="Hide"
        }
        else{
            document.getElementById("users").style.display="none"
            document.getElementById("messages").style.flexBasis="95%"
            document.getElementById("show-users").innerText="Show"
        }
    })
    const updateUsers=(users)=>{
        document.getElementById("users-info").innerText="Online "+users.length
        document.getElementById("users").innerHTML=""
        for(let user of users)
        addUser(user)
    }
    const removeError=(ele)=>{
        console.log(ele)
        ele.style.display="none"
        setTime=null
    }
    document.getElementById("join").addEventListener("click",()=>{
        
        const username=document.getElementById("user").value
        const errorBlock=document.getElementById("error-msg")
       
        if(username=="")
       
    {
        if(setTime)
        {
            clearTimeout(setTime)
            setTime=null
        }
        
        errorBlock.innerText="Username should not be empty"
        errorBlock.style.display="block"
        setTime=setTimeout(removeError,2000,errorBlock)
        return

    }
    const room=document.getElementById("room0").innerText
    if(room=="")
       
    {
        if(setTime)
        {
        console.log("cleared")
            clearTimeout(setTime)
            setTime=null
        }
        errorBlock.innerText="Please select a room"
        errorBlock.style.display="block"
        setTime=setTimeout(removeError,2000,errorBlock)
        return

    }
        userN=username
        document.getElementById("room-info").innerText=room
        document.getElementById("chatbox").style.display="none"
        document.getElementById("chatbox-2").style.display="block"
        document.getElementById("messages").innerHTML=""
        document.getElementById("chatbox-2-h2").innerText="USER - "+username
        
        // sockets
        socket=io({
            query:{
              username:username,room:room
            }
        })
       
        socket.on("message",Msg=>{
            const {userName,msg,
                time}=Msg
            console.log(Msg)
                console.log(userName,time)
            addMessage(userName,time,msg)
            updateScroll()
        })
        socket.on("get-users",(users)=>{
            updateUsers(users)
        })
        socket.on("exist",()=>{
            socket.disconnect()
            document.getElementById("chatbox").style.display="block"
            document.getElementById("chatbox-2").style.display="none"
            console.log("exist")
            if(setTime)
            {
            console.log("cleared")
                clearTimeout(setTime)
                setTime=null
            }
        errorBlock.innerText="username already exists in room"
        errorBlock.style.display="block"
        setTime=setTimeout(removeError,2000,errorBlock)
        })
    })
    document.getElementById("leave").addEventListener("click",()=>{
        socket.disconnect()
        
        
        document.getElementById("chatbox").style.display="block"
        document.getElementById("chatbox-2").style.display="none"
        document.getElementById("user").value=""
        document.getElementById("room0").innerText="Room 1"
    })

    document.getElementById("theme-icon").addEventListener("click", () => { changeTheme() })
    const addMessage=(name,time,msg,me=false)=>
    {   
        const msg_wrap=document.createElement("section")
        if(me)
        msg_wrap.classList.add("msg-wrap-me")
        else
        msg_wrap.classList.add("msg-wrap")
        const message=document.createElement("section")
        message.classList.add("message")
        msg_wrap.appendChild(message)
        const msgName=document.createElement("div")
        const msgText=document.createElement("div")
        msgName.classList.add("msg-name")
        msgText.classList.add("msg-text")
        msgName.innerText=name+"  :  "+getCurrTime()
        msgText.innerText=msg
        message.appendChild(msgName)
        message.appendChild(msgText)
        document.getElementById("messages").appendChild(msg_wrap)
        
       
    }
    const addUser=(username)=>{
        const user=document.createElement("div")
        user.classList.add("user")
        user.innerText=username
        document.getElementById("users").appendChild(user)
        document.getElementById("users").appendChild(document.createElement("hr"))
    }

    const sendMessage=()=>{
        const msg=document.getElementById("msg").value
        console.log("m",msg)
        if(msg=="")
        return
        addMessage(userN,getCurrTime(),msg,true)
        console.log("a")
        console.log(getCurrTime())
        //emit a msg
        socket.emit("chat-message",msg)

        document.getElementById("msg").value=""
    }
   
    document.getElementById("send-ico").addEventListener("click", () => { sendMessage()
    updateScroll() })
    const updateScroll=()=>{
      
        const ele=document.getElementById("messages")
        ele.scrollTop=ele.scrollHeight
    }
   
   
    // addUser("arun")
    //   addMessage("user1","12:24","MSG")
    // addMessage("USER2","12:24","WDNDH DUWHDIUHWvuiugugjugiugiuhgiughjiukghkjughjkghkjghjkghghjhgjkguD DWHUI",true)
})