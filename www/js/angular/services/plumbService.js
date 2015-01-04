angular.module('characterApp').service('PlumbService', ['$rootScope', 'sourceAnchors', 'connectionAnchors', 'plumbConfig', function(app, sourceAnchors, connectionAnchors, config){
	function removePlumb(item){
		var connections = [];
		var parentId = $("#node_" + item.skill.id + " .nodeCreate").attr("id");
		var childId = $("#node_" + item.skill.id + " .nodeText").attr("id");
		connections = connections.concat(detach(parentId,false));
		connections = connections.concat(detach(childId,true));
		return connections;
	};
	
	function detach(id, isChild){
		var connections = [];
		if(typeof id != "undefined" && !!id){
			if(isChild)
				connections = app.jsPlumbInstance.getConnections({target:id});
			else
				connections = app.jsPlumbInstance.getConnections({source:id});
			app.jsPlumbInstance.detachAllConnections(id);
			app.jsPlumbInstance.removeAllEndpoints(id);
			app.jsPlumbInstance.detach(id);
		}
		return getConnectionIds(connections);
	}
	
	function getConnectionIds(connections){
		var conArr = [];
		var added = {}
		for(var i=0;i<connections.length;i++){
			var obj = connections[i];
			if(!added[obj.sourceId + "_" + obj.targetId]){
				conArr.push({source:obj.sourceId,target:obj.targetId});
				added[obj.sourceId + "_" + obj.targetId] = true;
			}
		}
		return conArr;
	}

	function makeConnections(node, connections){
		var el = $(node).find(".nodeCreate")[0].id;
		for(var i in connections){
			if (connections.hasOwnProperty(i)) {
				var targ = "nodeText_" + i;
				connect(el,targ);//,20);
			}
		}
	}
	
	function repaint(skill){
		if(typeof skill != "undefined" && skill != null){
			var id = skill.id;
			app.jsPlumbInstance.repaint(["node_"+id, "nodeText_"+id, "nodeCreate_"+id]);
		}
		else{
			app.jsPlumbInstance.repaintEverything();
		}
	}

	function connect(el, targ){
		app.jsPlumbInstance.connect({source:el, target:targ});
	}
	
	return {
		makeConnections : makeConnections,
		connect : connect,
		remove : removePlumb,
		repaint : repaint
	};
}]);