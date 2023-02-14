const users =[];
let nameCount=0;
function addUser({id,name,room}){ 
    name=name.trim().toLowerCase();
    room=room.trim().toLowerCase();

    const existingUser=users.find((user)=> user.room===room&&user.name===name);
    if(existingUser) {
        nameCount++;
        newName=name+nameCount.toString();
        return addUser({id,name:newName,room}); 
    }
   
    const user={id,room,name}
    users.push(user);
    return {user}
}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>user.id===id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser=(id)=> users.find((user)=>user.id==id);

const getUsersInRoom=(room)=>users.filter((user)=>user.room=room)

module.exports={addUser,removeUser,getUser,getUsersInRoom};