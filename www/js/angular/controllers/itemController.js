angular.module('characterApp').controller('ItemController', ['$scope', function($scope) {
	function exists(obj){
		return (typeof(obj)!=='undefined' && obj!==null && obj!==NaN);
	}
	
	function Item(description, count, disabled){
		this.description = exists(description) ? description : "";
		this.count = exists(count) ? count : 1;
		this.disabled = exists(disabled) ? disabled : false;
	}
	
	$scope.itemDisplay = function(item){
		if(item.count < 1){
			return "disabled";
		}
		else if(item.disabled){
			return "disabled";
		}
		else{
			return "";
		}
	}
	
	$scope.addItem = function(){
		$scope.character.item.items.push(new Item());
	}
	
	$scope.removeItem = function(item){
		var index = $scope.character.item.items.indexOf(item);
		$scope.character.item.items.splice(index,1);
	}
	
	$scope.toggleDisabled = function(item){
		item.disabled = !item.disabled;
	}
	
	$scope.decrementCount = function(item){
		if(item.count > 0)
			item.count--;
	}
	
	$scope.incrementCount = function(item){
		item.count++;
	}
	
	$scope.editDescription = function(item){
		$("#editItemTextModal").modal({overlayClose:true, onShow:function(){
			$("#editItemTextModal input").val(item.description);
		}, onClose:function(){
			item.description = $("#editItemTextModal input").val();
			$scope.$digest();
			$.modal.close();
		}});
	}

	$scope.editCount = function(item){
		$("#editItemCountModal").modal({overlayClose:true, onShow:function(){
			$("#editItemCountModal input").val(item.count);
			$.modal();
		}, onClose:function(){
			var count =  parseFloat($("#editItemCountModal input").val());
			item.count = exists(count) ? count : 0;
			$scope.$digest();
			$.modal.close();
		}});
	};
}]);