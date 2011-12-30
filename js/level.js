"use strict";

( function( $ ){
	$.Klass.add( 'Level', $.Klass.Configurable, {
		edgeCharacters : '|-=/\\'

		, init : function init( conf ){
			this._super.apply( this, arguments );
			this.addConfigParameters( 'filename' );

			this.bind( 'set:filename', this.bindMethod( 'loadFile' ) );
		}

		, loadFile : function loadFile( path ){
			$.get( path, this.bindMethod( 'parseFile' ) );
		}

		, parseFile : function parseFile( data ){
			var  settings = data.match( /(?:\*[^\n]+\n)+/g )
			  ,     lines = data.replace( settings, '' )
			  ,   screens = lines.split( /(?:\.\n)+/g )
			  , i, l;

			this.maxLineLength = Math.max.apply( Math, lines.split( /\n/g ).map( function( line ){ return line.length; } ) );
			screens.forEach( this.bindMethod( 'parseScreen' ) );
		}

		, parseScreen : function parseScreen( data ){
			var   lines = data.split( /\n/g ).map( function( line ){ return line.split( '' ); } );
			  , $screen = $( '<div></div>' );
			  , i, l;

			this.drawSides( lines, $screen );
		}
		/*
		=====     ==========
		=====     \=========
		====/      \\    F
		===/        \\
		==/    S     =======
		=/           =======
		====================
		             =======
		             =======
		=====\       =======
		======\     /=======

		    6
		  5   7
		4       0
		  3   1
		    2 
		*/
		, drawSides : function drawSides( lines, $screen ){
			var sides = []
			  ,   dir = 0
			  , i, l, j, m, chr, sX, sY, edge, xDir, yDir, nChr;

			for( i=0, l=lines.length; i<l; i++ ){
				for( j=0, m=lines[i].length; j<m; j++ ){
					chr = $.get2dAryElement( lines, i, j );

					// if the current character is an un-used edge
					if( ( chr == null ) || ( chr.used ) || !~this.edgeCharacters.indexOf( chr ) ){ continue; }

					// trace the edges of this shape
					sX   = i;
					sY   = j;
					edge = [ i, j ];
					xDir = {7:1,0:1,1:1,3:-1,4:-1,5:-1}[dir] || 0;
					yDir = {5:1,6:1,7:1,1:-1,2:-1,3:-1}[dir] || 0;

					while( nChr = $.get2dAryElement( i + xDir, j + yDir ) ){
						i += xDir;
						j += yDir;
					}

					// flood-fill to create the tops & mark as used from this position
					this.drawTops( lines, i, j );
				}
			}
		}

		, drawTops : function drawTops( lines, x, y ){
			
		}
	} );
}() );
