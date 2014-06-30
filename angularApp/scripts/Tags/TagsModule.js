(function() {

	var TagsModule = angular.module('Tags', ['ngResource', 'TagServices']);

	TagsModule.controller('TagsController', ['$resource', '$scope', 'tagService',
		function($resource, $scope, tagService){

			$scope.selectedTag = false;
			$scope.selectTag = function() { $scope.selectedTag = true; };
		
		}]);

	TagsModule.controller('TagController', ['$resource', '$scope', '$stateParams', 'tagService',
		function($resource, $scope, $stateParams, tagService) {
			
			$scope.tagPromise = tagService.Tag.get({tag_id: $stateParams['tag_id']}, function(data) {
				console.log(data);
				$scope.tag = data;
			});

		}]);
})();