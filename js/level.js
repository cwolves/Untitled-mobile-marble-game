"use strict";

( function( $ ){
	$.Klass.add( 'Game.Level', $.Klass.Configurable, {
		  edgeCharacters : '|-=/\\'
		, startCharacter : 'S'
		,   endCharacter : 'F'

		, init : function init( conf ){
			this._super.apply( this, arguments );
			this.addConfigParameters( 'filename', 'size' );

			this.wMult = 1;
			this.hMult = 1;

			this.bind( 'set:filename', this.bindMethod( 'loadFile' ) );
		}

		, loadFile : function loadFile( path ){
			$.get( path, this.bindMethod( 'parseFile' ) );

			return this;
		}

		, parseFile : function parseFile( data ){
			this.fileData = data;
			this.render();

			return this;
		}

		, render : function render(){
			if( !this.fileData || !this.domNode ){ return; }

			var      data = this.fileData
			  ,  settings = data.match( /(?:\*[^\n]+\n)+/g )
			  ,     lines = data.replace( settings, '' )
			  ,   screens = lines.split( /(?:\.\n)+/g )
			  ,    maxLen = Math.max.apply( Math, lines.split( /\n/g ).map( function( line ){ return line.length; } ) )
			  , i, l;

			this.maxLineLength = maxLen;
			
			// normalize line lenghts and split each screen into lines
			screens = screens.map( function( scr ){
				return scr.split( /\n/g ).map( function( line ){
					return ( line + new Array( maxLen - line.length + 1 ).join( ' ' ) ).split( '' ).map( function( chr ){ return ( chr === ' ' ) ? '' : chr; } );
				} );
			} );

			// TODO: allow flip orientation
			this.set( 'size', {
				  '2' : 'two-by-one'
				, '3' : 'three-by-one'
				, '4' : 'two-by-two'
			}[ screens.length ] );

			screens.forEach( this.bindMethod( 'parseScreen' ) );

			return this;
		}

		, parseScreen : function parseScreen( lines ){
			var screen = document.createElement( 'div' )
			  , i, l;
			// lines.forEach( function( line, ix ){
			// 	lines[ ix ] = line.split( '' ).map( function( chr ){ return ( chr===' ' ) ? '' : chr; } );
			// } );

			screen.className = 'screen';

			this.domNode.appendChild( screen );

			this.screenW = screen.offsetWidth;
			this.screenH = screen.offsetHeight;
			
			this.createSides( lines, screen );

			return this;
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

		W-E   top
		W-E   bottom
		N-S   left
		N-S   right
		NW-SE left
		NW-SE right
		NE-SW left
		NE-SW right
		*/
		, createSides : function createSides( lines, screen ){
			var  sides = {}
			  ,    dir = 0
			  ,   side = 0
			  , height = this.height = lines.length
			  ,  width =  this.width = lines[0].length
			  , x, y, l, m, chr, sX, sY, edge, xDir, yDir, nChr, ary;

			for( y=0, l=lines.length; y<l; y++ ){
				for( x=0, m=lines[y].length; x<m; x++ ){
					chr = $.get2dAryElement( lines, y, x );

					// if the current character is used, ignore
					if( ( chr == null ) || ( chr.used ) ){ continue; }

					if( chr === this.startCharacter ){
						this.drawMarbleAt( y, x, l, m, screen );

					} else if( chr === this.endCharacter ){
						this.drawExitAt( y, x, l, m, screen );

					} else if( !~this.edgeCharacters.indexOf( chr ) ){
						// not sure what to do with this (or it's blank)
						continue;
					}

					// TODO: draw longer edges at once
					switch( chr ){
						case '=': case '|': case '-':
							// check top
							if( !$.get2dAryElement( lines, y-1, x ) ){
								ary = [ x+1, y, x, y ];
								sides[ ary.join( '-' ) ] = ary;
							}

							// check right
							if( !$.get2dAryElement( lines, y, x+1 ) ){
								ary = [ x+1, y+1, x+1, y ];
								sides[ ary.join( '-' ) ] = ary;
							}

							// check bottom
							if( !$.get2dAryElement( lines, y+1, x ) ){
								ary = [ x, y+1, x+1, y+1 ];
								sides[ ary.join( '-' ) ] = ary;
							}

							// check left
							if( !$.get2dAryElement( lines, y, x-1 ) ){
								ary = [ x, y, x, y+1 ];
								sides[ ary.join( '-' ) ] = ary;
							}

							break;

						case '/':
							// check right
							if( !$.get2dAryElement( lines, y, x+1 ) ){
								ary = [ x, y+1, x+1, y ];
								sides[ ary.join( '-' ) ] = ary;

							// check bottom
							}else if( !$.get2dAryElement( lines, y+1, x ) ){
								ary = [ x, y+1, x+1, y+1 ];
								sides[ ary.join( '-' ) ] = ary;
							}

							// check left
							if( !$.get2dAryElement( lines, y, x-1 ) ){
								ary = [ x+1, y, x, y+1 ];
								sides[ ary.join( '-' ) ] = ary;

							// check top
							}else if( !$.get2dAryElement( lines, y-1, x ) ){
								ary = [ x+1, y, x, y ];
								sides[ ary.join( '-' ) ] = ary;
							}
							break;

						case '\\':
							// check right
							if( !$.get2dAryElement( lines, y, x+1 ) ){
								ary = [ x+1, y+1, x, y ];
								sides[ ary.join( '-' ) ] = ary;

							// check top
							}else if( !$.get2dAryElement( lines, y-1, x ) ){
								ary = [ x+1, y, x, y ];
								sides[ ary.join( '-' ) ] = ary;
							}

							// check left
							if( !$.get2dAryElement( lines, y, x-1 ) ){
								ary = [ x, y, x+1, y+1 ];
								sides[ ary.join( '-' ) ] = ary;

							// check bottom
							}else if( !$.get2dAryElement( lines, y+1, x ) ){
								ary = [ x, y+1, x+1, y+1 ];
								sides[ ary.join( '-' ) ] = ary;
							}
							break;
					}

					// original thoughts of logic
					// // figure out the direction 
					// 
					// // trace the edges of this shape
					// sX   = i;
					// sY   = j;
					// edge = [ i, j ];
					// xDir = {7:1,0:1,1:1,3:-1,4:-1,5:-1}[dir] || 0;
					// yDir = {5:1,6:1,7:1,1:-1,2:-1,3:-1}[dir] || 0;
					// 
					// while( nChr = $.get2dAryElement( i + xDir, j + yDir ) && ~this.edgeCharacters.indexOf( nChr ) ){
					// 	i += xDir;
					// 	j += yDir;
					// }

					// flood-fill to create the tops & mark as used from this position
			//		this.drawTops( lines, y, x );
				}
			}

			this.drawSides( sides, screen );

			return this;
		}

		, drawSides : function drawSides( sides, screen ){
			var n, s, div, w, h, len, dx, dy, item;

			for( n in sides ){
				s    = sides[n]; 
				dx   = s[2] - s[0];
				dy   = s[3] - s[1];
				
				// go backwards
				while( sides[ item = [ s[0] - dx, s[1] - dy, s[0], s[1] ].join( '-' ) ] ){
					s[0] -= dx;
					s[1] -= dy;
				
					delete sides[ item ];
				}
				
				// go forwards
				while( sides[ item = [ s[2], s[3], s[2] + dx, s[3] + dy ].join( '-' ) ] ){
					s[2] += dx;
					s[3] += dy;
				
					delete sides[ item ];
				}

				w    = ( s[0] - s[2] ) / this.width  * this.screenW;
				h    = ( s[1] - s[3] ) / this.height * this.screenH;
				len  = Math.sqrt( w*w + h*h );

				div  = document.createElement( 'DIV' );
				div.className = 'wall';
				div.style.cssText = 
					  'width:' + len + 'px; '
					+ 'top: '  + ( s[1] / this.height * this.screenH ) + 'px; '
					+ 'left: ' + ( s[0] / this.width * this.screenW ) + 'px; '
					+ '-webkit-transform:rotateX( 90deg ) rotateY( ' + Math.atan2( -h, -w ) * 180 / Math.PI + 'deg );';

				screen.appendChild( div );
			}
		}

		, drawExitAt : function drawExitAt( y, x, yMax, xMax, screen ){
			var exit = document.createElement( 'div' );

			exit.className     = 'hole';
			exit.style.cssText = 
				  'left:'   + (100*(x+.5)/xMax) + '%;'
				+ 'top:'    + (100*(y+.5)/yMax) + '%;';

			screen.appendChild( exit );

			return this;
		}

		, drawMarbleAt : function drawMarbleAt( y, x, yMax, xMax, screen ){
			
		}

		, drawTops : function drawTops( lines, x, y ){
			return this;
		}

		, destroy : function destroy(){

		}

		, renderTo : function renderTo( node ){
			this.domNode = node;
			this.render();

			return this;
		}
	} );
}( $ ) );
