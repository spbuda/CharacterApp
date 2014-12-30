angular.module('characterApp').controller('SkillController', ['$scope', 'PlumbService', function($scope, PlumbService) {
	//TODO: Undo
	
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
			removeWithUndo(item);
			$scope.deleteSkills = false;
		}
	}

	$scope.undoBuffer = [];
	function setUndo(items){
		$scope.undoBuffer = items.concat($scope.undoBuffer);
	}
	
	function removeWithUndo(item){
		var removed = remove(item);
		setUndo(removed);
	}
	
	function remove(item){
		var connections = PlumbService.remove(item);
		var index = $scope.character.skill.skills.indexOf(item.skill);
		var element = [{item:$scope.character.skill.skills.splice(index,1)[0], connections:connections}];
		return element;
	}
	
	function undo(){
		var undid = $scope.undoBuffer.shift();
		if(undid != null){
			$scope.character.skill.skills.push(undid.item);
			setTimeout(function(){undoConnections(undid.connections)},0);
		}
		else{
			console.log("Nothing to undo");
		}
	}
	
	function undoConnections(connections){
		for(var i=0;i<connections.length;i++){
			PlumbService.connect(connections[i].source, connections[i].target);
		}
	}
	
	$scope.undo = function(){
		undo();
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