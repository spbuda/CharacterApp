angular.module('characterApp').directive('ngPlumb', ['$rootScope', 'sourceAnchors', 'connectionAnchors', 'plumbConfig', function(app, sourceAnchors, connectionAnchors, opts) {
	function link (scope,element,attrs) {
		var node = $(element)[0];
		node.id = "node_" + scope.skill.id;
		
		app.jsPlumbInstance.bind("connection", function(i,c) {
			var parent = $(i.source).closest(".node").scope();
			var child = $(i.target).closest(".node").scope();
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

		function makeConnections(node, scope){
			var el = $(node).find(".nodeCreate")[0].id;// + node.skill.id;
			for(var i=0; i<scope.skill.connections.length; i++){
				var targ = $("#node_" + scope.skill.connections[i]).find(".nodeText")[0].id;// + node.skill.connections[i];
				connect(el,targ);//,20);
			}
		}

		function attemptConnect(el, targ, tries){
			if($("#"+targ).length > 0 && $("#"+el).length > 0){
				connect(el,targ);
				repaint();
			}
			else if(tries > 0){
				setTimeout(function(){attemptConnect(el,targ, tries-1);},500);
			}
		}

		function connect(el, targ){
			app.jsPlumbInstance.connect({source:el, target:targ});
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

			app.jsPlumbInstance.makeSource($(node).find(".nodeCreate"), {					
				filter:function(evt, el) {
					var t = evt.target || evt.srcElement;
					return t.tagName !== "A";
				},
				isSource:true,
				maxConnections:-1
			});			
			
			app.jsPlumbInstance.makeTarget($(node).find(".nodeText"), {				
				dropOptions:{ hoverClass:"hover" },
				uniqueEndpoint:false
			});

			setTimeout(function(){makeConnections(node, scope);},0);
		});

		jsPlumb.fire("nodeCreated", app.jsPlumbInstance);
		
	}
	
	return {
		link:link
	};
}]);