angular.module('skillApp').controller('skillController', ['$scope', 'plumbService', function($scope, plumbService) {
	/* var initialized = false; */
	function getSkillId(){
		var id = skill_id;
		skill_id ++;
		return id;
	}
	
	function newSkill(){
		return skill = {
			id: getSkillId(),
			skill: "",
			rolls: [],
			position: defaultPosition(),
			connections: []
		};
	}
	
	function defaultPosition(){
		return {x:50, y:75};
	}
	
	/* $scope.plumbService = plumbService; */
	
	$scope.addSkill = function(){
		$scope.skills.push(newSkill());
	}
	
	var skill_id = 0;
	$scope.deleteMode = false;
	
	/* $scope.$watch(function(scope) {return scope.skills}, function(newValue, oldValue){
		var newArr = [];
		for(var i=0; i<newValue.length; i++){
			if(!initialized){
				var isIn = false;
				for(var j=0; j<oldValue.length; j++){
					if(newValue[i].id == oldValue[j].id){
						isIn = true;
					}
				}
			}
			newArr.push($("#skill_"+newValue[i].id));
		}
		plumbService.addElements(newArr);
		initialized = true;
	}); */
	
	$scope.skills = [];
	
	function getTestSkill(){
		return {
			id:getSkillId(),
			skill:"Test",
			rolls:[3,4],
			position: defaultPosition(),
			connections:[]
		};
	};
	$scope.skills.push(getTestSkill());
}]);