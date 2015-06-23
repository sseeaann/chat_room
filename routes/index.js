var users = [],
	numUsers = 0;
	messages = [];

var is_user = function(user){
	var users_count = users.length;

	for(var i = 0; i < users_count; i++){
		if(user == users[i]){
			return true;
		}
	}
	return false;
}

module.exports = function Route(app, server){
	var io = require("socket.io").listen(server);

	io.sockets.on("connection", function(socket){
		var addedUser = false;

		socket.on("page_load", function(data){
			socket.username = data.user;

			if(is_user(data.user) === true){
				socket.emit("existing_user", {error: "This user already exists"});
			} else {
				users.push(data.user);
				++numUsers;
				addedUser = true;
				socket.emit("login", {numUsers: numUsers, users: users});
				socket.emit("load_messages", {current_user: data.user, messages: messages});
				socket.broadcast.emit("user_joined", {
					user: socket.username,
					numUsers: numUsers
				});
			}
		});

		socket.on("new_message", function(data){
			messages.push({name: data.user, message: data.message, user: data.user});
			io.emit("post_new_message", {new_message: data.message, user: data.user});
		});

		socket.on("disconnect", function(data){
			if(addedUser){
				delete users[socket.username];
				--numUsers;
				socket.broadcast.emit("user_left", {
					user: socket.username,
					numUsers: numUsers
				});
			}
		});
	});

	app.get("/", function(req, res){
		res.render("index");
	});
};