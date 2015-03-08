angular.module('characterApp').directive('ngDraw', ['$rootScope', function(app) {
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			var ctx = element[0].getContext('2d');
			var scaleElId = element[0].id;
			var clearBtnId = "";
			if(attrs["imageSelector"] && attrs["imageSelector"] !== ""){
				scaleElId = attrs["imageSelector"];
			}
			if(attrs["clearButton"] && attrs["clearButton"] !== ""){
				clearBtnId = attrs["clearButton"];
			}
			
			function resizeCanvas(){
				ctx.canvas.width = parseInt($(scaleElId).css("width"));
				ctx.canvas.height = parseInt($(scaleElId).css("height"));
				$(element).css("width", $(scaleElId).css("width"));
				$(element).css("height", $(scaleElId).css("height"));
			}
			
			resizeCanvas();
			
			$(scaleElId).each(function() {
				if (this.complete)
					resizeCanvas();
				else
					$(this).load(resizeCanvas);
			}); 
			// variable that decides if something should be drawn on mousemove
			var drawing = false;

			// the last coordinates before the current move
			var lastX;
			var lastY;

			function setModelToCanvas(){
				if(scope && attrs["ngModel"]){
					var property = attrs["ngModel"];
					var model = scope;
					var props = property.split(".");
					try{
						for(var i=0; i<props.length; i++){
							model = model[props[i]];
						}
						if(model != null){
							var img = new Image;
							img.onload = function(){
								ctx.drawImage(img,0,0); // Or at whatever offset you like
							};
							img.src = model;
						}
					}
					catch(e){
						console.log(e);
					}
				}
			}

			function setModelFromCanvas(){
				if(scope && attrs["ngModel"]){
					var data = element[0].toDataURL();
					var property = attrs["ngModel"];
					var model = scope;
					var props = property.split(".");
					try{
						for(var i=0; i<props.length-1; i++){
							model = model[props[i]];
						}
						model[props[props.length-1]] = data;
					}
					catch(e){
						console.log(e);
					}
				}
			}

			if(scope && attrs["ngModel"]){
				scope.$watch(attrs["ngModel"],function(newVal, oldVal){
					setModelToCanvas();
				});
			}

			element.bind('mousedown touchstart', function(event){
				if(event.offsetX!==undefined){
					lastX = event.offsetX;
					lastY = event.offsetY;
				} else { // Firefox compatibility
					lastX = event.layerX - event.currentTarget.offsetLeft;
					lastY = event.layerY - event.currentTarget.offsetTop;
				}

				// begins new line
				ctx.beginPath();

				drawing = true;
			});
			
			element.bind('mousemove touchmove', function(event){
				if(drawing){
					// get current mouse position
					if(event.offsetX!==undefined){
						currentX = event.offsetX;
						currentY = event.offsetY;
					} else {
						currentX = event.touches[0].pageX - event.currentTarget.offsetLeft;
						currentY = event.touches[0].pageY - event.currentTarget.offsetTop;
					}

					draw(lastX, lastY, currentX, currentY);

					// set current coordinates to last one
					lastX = currentX;
					lastY = currentY;
				}
			});

			$(window).bind('mouseup touchend', function(event){
				// stop drawing
				drawing = false;
				setModelFromCanvas();
			});

			// canvas reset
			function reset(){
				element[0].width = element[0].width;
				setModelFromCanvas();
			}
			$(clearBtnId).on('click', reset);

			function draw(lX, lY, cX, cY){
				// line from
				ctx.moveTo(lX,lY);
				// to
				ctx.lineTo(cX,cY);
				// color
				ctx.strokeStyle = "#4bf";
				// draw it
				ctx.stroke();
			}
		}
	};
}]);