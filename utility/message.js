const moment =require("moment")

const Message=(userName,msg)=>{
    return {
        userName,msg,
        time:moment().format("h:mm a")
    }
}
module.exports=Message