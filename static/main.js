$(document).ready(function(){
	var socket = io.connect();
	var current_user;
	var scrollView = function(){
		$("#chat_room")[0].scrollTop = $("#chat_room")[0].scrollHeight;
	}
	var new_user = function(){
		var name = prompt("Please enter your name to chat");
		socket.emit("page_load", {user: name});
	}

	new_user();

	socket.on("existing_user", function(data){
		$("#error").html("<div class='alert alert-danger' role='alert'><strong>"+data.error+"</strong></div>");
		new_user();
	});

	socket.on("user_joined", function(data){
		$("#message_board").append("<li id='joined'>" + data.user + " joined</li>");
		scrollView();
	});

	socket.on("user_left", function(data){
		$("#message_board").append("<li id='left'>" + data.user + " left</li>");
		scrollView();
	});

	socket.on("load_messages", function(data){
		$("#error").html("");
		current_user = data.current_user;
		var messages = data.messages;
		var messages_thread = "";

		for(var i = 0; i < messages.length; i++){
			messages_thread += "<li><strong>" + messages[i].name + "</strong>: " + messages[i].message + "</li>";
		}

		$("#message_board").append(messages_thread);
		scrollView();
	});

	$("#new_message").submit(function(){
		socket.emit("new_message", {message: $("#message").val(), user: current_user});
		$("#message").val("");
		return false;
	});

	socket.on("post_new_message", function(data){
		$("#message_board").append("<li><strong>" + data.user + "</strong> (" + (new Date).toLocaleTimeString() + ")" + ": " + data.new_message + "</li>");
		scrollView();
	});
});