$(function(){

  // var socket = io.connect('/');

  var chatInfra = io.connect('/chat_infra');
  var chatCom = io.connect('/chat_com');

  var roomName = decodeURI((RegExp("room" + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
  console.log("roomname: " + roomName);

  var mbox = $('#messages');
  var minput = $('#message');

  if(roomName) {
    chatInfra.on('name_set', function(data){
      chatInfra.emit('join_room', {'name': roomName});
      $('#nameform').hide();
      mbox.append('<div class="systemMessage">Hello, ' + data.name + "</div>");
    });
  }

  chatCom.on('message', function(data){
    data = JSON.parse(data);
    mbox.append('<div class="' + data.type + '">' + data.username + ": " + data.message + "</div>");
  });

  chatInfra.on('message', function(data){
    data = JSON.parse(data);
    mbox.append('<div class="' + data.type + '">' + data.message + "</div>");
  });

  $('#send').click(function(){
    var data = {
      type: 'userMessage',
      message: minput.val()
    };

    chatCom.send(JSON.stringify(data));
    minput.val('');
  });

  $('#setname').click(function(){
    chatInfra.emit("set_name", {'name': $('#nickname').val()});
  });

  

  chatInfra.on('user_entered', function(user){
    mbox.append('<div class="systemMessage">' + user.name + " has join the room.</div>");
  });
});