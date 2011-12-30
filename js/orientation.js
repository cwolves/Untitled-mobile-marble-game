( function( $ ){
	var logged = false;

	// interface to the compass that gets normalized
	$.Klass.add( 'HTML5.Orientation', $.Klass.Observable, {
		init : function( config ){
			this._super();

			window.addEventListner( 'deviceorientation', this.bindMethod( 'orientationChange' ), true );
			this.degrees = 0;
			this.config  = config;
		}

		, orientationChange : function( ev ){
			/**
			 * beta  = angle that top of device is pointing
			 * gamma = angle that side of device is pointing
			 * 
			 * In portrait only: if gamma closer to 0, pointing back.  If closer to +- 180, pointing forward
			 **/
			var     oEv = ev.originalEvent
			  , heading = oEv.webkitCompassHeading - ( this.config.zeroDeg || 0 )
			  ,    beta = oEv.beta
			  ,   gamma = oEv.gamma
			  ,  orient = window.orientation
			  , aOrient = window.orientation % 180
			  ,   angle = ( aOrient ? gamma : beta );

			// ignore bad data
			if( oEv.webkitCompassAccuracy == -1 ){ this.trigger( 'bad-compass' ); return; }
			if( oEv.webkitCompassAccuracy >= 30 ){ this.trigger( 'inaccurate-compass' ); return; }

			// I think this means it's warming up :)
			if( oEv.webkitCompassAccuracy == 0  ){ return; }

			// normalize left or bottom being up
			if( ( 90 === orient ) || ( 180 === orient ) ){
				angle = -angle;
			}

			// if in portrait and leaning forward, flip the angle around 90deg
			if( !aOrient ){
				if( Math.abs( gamma ) > 90 ){
					angle = 180 - angle;
				}
			}

			// normalize compass fliping from 0-->359 or visa-versa
			if( this.lastHeading && ( Math.abs( heading - this.lastHeading ) > 180 ) ){
				this.lastHeading = 360-this.lastHeading;
			}

			if( !this.heading ){ this.heading = heading; }

			this.trigger( 'heading', this.heading = this.heading + heading - this.lastHeading );
			this.trigger( 'angle', this.angle = angle );

			this.lastHeading = heading;
		}
	} );
}( $ ) );