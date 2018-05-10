var socket = io.connect("http://10.130.176.138:3000");

$(document).ready(function(){
    socket.emit("chat history", function(data){    
    });

    socket.on("all chat history", function(data) {
        $("#chatroom").append(data.content);
    });
});
            
$("#inputMessage").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#btnSend").click();
    }
});

$("#btnSend").click(function() {
    let message = inputMessage.value;
    console.log(message);
    socket.emit("chat message", {"message": message});
    $("#inputMessage").val('');
    $("inputMessage").focus();
});


socket.on("new message", function(data) {
    $("#chatroom").append("<p class='message'>" + data.username + ": " + data.message + "</p>");
    var d = $('#chatroom');
    d.scrollTop(d.prop("scrollHeight"));
});