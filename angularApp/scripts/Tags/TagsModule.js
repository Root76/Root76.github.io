(function() {

	var TagsModule = angular.module('Tags', ['ngResource', 'TagServices']);

	TagsModule.controller('TagsController', ['$resource', '$scope', 'tagService',
		function($resource, $scope, tagService){

			$scope.selectedTag = false;
			$scope.selectTag = function() { $scope.selectedTag = true; };
		
		}]);

	TagsModule.controller('TagController', ['$resource', '$scope', '$stateParams', 'tagService',
		function($resource, $scope, $stateParams, tagService) {
			
			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;
			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;



			$scope.tagPromise = tagService.Tag.get({tag_id: $stateParams['tag_id']}, function(data) {
				console.log(data);
				$scope.tag = data;
			});

		}]);
})();