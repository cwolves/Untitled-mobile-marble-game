"use strict";

window.addEventListener( 'load', function(){
	var   orient = new $.Klass.HTML5.Orientation()
	  ,    touch = new $.Klass.HTML5.Touch()
	  ,   marble = new $.Klass.Game.Marble()
	  ,   levels = new $.Klass.Game.Levels( $.config.levels )
	  ,   zoomed = true
	  , maxAngle = 30
	  ,  gameDiv = $( '#game' );

	levels
		.bind( 'set:size', function( size ){
			gameDiv.className = size;
		} )
		.renderTo( gameDiv )
		.load( 3 );

	orient.bind( 'beta+gamma', function( beta, gamma ){
		var xDeg = Math.min( maxAngle, Math.max( -maxAngle, -beta || 0 ) )
		  , yDeg = Math.min( maxAngle, Math.max( -maxAngle, gamma || 0 ) );

		gameDiv.style['-webkit-transform'] = 'rotateX(' + xDeg + 'deg) rotateY(' + yDeg + 'deg)';
	} );

	touch.bind( 'click', function( ev ){
		if( zoomed ){
			levels.unZoom();
		}else{
			levels.zoom( ev.target );
		}
	} );
} );