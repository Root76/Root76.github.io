//ONLOAD
$(document).ready(function(){
	
	setTimeout(function(){

		function QueryStringToJSON() {            
		    var pairs = location.search.slice(1).split('&');
		    
		    var result = {};
		    pairs.forEach(function(pair) {
		        pair = pair.split('=');
		        result[pair[0]] = decodeURIComponent(pair[1] || '');
		    });

		    return JSON.parse(JSON.stringify(result));
		}

		var query_string = QueryStringToJSON();
		console.log ("query string: " + query_string.authentication_token);
		console.log ("email: " + query_string.user_email);
		$("#loggedin").find("span").html(query_string.user_email);

		$('form').submit(function(){
			console.log('woohoo');
			window.location.href = "http://staging-krqwhjugxs.elasticbeanstalk.com/users/auth/google_oauth2";
			return false;
		});

	    $(".listitem").accordion({
	        active: false,
	        collapsible: true
	    });

	}, 100);

});

/*

$('.dropdown-menu').hover(function(event){
	$(event.target).parent().css("background", "#e9e8e5");
}, function(event) {
	$(event.target).parent().css("background", "#fff");
});

*/