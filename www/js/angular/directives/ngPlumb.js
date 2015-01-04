angular.module('characterApp').directive('ngPlumb', ['$rootScope', 'sourceAnchors', 'connectionAnchors', 'plumbConfig', 'PlumbService', function(app, sourceAnchors, connectionAnchors, opts, plumb) {
	function link (scope,element,attrs) {
		var node = $(element)[0];
		console.log($(element).length + " found" );
		var text = $(element).find(".nodeText")[0];
		var create = $(element).find(".nodeCreate")[0];
		// $(node).attr("id", "node_" + scope.skill.id);
		// $(text).attr("id", "nodeText_" + scope.skill.id)
		// $(create).attr("id", "nodeCreate_" + scope.skill.id);
		
		console.log("plumb created: { id:" + scope.skill.id + ", skill:\"" + scope.skill.skill + "\" }")
		
		app.jsPlumbInstance.bind("connection", function(i,c) {
			var parent = $(i.source).closest(".node").scope();
			var child = $(i.target).closest(".node").scope();
			var arr=app.jsPlumbInstance.getConnections({source:i.sourceId,target:i.targetId});
			if(arr.length>1 || parent.skill.id === child.skill.id){
				app.jsPlumbInstance.detach(i);
				console.log("connection denied: "+ parent.skill.id + " -> " + child.skill.id);
			}
			else{
				parent.skill.connections[child.skill.id] = child.skill.id;
				console.log("connection made: " + parent.skill.id + " -> " + child.skill.id);
			}
		});
		
		app.jsPlumbInstance.bind("connectionDetached", function(i,c) {
			var parent = $(i.source).closest(".node").scope();
			var child = $(i.target).closest(".node").scope();
			delete parent.skill.connections[child.skill.id];
			console.log("connection removed: " + parent.skill.id + " -> " + child.skill.id);
		});
		
		app.jsPlumbInstance.bind("connectionMoved", function(i,c) {
			var parent = $("#" + i.originalSourceId).closest(".node").scope();
			var child = $("#" + i.originalTargetId).closest(".node").scope();
			delete parent.skill.connections[child.skill.id];
			console.log("connection moved: " + parent.skill.id + " -> " + child.skill.id);
		});
		
		function update() {
			pos = $(this).position();
			if(scope.skill.position === null) scope.skill.position={};
			scope.skill.position.left = pos.left;
			scope.skill.position.top = pos.top;
			plumb.repaint(scope.skill);
		}
		
		var outOfBounds = function(){
			if($(this).position().top < $("#mainBanner").height())
				return true;
			else if($(this).position().left < $("#plumb").offset().left)
				return true;
			else
				return false;
		}

		setTimeout(function(){//Defers node connection until angular digest completes.
			// make them draggable
			app.jsPlumbInstance.draggable($(node), {revert:outOfBounds, drag:update, stop:update, handle:".nodeText"});
			
			// suspend drawing and initialize.
			app.jsPlumbInstance.doWhileSuspended(function() {

				app.jsPlumbInstance.makeSource($("#" + create.id), {					
					filter:function(evt, el) {
						var t = evt.target || evt.srcElement;
						return t.tagName !== "A";
					},
					isSource:true,
					maxConnections:-1
				});			
				
				app.jsPlumbInstance.makeTarget($("#" + text.id), {				
					dropOptions:{ hoverClass:"hover" },
					uniqueEndpoint:false
				});

					plumb.makeConnections(node, scope.skill.connections);
			});
			
			jsPlumb.fire("nodeCreated", app.jsPlumbInstance);
		},0);
		
	}
	
	return {
		link:link
	};
}]);