angular.module('characterApp').controller('characterController', ['$scope', '$interval', 'DataService', function($scope, $interval, DataService) {
	var characters = [];
	DataService.promise.then(function(results){
		if(results != null && results.length > 0){
			characters = results;
		}
		else{
			var newCharacter = DataService.newObject();
			newCharacter['guid'] = DataService.generateUUID();
			characters = [newCharacter];
			DataService.save(characters);
		}
		$scope.character = characters[0];
		console.log("DB Objects loaded.");
		//TODO: $interval(saveCharacters,30000);
	});
	
	function saveCharacters(){
		DataService.save(characters);
	}
	
	function changeCharacter(index) {
		var i = (index !== null && index < characters.length) ? index : 0;
		$scope.character = characters[i];
	}
}]);