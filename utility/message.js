const moment =require("moment")

class Message
{
    constructor(userName,msg)
    {
        this.userName=userName
        this.msg=msg
        this.time=moment().format("h:mm a")
    }
}
module.exports=Message