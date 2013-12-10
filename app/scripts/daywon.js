$('.subcontitem').click(function(event){
	if ($(event.target).hasClass('selected')) {
		$(event.target).removeClass('selected');
	} else {
		$(event.target).addClass('selected');
	}
});

/*

$('.dropdown-menu').hover(function(event){
	$(event.target).parent().css("background", "#e9e8e5");
}, function(event) {
	$(event.target).parent().css("background", "#fff");
});

*/