( function( $ ){
	var hasTouch = false
	  , touchEv, lastEv, movedFar;

	window.addEventListener( 'click'     , onClick     , true );
	window.addEventListener( 'touchstart', onTouchStart, true );
	window.addEventListener( 'touchmove' , onTouchMove , true );
	window.addEventListener( 'touchend'  , onTouchEnd  , true );

	function onClick( ev ) {
		GAME.trigger( 'click', { x: ev.pageX, y: ev.pageY, dX: ev.pageX - lastEv.pageX, dY: ev.pageY - lastEv.pageY } );
	}

	function unbindClickHandler() {
		window.removeEventListener( 'click', onClick, true );
		hasTouch = true;

		ev.preventDefault();
		return false;
	}

	function onTouchStart( ev ) {
		if( !hasTouch ){ unbindClickHandler(); }

		touchEv = lastEv = ev;
		movedFar = false;

		ev.preventDefault();
		return false;
	}

	function onTouchMove( ev ) {
		GAME.trigger( 'mouseMove', { x: ev.pageX, y: ev.pageY, dX: ev.pageX - lastEv.pageX, dY: ev.pageY - lastEv.pageY }, ev )

		// once mouse has moved >= 5px from start, don't trigger 'click' events from touch
		if( !movedFar && ( ( Math.abs( ev.pageX - lastEv.pageX ) > 5 ) || ( Math.abs( ev.pageY - lastEv.pageY ) > 5 ) ) ){
			movedFar = true;
		}
		lastEv = ev;
	}

	function onTouchEnd( ev ) {
		var evObj = { x: ev.pageX, y: ev.pageY, dX: ev.pageX - lastEv.pageX, dY: ev.pageY - lastEv.pageY };

		if( !movedFar ){
			GAME.trigger( 'click', evObj );
		}
		GAME.trigger( 'mouseUp', evObj );

		ev.preventDefault();
		return false;
	}
}( $ ) );
