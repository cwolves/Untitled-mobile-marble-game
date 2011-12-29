// TODO: reqEvents deferring doesn't work ATM if the reqEvent is triggered first :/

(function( $ ){
	$.Klass.Observable = $.Klass.extend({
		init : function(){
			this.observing = {};
			this.queue     = {}; // a queue of events that were called in the "wrong" order.  Fire when possible.
			this.cache     = {};
		}

		/* - event(s) on which this should fire (can be an array)
		 * - callback to fire
		 * - events that have to have already fired for this to occur (can be an array)
		 *
		 * In english (I hope): You're trying to observe an event, but another event MUST be run first (it gets data, etc).  Observe the event normally, and add the required event(s) to the 3rd arg
		 */

		, bind : function(events, callback, reqEvents){
			var i, l, obj;

			if( !this.observing ){
				$.log('Observable klass not properly instantiated.  Did you forget to call _super() from a subclass constructor?');
				return;
			}

			if( 'string' === typeof( events    ) ){    events = events   .split( ' ' ); }
			if( 'string' === typeof( reqEvents ) ){ reqEvents = reqEvents.split( ' ' ); }

			events    = events    ? [].concat(events)    : [];
			reqEvents = reqEvents ? [].concat(reqEvents) : [];

			// generate a hash for the array
			for( i=reqEvents.length-1; i>=0; i-- ){
				if(this.cache[reqEvents[i]]){
					reqEvents.splice(i, 1);
				}
				reqEvents[reqEvents[i]] = i;
			}

			for( i=0, l=events.length; i<l; i++ ){
				(this.observing[events[i]] = this.observing[events[i]] || []).push(obj = {
					cb: ( 'string' === typeof callback )
						// TODO: this logic shouldn't be in this file since the `set` method is from `configurable`
						? ~callback.indexOf( ':' )
							? this.bindMethod( 'set', callback.substr( callback.indexOf( ':' ) + 1 ) )
							: this.bindMethod( callback )
						: callback
					, req:reqEvents
				});

				// check to see if we already have data for this event in the cache
				if(this.cache[events[i]]){
					this
						.triggerEvent(obj, this.cache[events[i]])
						.checkQueue(events[i]);
				}
			}

			return this;
		}

		/**
		 * Takes N arguments as event, callback, event, callback, event, ....
		 *   or you can throw in 2 or 3-element arrays: [event, callback, req]
		 **/
		, bindEvents : function bindEvents(){
			var args = arguments
			  , i, l, fn;

			for( i=0, l=args.length; i<l; i++ ){
				if( $.isArray( args[i] ) ){
					if( ( 2 !== args[i].length ) && ( 3 !== args[i].length ) ){ throw new Error( 'invalid argument passed to bindEvents' ); }

					this.bind( args[i][0], args[i][1], args[i][2] );
				}else{
					if( i === (l-1) ){
						throw new Error( 'argument length mis-match in bindEvents' );
					}

					fn = args[ i+1 ];
					fn = ( 'function' === typeof( fn ) )
						? fn
						: ( 'function' === typeof( this[ fn ] ) )
						? this.bindMethod( fn )
						: null;

					if( !fn ){
						throw new Error( 'argument ' + fn + ' passed to bindEvents is not a valid function or method' );
					}

					this.bind( args[i], fn );
					i++;
				}
			}

			return this;
		}

		, stopObserving : function(event, callback){
			if(!this.observing[event]){ return; }

			var e, i;

			for( e=this.observing[event] || [], i=e.length-1; i>=0; i-- ){
				if(callback && (e[i].cb != callback)){ continue; }

				e.splice(i, 1);
			}

			return this;
		}

		, triggerEvent : function(e, args){
			var i, l, j, m;

			// check the cache and wipe any previously called events
			for( i=0, l=e.req.length; i<l; i++ ){
				if(this.cache[e.req[i]]){
					e.req[i] = '';
				}
			}

			// this function isn't ready to be called yet.  Queue it up.
			if(e.req.join('') != ''){
				var obj = {args: args, obj:e};
				for( j=0, m=e.req.length; j<m; j++ ){
					(this.queue[e.req[j]] = this.queue[e.req[j]] || []).push(obj);
				}
			}else{
				// fire all events that have no required events left to fire
				e.cb.apply(this, args);
			}

			return this;
		}

		, checkQueue : function(event){
			var i, l, e;

			// loop everything in the queue for this event
			for( i=0, e=this.queue[event] || [], l=e.length; i<l; i++ ){
				e[i].obj.req[e[i].obj.req[event]] = '';

				// event can be fired now
				if(e[i].obj.req.join('') == ''){
					e[i].obj.cb.apply(this, e[i].args);
				}
			}

			return this;
		}

		, trigger : function(event){
			var args = [].slice.apply(arguments)
			  , i, e, l;

			args.shift();

			for( i=0, e=this.observing[event] || [], l=e.length; i<l; i++ ){
				this.triggerEvent(e[i], args);
			}

			this.checkQueue(event);

			return this;
		}

		, triggerAndCache : function(event){
			var args = $.toArray(arguments);
			args.shift();

			this.cache[event] = args;

			return this.trigger.apply(this, arguments);
		}
	});
}( jQuery ));