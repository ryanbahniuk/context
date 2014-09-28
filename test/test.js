$(document).ready(function(){
	$('form').on("submit", function(e){
		e.preventDefault();
		var url = "http://localhost:3000/login";
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