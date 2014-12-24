angular.module('characterApp').directive('ngPlumb', ['$rootScope', function(app) {
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
			parent.skill.connections.splice(child.skill.id,1);
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
				var targ = $("#node_" + scope.skill.connections[i] + " .nodeText")[0].id;// + node.skill.connections[i];
				setTimeout(function(){attemptConnect(el,targ,20);},1000);
			}
		}

		function attemptConnect(el, targ, trys){
			if($("#"+targ).length > 0 && $("#"+el).length > 0){
				connect(el,targ);
				repaint();
			}
			else if(trys > 0){
				setTimeout(function(){attemptConnect(el,targ, trys-1);},500);
			}
		}

		function connect(el, targ){
			jsPlumb.connect({source:el, target:targ,
			endpointStyles : [{ fillStyle:"rgba(107, 164, 94, 1)" }, { fillStyle:"rgba(221, 221, 221, 1)" }],
			endpoints : [ ["Dot", { radius:6 } ], [ "Dot", { radius:6 } ] ],
			paintStyle : {strokeStyle:"rgba(107, 164, 94, 1)", lineWidth:3}});
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
		app.jsPlumbInstance.draggable($(node), {revert:outOfBounds, drag:repaint, stop:update});

		// suspend drawing and initialise.
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

		    if (scope.$last){
		      makeConnections(node, scope);
		    }
		});

		jsPlumb.fire("nodeCreated", app.jsPlumbInstance);
		
	}
	
	return {
		link:link
	};
}]);