$(document).ready(function() {

  $("input[type='checkbox']").on("click", function(){
    var error_id = $(this).attr("data");
    console.log(error_id);
    $.ajax({
      url: '/error/check/'+error_id,
      type: 'post'
    })
    .done(function(data) {
      console.log(data);
    })
    .fail(function() {
      console.log("error");
    })
    
  });
  
});