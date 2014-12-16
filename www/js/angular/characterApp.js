angular.module('characterApp',['ngRoute','xc.indexedDB'])
.constant('dbName', 'character')
.constant('storeName', 'character')
.constant('version', 1)
.constant('emptyCharacter', {guid:"",bio:{},items:[],map:{},skills:[],trait:{}})
.value('jsPlumbInstance', {})
.value('index',0)
.config(function($indexedDBProvider, dbName, storeName, version) {
	$indexedDBProvider.connection(dbName)
	.upgradeDatabase(version, function(event, db, tx){
		db.createObjectStore(storeName, {keyPath: 'guid'});
	});
})
.service('DataService', ['$indexedDB', 'storeName', 'emptyCharacter', 'index', function($indexedDB, storeName, newObject){
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
		objectStore.insert(objects);
	};
	
	function getControllerObject(propertyName){
		return objects;
	}
	
	return {
		generateUUID : generateUUID,
		promise : promise,
		newObject : function(){return newObject;},
		save : saveObjects
	};
}])
.directive('ngPlumbArea', ['jsPlumbInstance', function(instance) {
	// list of possible anchor locations for the blue source element
	var sourceAnchors = [[ 0.05, 1, 0, 1 ],[ 0.27, 1, 0, 1 ],[ 0.5, 1, 0, 1 ],[ 0.73, 1, 0, 1 ],[ 0.95, 1, 0, 1 ]];
	var connectionAnchors = [[ 0.00, 0.75, 0, 0 ],[ 0.00, 0, 0, 0 ],[ 0.25, 0, 0, 0 ],[ 0.5, 0, 0, 0 ],[ 0.75, 0, 0, 0 ],[ 1, 0, 0, 0 ],[ 1, 0.75, 0, 0 ]];
	
	instance = window.instance = jsPlumb.getInstance({
		Anchors : [ sourceAnchors, connectionAnchors ],
		/* DragOptions : { cursor: "pointer", zIndex:2000 }, */
		EndpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
		Endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
		PaintStyle : {strokeStyle:"rgba(107, 164, 94, 1)",lineWidth:3},
		Container:"plumb"
	});

	jsPlumb.fire("jsPlumbInitialized", instance);

}])
.directive('ngPlumb', ['jsPlumbInstance', function(instance) {
	jsPlumb.ready(function() {
	});

	function link (scope,element,attrs) {
		var node = $(element)[0];
		
		instance.bind("connection", function(i,c) { 
			node
		});
		
		var outOfBounds = function(){
			if($(this).position().top < $("#mainBanner").height())
				return true;
			else if($(this).position().left < $("#plumb").offset().left)
				return true;
			else
				return false;
		}

		// make them draggable
		instance.draggable($(node), {revert:outOfBounds, drag:instance.repaintEverything, stop: instance.repaintEverything});

		// suspend drawing and initialise.
		instance.doWhileSuspended(function() {

			instance.makeSource($(node).find(".nodeCreate"), {					
				filter:function(evt, el) {
					var t = evt.target || evt.srcElement;
					return t.tagName !== "A";
				},
				isSource:true,
				maxConnections:-1
			});			
			
			instance.makeTarget($(node).find(".nodeText"), {				
				dropOptions:{ hoverClass:"hover" },
				uniqueEndpoint:false
			});
		});

		jsPlumb.fire("nodeCreated", instance);
	}
	
	return {
		link:link
	};
}]);