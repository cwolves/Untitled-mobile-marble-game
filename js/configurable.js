(function( $ ){
	$.Klass.add( 'Configurable', $.Klass.Observable, {
		init : function init( config /*, optName, optName, optName, optName*/ ){
			var i, l;

			// call Observable constructor
			this._super();

			this.allowedConfigParameters = {};
			this.config                  = {};
			this.baseConfig              = config || {};

			// every extra argument is considered a valid config parameter
			this.addConfigParameters.apply( this, [].slice.call( arguments, 1 ) );

			// now apply all options in config
			this.set( config );
		}

		, addConfigParameters : function addConfigParameters(){
			var opts = [].slice.call( arguments, 0 )
			  , conf = {}
			  , i, l;

			for( i=0, l=opts.length; i<l; i++ ){
				if( 'string' !== typeof( opts[i] ) ){ continue; }

				this.allowedConfigParameters[ opts[i] ] = 1;

				// copy any config params that are defined as valid after initial load
				if( !this.config[ opts[i] ] && this.baseConfig[ opts[i] ] ){
					conf[ opts[i] ] = this.baseConfig[ opts[i] ];
				}
			}
			return this.set( conf );
		}

		// takes all known options from config and applies to self
		, set : function set( config, val /* opt */ ){
			var opt, i, l, args, conf;

			if( 'string' === typeof( config ) ){
				conf = {};
				i    = 0;
				args = arguments;

				while( 'string' === typeof( args[i] ) ){
					conf[ args[ i ] ] = args[ i+1 ];
					i+=2;
				}
				config = conf;
			}

			for( opt in config ){
				// Sanity check for Object.prototype idiocy
				if( !config.hasOwnProperty( opt ) ){ continue; }

				// to prevent accidental function replacement
				if( !this.allowedConfigParameters[ opt ] ){ continue; }

				this.config[ opt ] = config[ opt ];

				// convienience method -- set this.opt
				this[ opt ] = config[ opt ];

				this.triggerAndCache( 'set:' + opt, config[ opt ] );
			}

			return this;
		}

		, get: function get( param ){
			return this.config[ param ];
		}
	});
}( $ ));