angular.module('characterApp').controller('SkillController', ['$scope', function($scope) {	
	function getSkillId(){
		var id = $scope.character.skill.skill_id;
		$scope.character.skill.skill_id ++;
		return id;
	}
	
	function exists(obj){
		return (typeof(obj)!=='undefined' && obj!==null);
	}
	
	function Skill(skill, rolls, position, connections){
		this.id = getSkillId();
		this.skill = exists(skill) ? skill : "";
		this.rolls = exists(rolls) ? rolls : [];
		this.position = exists(position) ? position : {left:50, top:75};
		this.connections = exists(connections) ? connections : [];
	}
	
	$scope.checkRemove = function(item){
		if($scope.deleteSkills === true){
			remove(item);
			$scope.deleteSkills = false;
		}
	}
	
	function remove(item){
		var index = $scope.character.skill.skills.indexOf(item.skill);
		$scope.character.skill.skills.splice(index,1);
	}
	
	$scope.addSkill = function(){
		$scope.character.skill.skills.push(new Skill());
	}
	
	$scope.editNumber = function(element){
		if($scope.deleteSkills !== true){
			$("#editNodeNumberModal").modal({overlayClose:true, onShow:function(){
				if(element.skill.rolls !== null)
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
	
	$scope.deleteSkills = false;
}]);