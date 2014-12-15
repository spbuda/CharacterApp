angular.module('characterApp').controller('characterController', ['$scope', 'DataService', function($scope, DataService) {
	console.log('Promise is now resolved: ' + DataService.getControllerObject()
	);
	
	/*
		//TODO: add this to the code
		if(!i)
			i = index;
		if(!objects || objects.length <= i)
			return null;
	*/
}]);