$(document).ready(function(){
	$('#login').on("submit", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/login";
		debugger;
		var data = $(this).serialize();
		debugger;
		console.log(data);
		var request = $.ajax(url, {
			method: "post",
			contentType: "application/x-www-form-urlencoded",
			data: data
		});
		request.done(function(response){
			console.log(response);
		})
	});

	$('#register').on("submit", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/users";
		var data = $(this).serialize();
		console.log(data);
		var request = $.ajax(url, {
			method: "post",
			contentType: "application/x-www-form-urlencoded",
			data: data
		});
		request.done(function(response){
			console.log(response);
		})
	});

	$('#messages').on("submit", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/urls/messages/10";
		var data = $(this).serialize();
		console.log(data);
		var request = $.ajax(url, {
			method: "post",
			contentType: "application/x-www-form-urlencoded",
			data: data
		});
		request.done(function(response){
			console.log(response);
		})
	});
});