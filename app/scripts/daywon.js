//ONLOAD
$(document).ready(function(){
	
	setTimeout(function(){

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