 var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

    // Initialize variables
  var $window = $(window);

  
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;  
  var curr_room = 1;

  var socket = io.connect('http://localhost:8080');

	// on connection to server, ask for user's name with an anonymous callback
	socket.on('connect', function(){
		// call the server-side function 'adduser' and send one parameter (value of prompt)
		console.log('call to server');
		socket.emit('adduser', prompt("What's your name?"));
	});

	// listener, whenever the server emits 'updatechat', this updates the chat body
	socket.on('updatechat', function (username, data) {
        connected=true;
        var color = getUsernameColor(username);
        if(username){
          $('#conversation').append('<b style="color:'+ color + '">'+username + ':</b> ' + data + '<br>');
        }
	});

	// listener, whenever the server emits 'updaterooms', this updates the room the client is in
	socket.on('updaterooms', function(rooms, current_room) {
		curr_room = current_room;
		$('#rooms').empty();
		$.each(rooms, function(key, value) {
			if(value == current_room){
				$('#rooms').append('<div>' + value + '</div>');
			}
			else {
				$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
			}
		});
	});

    // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
      if(data.username && curr_room ==  data.curr_room) 
         {
             var color = getUsernameColor(data.username);
            $('#typing').html('<b style="color:'+ color + '">'+ data.username   + ':</b> '+ 'is typing');
      }
  });

  socket.on('stop typing', function (data) {
     $('#typing').text('');
  });


	function switchRoom(room){
		socket.emit('switchRoom', room);
	}

// Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

	$(function() {
	// Load page
    // when the client clicks SEND
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
        
        socket.emit('stop typing');
        typing = false;

    });

    // when the client hits ENTER on their keyboard	
    $('#data').keypress(function(e) {
        updateTyping();

        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });

 

});