$(document).ready(function(){
	var messages = document.getElementsByClassName('message');
	for(var i = 0; i < messages.length; i++) {
		emojify.run(messages[i]);
	}


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

	$('#espn').on("click", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/urls/messages/10";
		var data = "url=" + encodeURIComponent("http://espn.go.com/");
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

	$('#npr-morning').on("click", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/urls/messages/10";
		var data = "url=" + encodeURIComponent("http://www.npr.org/programs/morning-edition/");
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

	$('#espn-scores').on("click", function(e){
		e.preventDefault();
		var url = "http://104.131.117.55:3000/urls/messages/10";
		var data = "url=" + encodeURIComponent("http://scores.espn.go.com/mlb/recap/");
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