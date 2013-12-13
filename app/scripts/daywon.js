//ONLOAD

setTimeout(function(){

	$('.subcontitem').click(function(event){
		console.log ("clicked");
		if ($(event.target).hasClass('selected')) {
			$(event.target).removeClass('selected');
		} else {
			$(event.target).addClass('selected');
		}
	});

	$('#collapseall').click(function(){
		$('.listitem').accordion({
		    active: false,
		    collapsible: true            
		});
	});

	$('#expandall').click(function(){
		var accord;
        var accords = $('.mainsort');
        for (var a = 0; a < accords.length; a++) {
			accord = accords[a];
			if ($(accord).attr("aria-selected", "false")) {
				accord.click();
			} else {
				return false;
			}
        }
    });

	setTimeout(function(){
		$(".listitem").accordion({
		    active: false,
			collapsible: true 
		});
	}, 100);

}, 100);

/*

$('.dropdown-menu').hover(function(event){
	$(event.target).parent().css("background", "#e9e8e5");
}, function(event) {
	$(event.target).parent().css("background", "#fff");
});

*/