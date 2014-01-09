//ONLOAD
$(document).ready(function(){
	
	setTimeout(function(){

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