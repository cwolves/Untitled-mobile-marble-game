( function( $ ){
	// interface to the compass that gets normalized
	$.Klass.add( 'HTML5.Touch', $.Klass.Observable, {
		init : function init( node ){
			node || ( node = window );

			node.addEventListener( 'mousedown' , this.bindMethod( 'onTouchStart' ), true );
			node.addEventListener( 'mousemove' , this.bindMethod( 'onTouchMove'  ), true );
			node.addEventListener( 'mouseup'   , this.bindMethod( 'onTouchEnd'   ), true );

			node.addEventListener( 'touchstart', this.bindMethod( 'onTouchStart' ), true );
			node.addEventListener( 'touchmove' , this.bindMethod( 'onTouchMove'  ), true );
			node.addEventListener( 'touchend'  , this.bindMethod( 'onTouchEnd'   ), true );
		}

		, normalizeEv: function normalizeEv( ev ){
			if( ev.touches && ev.touches.length ){
				ev.pageX = ev.touches[0].pageX;
				ev.pageY = ev.touches[0].pageY;
			};
		}

		, onTouchStart: function onTouchStart( ev ){
			ev = this.normalizeEv( ev );

			this.touchEv  = this.lastEv = ev;
			this.movedFar = false;

			ev.preventDefault();
			return false;
		}

		, onTouchMove: function onTouchMove( ev ){
			ev = this.normalizeEv( ev );

			this.trigger( 'mouseMove', { x: ev.pageX, y: ev.pageY, dX: ev.pageX - this.lastEv.pageX, dY: ev.pageY - this.lastEv.pageY }, ev )

			// once mouse has moved >= 5px from start, don't trigger 'click' events from touch
			if( !this.movedFar && ( ( Math.abs( ev.pageX - this.lastEv.pageX ) > 5 ) || ( Math.abs( ev.pageY - this.lastEv.pageY ) > 5 ) ) ){
				this.movedFar = true;
			}
			this.lastEv = ev;
		}

		, onTouchEnd: function onTouchEnd( ev ){
			ev = this.normalizeEv( ev );

			var evObj = { x: ev.pageX, y: ev.pageY, dX: ev.pageX - this.lastEv.pageX, dY: ev.pageY - this.lastEv.pageY };

			if( !this.movedFar ){
				this.trigger( 'click', evObj );
			}
			this.trigger( 'mouseUp', evObj );

			ev.preventDefault();
			return false;
		}
	}
}( $ ) );
