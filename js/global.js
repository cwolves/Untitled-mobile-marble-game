var $ = {
	log : function(){
		console && console.log && console.log.apply( console, arguments );
	}

	, toArray : function( ary ){
		return [].slice.call( ary );
	}

	// todo: fallback if this doesn't exist
	, isArray : Array.isArray
};