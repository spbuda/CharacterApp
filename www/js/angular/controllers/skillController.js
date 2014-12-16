angular.module('characterApp').constant('modelName','skill').controller('skillController', ['$scope', 'modelName', function($scope, modelName) {
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
	
	$scope.checkRemove = function(item){
		if($scope.deleteSkills === true){
			remove(item);
			$scope.deleteSkills = false;
		}
	}
	
	function remove(item){
		$scope.character.skills.splice(item.skill.id,1);
	}
	
	$scope.addSkill = function(){
		$scope.character.skills.push(newSkill());
	}
	
	$scope.editNumber = function(element){
		if($scope.deleteSkills !== true){
			$("#editNodeNumberModal").modal({overlayClose:true, onShow:function(){
				$("#editNodeNumberModal input").val(element.skill.rolls.toString());
			}, onClose:function(){
				var arr = $("#editNodeNumberModal input").val().split(/\D+/g);
				element.skill.rolls = arr;
				$scope.$digest();
				$.modal.close();
			}});
		}
	}

	$scope.editText = function(element){
		if(($scope.deleteMode !== true)){
			$("#editNodeTextModal").modal({overlayClose:true, onShow:function(){
				$("#editNodeTextModal textarea").val(element.skill.skill);
				$.modal();
			}, onClose:function(){
				element.skill.skill = $("#editNodeTextModal textarea").val();
				$scope.$digest();
				$.modal.close();
			}});
		}
	};
	
	var skill_id = 0;
	$scope.deleteSkills = false;
	
	function getTestSkill(){
		return {
			id:getSkillId(),
			skill:"Test",
			rolls:[3,4],
			position: defaultPosition(),
			connections:[]
		};
	};
	/* $scope.skills.push(getTestSkill()); */
}]);