$("#signUpBtn").click(function(event){
    event.preventDefault();
    var userName = $.trim($("#userName").val());
    var userPsw = $.trim($("#userPsw").val());
    var userEmail = $.trim($("#userEmail").val());
    
    var userInfo = {
        "userName": userName,
        "userPsw": userPsw,
        "userEmail": userEmail
    };


    console.log("client side", userInfo);

    $.ajax({
        type: "post",
        url: "register-user",
        data: userInfo
    }).done(function(res){
        if(res.status == 200){
            console.log(res.status);
            $("#userName").val("");
            $("#userPsw").val("");
            $("#userEmail").val("");

        } else if(res.status == 404){
            console.log(res.answer);
        }
    });

    
});

$("#logInBtn").click(function(event){
    event.preventDefault();
    var userName = $.trim($("#userName").val());
    var userPsw = $.trim($("#userPsw").val());
    var userEmail = $.trim($("#userEmail").val());
    
    var userInfo = {
        "userName": userName,
        "userPsw": userPsw,
        "userEmail": userEmail
    };

    console.log("client side", userInfo);

    $.ajax({
        type: "post",
        url: "verify-user",
        data: userInfo
    }).done(function(res){
        if(res.status == 200){
            console.log(res.status);
            window.location.assign("chatRoom.html");
            $("#userName").val("");
            $("#userPsw").val("");

        } else if(res.status == 404){
            console.log(res.answer);
        }
    });   
});


