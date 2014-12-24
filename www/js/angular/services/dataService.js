angular.module('characterApp').service('DataService', ['$indexedDB', 'storeName', 'emptyCharacter', function($indexedDB, storeName, newObject){
	function generateUUID(){
		var d = performance.now();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	};
	
	var objectStore = $indexedDB.objectStore(storeName);
	var promise = objectStore.getAll();
	console.log("Promise created");
	
	function saveObjects(objects){
		objectStore.upsert(objects);
	};
	
	function getControllerObject(propertyName){
		return objects;
	};
	
	return {
		generateUUID : generateUUID,
		promise : promise,
		newObject : function(){return newObject;},
		save : saveObjects
	};
}]);