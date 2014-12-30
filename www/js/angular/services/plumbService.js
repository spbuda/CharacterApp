angular.module('characterApp').service('PlumbService', ['$rootScope', function(app){
	function removePlumb(item){
		detach($("#node_" + item.skill.id + " .nodeCreate").attr("id"));
		detach($("#node_" + item.skill.id + " .nodeText").attr("id"));
	};
	
	function detach(id){
		app.jsPlumbInstance.detachAllConnections(id);
		app.jsPlumbInstance.removeAllEndpoints(id);
		app.jsPlumbInstance.detach(id);
	}
	
	return {
		remove : removePlumb
	};
}]);