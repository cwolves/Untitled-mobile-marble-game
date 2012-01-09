"use strict";

window.$ = {
	log : function(){
		console && console.log && console.log.apply( console, arguments );
	}

	, toArray : function( ary ){
		return [].slice.call( ary );
	}

	// todo: fallback if this doesn't exist
	, isArray : Array.isArray

	, get : function get( path, cb ){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = handler;
		xhr.open( 'GET', path, true );
		xhr.send();

		xhr.onreadystatechange = function(){
			if( xhr.readyState != 4 ){ return; }

			cb( xhr.responseText );
		}
	}

	, get2dAryElement : function get2dAryElement( ary, x, y ){
		return null != ary[x] ? null != ary[x][y] ? ary[x][y] : null : null;
	}
};