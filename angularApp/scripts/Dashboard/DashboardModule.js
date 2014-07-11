

(function(){

	var dashboardModule = angular.module('DashboardModule', []);

	dashboardModule.controller('DashboardController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
	function($scope, $resource, $modal, contactService, tagService, taskService, eventService){
		console.log("YOU'RE ON DASH");
		$('.subitem.subdash.ss2').addClass('fadeInto');
	}]);

})();
