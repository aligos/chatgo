function newestChat(){
  $("#messages").animate({
      scrollTop: $("#messages")[0].scrollHeight}, 2000);
  };

$(function(){
  var socket = null;
  var msgBox = $("#chatbox textarea");
  var messages = $("#messages");
  var bubble = $("#typing");
  var timeout;

  $("#chatbox").keyup(function() {
    typing = true;
    if (!socket) {
      alert("Error: There is no socket connection.");
      return false;
    }
    socket.send(JSON.stringify({"IsTyping": true}));
    clearTimeout(timeout);
    timeout = setTimeout(function(){
      typing = false;
      socket.send(JSON.stringify({"IsTyping": false}));
    }, 2000);
  });

  $("#chatbox").submit(function(){
    if (!msgBox.val()) return false;
    if (!socket) {
      alert("Error: There is no socket connection.");
      return false;
    }
    socket.send(JSON.stringify({"Message": msgBox.val()}));
    msgBox.val("");
    return false;
  });

  if (!window["WebSocket"]) {
    alert("Error: Your browser does not support web sockets.")
  } else {
    socket = new WebSocket("ws://"+window.location.host+"/room");
    
    socket.onclose = function() {
      alert("Connection has been closed.");
    }

    socket.onmessage = function(e) {
      var msg = JSON.parse(e.data);
      if (msg.IsTyping == true) {
        bubble.html(`<p class="saving">` + msg.Name + ` is typing<span>.</span><span>.</span><span>.</span></p>`);
      } else if (msg.Message != "") {
        messages.append(
          $("<article>").append(
            `
            <a class="link dt w-100 bb b--black-10 pb2 mt2 dim blue" href="#0">
              <div class="dtc w3">
                <img src="` + msg.AvatarURL + `" class="db w-100">
              </div>
              <div class="dtc v-top pl2">
                <h1 class="f6 f5-ns fw6 lh-title black mv0">` + msg.Name + `</h1>
                <h2 class="f6 fw4 mt2 mb0 black-60">` + msg.Message + `</h2>
              </div>
            </a>
            `
          )
        );
      } else {
        bubble.html(``);
      }
      newestChat();
    }
  }
});