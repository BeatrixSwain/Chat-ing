
var typing=false
var timeout=undefined
getUser();
const socket = io()//Si hay algún problema, habría que indicar el dominio si se despliega desde otro dominio. <-- codigo del front end para conectarse con el servidor.

//Dom elements
let username = document.getElementById("username");
let message = document.getElementById("message");
let button = document.getElementById("enviar");
let output = document.getElementById("chat-output");
let actions = document.getElementById("chat-actions");


//Events
button.addEventListener('click', function(){
    sendMessage();
});

message.addEventListener('keypress', function(e){
    if(e.key !='Enter'){
        socket.emit('chat:typing', {user:username.value, typing:true});
        clearTimeout(timeout)
        timeout=setTimeout(typingTimeout, 1500)
    }else{
        clearTimeout(timeout)
        timeout=setTimeout(typingTimeout, 1500)
        sendMessage()
        e.preventDefault();
    }
    
});

socket.on('server:message',(data)=>{
    let classMe = '';
    if (data.user==username.value){
        classMe = ' itsme';
    }
    output.innerHTML += `<p class="msg-line${classMe}"><span>${data.user}: </span>${data.message}</p>`
    output.scrollTop = output.scrollHeight;
})


socket.on('server:someonetyping', (data)=>{
    if(data.typing==true){
        actions.innerHTML = `<p class="chattyping"><span>${data.user} </span>is typing...</p>`
    }else{
        actions.innerHTML = ``
    }
  })

  function getUser() {
    //Get name
    let GET = {};
    let queryString = window.location.search.replace(/^\?/, '');
    queryString.split(/\&/).forEach(function (keyValuePair) {
        var paramKey = keyValuePair.replace(/=.*$/, ""); // some decoding is probably necessary
        var paramValue = keyValuePair.replace(/^[^=]*\=/, ""); // some decoding is probably necessary
        GET[paramKey] = paramValue;
    });

    if (GET["username"] != undefined) {
        if (GET["username"].length > 0) {
            document.getElementById("username").value = GET["username"]
            document.getElementById("username").disabled = true;
        } else {
            console.log("Ops")
            window.location.replace("../index.html");

        }
    } else {
        console.log("Ops")
        window.location.replace("../index.html");
    }
}

function typingTimeout(){
    typing=false
    socket.emit('chat:typing', {user:username.value, typing:false})
}

function sendMessage(){
    socket.emit('chat:message', {
        user: username.value,
        message: message.value
    });
    message.value = "";
}

