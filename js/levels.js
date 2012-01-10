"use strict";

( function( $ ){
	// interface to the compass that gets normalized
	$.Klass.add( 'Game.Levels', $.Klass.Configurable, {
		init : function init( conf ){
			this._super.apply( this, arguments );
			this.addConfigParameters( 'count', 'path', 'size' );
		}

		, load : function load( lvl ){
			var self = this;

			this.level && this.level.destroy();
			this.level = new $.Klass.Game.Level({
				filename : this.config.path + lvl + '.txt'
			})
			.bind( 'set:size', function( size ){
				self.set( 'size', size );
			} )
			.renderTo( this.domNode );

			return this;
		}

		, unZoom : function unZoom(){
			this.level && this.level.unZoom();

			return this;
		}

		, zoom : function zoom( node ){
			this.level && this.level.zoom.apply( this.level, arguments );

			return this;
		}

		, renderTo : function renderTo( node ){
			this.domNode = node;

			return this;
		}
	} );
}( $ ) );
