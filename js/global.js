"use strict";

window.$ = function( id ){
	return document.getElementById( id.substr( 1 ) );
};


window.$.log = function(){
	console && console.log && console.log.apply( console, arguments );
};


window.$.toArray = function( ary ){
	return [].slice.call( ary );
};


// todo: fallback if this doesn't exist
window.$.isArray = Array.isArray;


window.$.get = function get( path, cb ){
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', path, true );

	xhr.onreadystatechange = function(){
		if( xhr.readyState != 4 ){ return; }

		cb( xhr.responseText );
	}

	xhr.send();
};


window.$.get2dAryElement = function get2dAryElement( ary, x, y ){
	return null != ary[x] ? null != ary[x][y] ? ary[x][y] : null : null;
};