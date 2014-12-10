angular.module('skillApp').controller('skillController', ['$scope', function($scope) {
	$scope.skill_id = 1;
	$scope.skills = [
		{	id:0,
			skill:"Test",
			rolls:[3,4],
			position:{x:100, y:100},
			connections:[]
		}
    ];
}]);