function renderNav(){
  var url = "http://localhost:8080/nav";
  
  $.ajax({
    type: "GET",
    url: url,
    dataType: "html",
    success: function(msg){
      //changes the html of the empty div into what the server sends back
      document.getElementById("nav_head").innerHTML = msg;
      }
    });
}
