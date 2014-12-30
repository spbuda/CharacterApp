angular.module('characterApp').directive('ngPlumb', ['$rootScope', 'sourceAnchors', 'connectionAnchors', 'plumbConfig', 'PlumbService', function(app, sourceAnchors, connectionAnchors, opts, plumb) {
	function link (scope,element,attrs) {
		var node = $(element)[0];
		var text = $(element).find(".nodeText")[0];
		var create = $(element).find(".nodeCreate")[0];
		$(node).attr("id", "node_" + scope.skill.id);
		$(text).attr("id", "nodeText_" + scope.skill.id)
		$(create).attr("id", "nodeCreate_" + scope.skill.id);
		
		app.jsPlumbInstance.bind("connection", function(i,c) {
			var parent = $(i.source).closest(".node").scope();
			var child = $(i.target).closest(".node").scope();
			var arr=app.jsPlumbInstance.getConnections({source:i.sourceId,target:i.targetId});
			if(arr.length>1){
				app.jsPlumbInstance.detach(i);
			}
			parent.skill.connections.push(child.skill.id);
			parent.skill.connections = parent.skill.connections.filter(function(value, index, self){return self.indexOf(value) === index;});
			console.log("made connection");
		});
		
		app.jsPlumbInstance.bind("connectionDetached", function(i,c) {
			var parent = $(i.source).closest(".node").scope();
			var child = $(i.target).closest(".node").scope();
			var index = parent.skill.connections.indexOf(child.skill.id);
			parent.skill.connections.splice(index,1);
			console.log("removed connection");
		});
		
		function repaint(){
			app.jsPlumbInstance.repaintEverything()
		}
		
		function update() {
			pos = $(this).position();
			if(scope.skill.position === null) scope.skill.position={};
			scope.skill.position.left = pos.left;
			scope.skill.position.top = pos.top;
			repaint();
		}
		
		var outOfBounds = function(){
			if($(this).position().top < $("#mainBanner").height())
				return true;
			else if($(this).position().left < $("#plumb").offset().left)
				return true;
			else
				return false;
		}

		// make them draggable
		app.jsPlumbInstance.draggable($(node), {revert:outOfBounds, drag:repaint, stop:update, handle:".nodeText"});

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
			
			app.jsPlumbInstance.makeTarget($("#"+text.id), {				
				dropOptions:{ hoverClass:"hover" },
				uniqueEndpoint:false
			});

			setTimeout(function(){plumb.makeConnections(node, scope.skill.connections);},0);
		});

		jsPlumb.fire("nodeCreated", app.jsPlumbInstance);
		
	}
	
	return {
		link:link
	};
}]);