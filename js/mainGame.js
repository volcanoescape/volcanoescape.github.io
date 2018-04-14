			(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()
			var box9, box8, box7, box10, floor, floor2;
			var audio, playbtn, music, pausebtn, slectLevelBtn, iceyBtn, chemicalBtn;
			var rockObject;
			var camera, scene, renderer, controls;
			var gamePause;
			var objects = [], objects2 = [], objects3 = [];
			var boundBoxes = [];
			var raycaster;
			var score = 0;
			var icey = false;
			var floorColour = 0x615D5A, floorColour2 = 0x803E00, floorColour3 = 0x000000, wallColour = 0xD2691E;
			var lavaColour = 0xD2691E, lavaColour2 = 0xE60000, lavaColour3 = 0x661400;
			var blocker = document.getElementById( 'blocker' );
			var instructions = document.getElementById( 'instructions' );
			var selectMenu = document.getElementById( 'selectMenu' );
            var menuScreen = document.getElementById("menuScreen");
			var pauseScreen = document.getElementById("pauseScreen");
			var selectScreen = document.getElementById("selectScreen");
			var defPointerLockElement = document.body; 
			var defPointerUnlockElement = document; 
			defPointerLockElement.requestPointerLock = defPointerLockElement.requestPointerLock || 
					defPointerLockElement.mozRequestPointerLock || 
					defPointerLockElement.webkitRequestPointerLock;
			
			defPointerUnlockElement.exitPointerLock = defPointerUnlockElement.exitPointerLock ||
					defPointerUnlockElement.mozExitPointerLock ||
					defPointerUnlockElement.webkitExitPointerLock;
			function mainMenuMusic(){
			music = new Audio();
			music.src = "audio/menuMusic.mp3";
			music.loop = true;
			music.play();
			}
			window.addEventListener("load", mainMenuMusic);
		
			function initAudioPlayer(){
			music.muted=true;
			audio = new Audio();
			audio.src = "audio/gameplayMusic.mp3";
			audio.loop = true;
			audio.play();
			}
			function switchTrack(){
			audio.muted=true;
			music.muted=false;
			}
            playbtn = document.getElementById("playBtn");
			playbtn.addEventListener("click", initAudioPlayer);
			iceyBtn = document.getElementById("iceyBtn");
			chemicalBtn = document.getElementById("chemicalBtn");
			iceyBtn.addEventListener("click", initAudioPlayer);
			chemicalBtn.addEventListener("click", initAudioPlayer);
			quitbtn = document.getElementById("quitBtn");
			quitbtn.addEventListener("click", switchTrack);
            document.addEventListener("click", (e) => {
				
				switch (e.target.id) {
					//#region menuScreen
					case "playBtn":
						defPointerLockElement.requestPointerLock();
						menuScreen.style.display = "none";
						break;
					case "slectLevelBtn":
						selectMenu.style.display = "block";
						menuScreen.style.display = "none";
                     break;

					case"iceyBtn":
						defPointerLockElement.requestPointerLock();
				        selectMenu.style.display = "none";
				        icey = true;
					break;

					case"chemicalBtn":
						 defPointerLockElement.requestPointerLock();
				       	 selectMenu.style.display = "none";
					break;
						    
					case "helpBtn":
						
						instructions.style.display = "block";
						menuScreen.style.display = "none";
						break;
					case "backBtn":
						window.location.reload();
						defPointerUnlockElement.exitPointerLock();
						menuScreen.style.display = "block";
						blocker.style.display = "block";
						pauseScreen.style.display = "none";
						break;
					
					case "continueBtn":
						defPointerLockElement.requestPointerLock();
						break;
					case "quitBtn":
					 	window.location.reload();
						defPointerUnlockElement.exitPointerLock();
						menuScreen.style.display = "block";
						blocker.style.display = "block";
						pauseScreen.style.display = "none";
				}
			});
			// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
			if ( havePointerLock ) {
				var element = document.body;
				var pointerlockchange = function ( event ) {
					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
						controlsEnabled = true;
						controls.enabled = true;
						blocker.style.display = 'none';
						pauseScreen.style.display = 'none';
					} else {
						controls.enabled = false;
						blocker.style.display = 'block';
						instructions.style.display = '';
						selectMenu.style.display = '';
						pauseScreen.style.display = 'block';
					}
				};
				var pointerlockerror = function ( event ) {
					instructions.style.display = '';
					selectMenu.style.display = '';
				};
				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
				instructions.addEventListener( 'click', function ( event ) {
					instructions.style.display = 'none';
					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
					element.requestPointerLock();
				}, false );
			} else {
				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
			}
			
			var onProgress = function ( xhr ) {
				if ( xhr.lengthComputable ) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					console.log( Math.round(percentComplete, 2) + '% downloaded' );
				}
			};
			var onError = function ( xhr ) { };
			
			function spawnRockObject(x,y,z){
				rockObject.position.x = x;
				rockObject.position.y = y;
				rockObject.position.z = z;
				rockObject.castShadow = true;
				rockObject.scale.set( 5, 5, 5 )
				rockObject.receiveShadow = true;
				scene.add( rockObject );
			}
			
			init();
			
			var controlsEnabled = false;
			var moveForward = false;
			var moveBackward = false;
			var moveLeft = false;
			var moveRight = false;
			var canJump = false;
			var prevTime = performance.now();
			var velocity = new THREE.Vector3();
			var direction = new THREE.Vector3();
            var floorGeometry;
            var floorGeometry2;
            var wallGeometry;
            var wallGeometry2;
            var wallGeometry3;
            var wallGeometry4;
			function init() {
				var mtlLoader = new THREE.MTLLoader();
				mtlLoader.load( 'models/Rock1.mtl', function( materials ) {
					materials.preload();
					var objLoader = new THREE.OBJLoader();
					objLoader.setMaterials( materials );
					objLoader.load( 'models/Rock1.obj', function ( object ) {
						camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 350 );
						scene = new THREE.Scene();
						scene.background = new THREE.Color( 0x660000 );
						scene.fog = new THREE.Fog( 0x800000, 0, 200 );
						var light = new THREE.HemisphereLight( 0xeeeeff, 0x53535f, 0.75 );
						light.position.set( 0.5, 1, 0.75 );
						scene.add( light );
						controls = new THREE.PointerLockControls( camera );
						scene.add( controls.getObject() );
						var onKeyDown = function ( event ) {
							switch ( event.keyCode ) {
								case 38: // up
								case 87: // w
									moveForward = true;
									break;
								case 37: // left
								case 65: // a
									moveLeft = true; break;
								case 40: // down
								case 83: // s
									moveBackward = true;
									break;
								case 39: // right
								case 68: // d
									moveRight = true;
									break;
								case 32: // space
									if ( canJump === true ) velocity.y += 250;
									canJump = false;
									break;
							}
						};
						var onKeyUp = function ( event ) {
							switch( event.keyCode ) {
								case 38: // up
								case 87: // w
									moveForward = false;
									break;
								case 37: // left
								case 65: // a
									moveLeft = false;
									break;
								case 40: // down
								case 83: // s
									moveBackward = false;
									break;
								case 39: // right
								case 68: // d
									moveRight = false;
									break;
							}
						};
		                
						document.addEventListener( 'keydown', onKeyDown, false );
						document.addEventListener( 'keyup', onKeyUp, false );
		     

		     // change map colours//
		              if (icey == true ){
                 floorColour = 0xFFFFFF; 
                 floorColour2 = 0xD7DBFF;
                 floorColour3 = 0xA8AFE3; 
                 wallColour = 0xD9F8FD;
			     lavaColour = 0x0921D2; 
			     lavaColour2 = 0x8490F0; 
			     lavaColour3 = 0x3E4FCC;
                }
                        //----------------------------------------------------------------//
		                // floor and cubes//
		                //----------------------------------------------------------------//
              
                wallGeometry = new THREE.PlaneGeometry( 300, 10000, 360,160 );
                for ( var i = 0, l = wallGeometry.vertices.length; i < l; i ++ ) {
					var vertex = wallGeometry.vertices[ i ];
					vertex.x += Math.random() * 30 - 5;
					vertex.y += Math.random() * 3 + 5000;
					vertex.z += Math.random() * 30 + 70;               
				}   

			
				wallGeometry2 = new THREE.PlaneGeometry( 300, 10000, 360,160 );
                wallGeometry2.rotateY( - Math.PI / 2 );
                for ( var i = 0, l = wallGeometry2.vertices.length; i < l; i ++ ) {
					var vertex = wallGeometry2.vertices[ i ];
					vertex.x += Math.random() * 30 - 95;
					vertex.y += Math.random() * 3 + 5000;
					vertex.z += Math.random() * 30 - 5;
				}
               wallGeometry3 = new THREE.PlaneGeometry( 300, 10000, 360,160 );
                for ( var i = 0, l = wallGeometry3.vertices.length; i < l; i ++ ) {
					var vertex = wallGeometry3.vertices[ i ];
			        vertex.x += Math.random() * 30 - 5;
					vertex.y += Math.random() * 3 + 5000;
					vertex.z += Math.random() * 30 - 80;
				}
                  wallGeometry4 = new THREE.PlaneGeometry( 300, 10000, 360,160 );
                  wallGeometry4.rotateY( - Math.PI / 2 );
                for ( var i = 0, l = wallGeometry4.vertices.length; i < l; i ++ ) {
					var vertex = wallGeometry4.vertices[ i ];
				    vertex.x += Math.random() * 30 + 70;
					vertex.y += Math.random() * 3 + 5000;
					vertex.z += Math.random() * 30 - 5;
				}
		        floorGeometry = new THREE.PlaneGeometry( 200, 200, 70, 70 );
				floorGeometry.rotateX( - Math.PI / 2 );
				for ( var i = 0, l = floorGeometry.vertices.length; i < l; i ++ ) {
				var vertex = floorGeometry.vertices[ i ];
				vertex.x += Math.random() * 15 - 10;
				vertex.y += Math.random() * 5;
				vertex.z += Math.random() * 15 - 10;
			   }
			   for ( var i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
						var face4 = floorGeometry.faces[ i ];
						face4.vertexColors[ 0 ] = new THREE.Color(lavaColour);
						face4.vertexColors[ 1 ] = new THREE.Color(lavaColour2);
						face4.vertexColors[ 2 ] = new THREE.Color(lavaColour3);
					}
			    floorGeometry2 = new THREE.PlaneGeometry( 200, 200, 30, 30 );
				floorGeometry2.rotateX( - Math.PI / 2 );
				for ( var i = 0, l = floorGeometry2.vertices.length; i < l; i ++ ) {
				var vertex2 = floorGeometry2.vertices[ i ];
				vertex2.x += Math.random() * 15 - 10;
				vertex2.y += Math.random() * 1;
				vertex2.z += Math.random() * 15 - 10;
			   }
			   for ( var i = 0, l = floorGeometry2.faces.length; i < l; i ++ ) {
						var face5 = floorGeometry2.faces[ i ];
						face5.vertexColors[ 0 ] = new THREE.Color(floorColour);
						face5.vertexColors[ 1 ] = new THREE.Color(floorColour2);
						face5.vertexColors[ 2 ] = new THREE.Color(floorColour3);
					}
				 var boxGeometry = new THREE.BoxGeometry( 13, 0.01, 13);
				for ( var i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
				var face1 = floorGeometry.faces[ i ];
				}
				 var boxGeometry2 = new THREE.BoxGeometry( 16, 0.01, 16);
				for ( var i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
				var face2 = floorGeometry.faces[ i ];
				}
				var boxGeometry3 = new THREE.BoxGeometry( 21, 0.01, 21);
				for ( var i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
				var face3 = floorGeometry.faces[ i ];
				}
		
						var wallMaterial = new THREE.MeshBasicMaterial({ color: wallColour,  specular: 0xFFFFFF, flatShading: true} );
						var wall = new THREE.Mesh( wallGeometry, wallMaterial );
						var wall2 = new THREE.Mesh( wallGeometry2, wallMaterial );
					    var wall3 = new THREE.Mesh( wallGeometry3, wallMaterial );
						var wall4 = new THREE.Mesh( wallGeometry4, wallMaterial );
						scene.add(wall, wall2, wall3, wall4);

						// objects
						var boxMaterial = new THREE.MeshPhongMaterial({color:0xff0000, transparent:true, opacity:0, side: THREE.DoubleSide});
						for ( var i = 0; i < 500; i ++ ) {
							var box = new THREE.Mesh( boxGeometry, boxMaterial );
							var randomXPos = Math.floor( Math.random() * 20 - 8.85  ) * 6;
							var randomYPos = Math.floor( Math.random() * 600 ) * 18 + 10;
							var randomZPos = Math.floor( Math.random() * 20 - 8 ) * 6;
							box.position.x = randomXPos;
							box.position.y = randomYPos;
							box.position.z = randomZPos;
							var object2 = object.clone();
							object2.position.x = randomXPos;
							object2.position.y = randomYPos-6;
							object2.position.z = randomZPos;
							object2.castShadow = true;
							object2.scale.set( 4, 10, 4 )
							object2.receiveShadow = true;
							object2.visible = true;
							scene.add( object2 );
							scene.add( box );
							objects.push( box );
						}
					      
	                    var boxMaterial2 = new THREE.MeshPhongMaterial({color:0xff0000, transparent:true, opacity:0, side: THREE.DoubleSide});
						for ( var i = 0; i < 1600; i ++ ) {
							var box2 = new THREE.Mesh( boxGeometry2, boxMaterial2 );
							var randomXPos = Math.floor( Math.random() * 20 - 8.85) * 6;
							var randomYPos = Math.floor( Math.random() * 600 ) * 18 + 10;
							var randomZPos = Math.floor( Math.random() * 20 - 8 ) * 6;
							box2.position.x = randomXPos;
							box2.position.y = randomYPos;
							box2.position.z = randomZPos;
							var object3 = object.clone();
							object3.position.x = randomXPos;
							object3.position.y = randomYPos-12;
							object3.position.z = randomZPos;
							object3.castShadow = true;
							object3.scale.set( 6, 6, 6 )
							object3.receiveShadow = true;
							object3.visible = true;
							scene.add( object3 );
							scene.add( box2 );
							objects2.push( box2 );
						}
						var boxMaterial3 = new THREE.MeshPhongMaterial({color:0xff0000, transparent:true, opacity:0, side: THREE.DoubleSide});
						for ( var i = 0; i < 200; i ++ ) {
							var box3 = new THREE.Mesh( boxGeometry3, boxMaterial3 );
							var randomXPos = Math.floor( Math.random() * 20 - 8.85) * 6;
							var randomYPos = Math.floor( Math.random() * 600 ) * 18 + 10;
							var randomZPos = Math.floor( Math.random() * 20 - 8 ) * 6;
							box3.position.x = randomXPos;
							box3.position.y = randomYPos;
							box3.position.z = randomZPos;
							var object4 = object.clone();
							object4.position.x = randomXPos;
							object4.position.y = randomYPos-8;
							object4.position.z = randomZPos;
							object4.castShadow = true;
							object4.scale.set( 9, 4, 9 );
							object4.receiveShadow = true;
							object4.visible = true;
							scene.add( object4 );
							scene.add( box3 );
							objects3.push( box3 );
						}
                        box10 = new THREE.BoxHelper( wall, 0xffff00 );
                        box10.update(wall);
                        scene.add( box10 );
                        box9 = new THREE.BoxHelper( wall2, 0xffff00 );
                        box9.update(wall2);
                        scene.add( box9 );
                        box8 = new THREE.BoxHelper( wall3, 0xffff00 );
                        box8.update(wall3);
                        scene.add( box8 );
                        box7 = new THREE.BoxHelper( wall4, 0xffff00 );
                        box7.update(wall4);
                        scene.add( box10, box9, box8, box7 );
						raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, 10 );
						raycasterWall = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 1, 0 ), 0, 0 );
						
						// floor
						var floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors} );
						floor = new THREE.Mesh( floorGeometry, floorMaterial );
						var floorMaterial2 = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors} );
						floor2 = new THREE.Mesh( floorGeometry2, floorMaterial2 );
						floor.translateY(-70);
						scene.add( floor, floor2 );
						//
						renderer = new THREE.WebGLRenderer();
						renderer.setPixelRatio( window.devicePixelRatio );
						renderer.setSize( window.innerWidth, window.innerHeight );
						document.body.appendChild( renderer.domElement );
						//
						window.addEventListener( 'resize', onWindowResize, false );
						animate();
					}, onProgress, onError );
				});
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				if ( controlsEnabled === true ) {
					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;
					raycasterWall.ray.origin.copy( controls.getObject().position );
					raycasterWall.ray.origin.y -= 10;
					var intersections = raycaster.intersectObjects( objects);
					var intersections2 = raycaster.intersectObjects( objects2);
					var intersections3 = raycaster.intersectObjects( objects3);
					var intersections4 = raycasterWall.intersectObject( box10);
					var intersections5 = raycasterWall.intersectObject( box9);
					var intersections6 = raycasterWall.intersectObject( box8);
					var intersections7 = raycasterWall.intersectObject( box7);
					var intersections8 = raycasterWall.intersectObject(floor);
					var onObject = intersections.length > 0;
					var onObject2 = intersections2.length > 0;
					var onObject3 = intersections3.length > 0;
					var onObject4 = intersections4.length > 0;
					var onObject5 = intersections5.length > 0;
					var onObject6 = intersections6.length > 0;
					var onObject7 = intersections7.length > 0;
					var onFloor = intersections8.length > 0;
					var time = performance.now();
					var delta = ( time - prevTime ) / 1000;
 					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;
					velocity.y -= 4 * 100.0 * delta; // 100.0 = mass
					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveLeft ) - Number( moveRight );
					direction.normalize(); // this ensures consistent movements in all directions
					if (gamePause){
						defPointerUnlockElement.exitPointerLock();
						document.getElementById("continueBtn").style.display = "none";
					}
					else{
						if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
						if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
						if (camera.getWorldPosition().y > 20){
						if (onObject != true || onObject2 != true || onObject3 != true){
							canJump = false;
						      }
					    }
						if ( onObject === true ) {
							velocity.y = 350;
							canJump = false;
						}
						if ( onObject2 === true ) {
							velocity.y = Math.max( 0, velocity.y );
							canJump = true;
						}
						if ( onObject3 === true ) {
							velocity.y = Math.max(-7, velocity.y);
							canJump = false;
						}
						if ( onObject4 === true ) {
						   if (moveForward == true){
						   velocity.z = 200;
						}if (moveBackward == true){
						   velocity.z = -200;
						}if (moveRight == true){
						   velocity.x = -200;
						}if (moveLeft == true){
						   velocity.x = 200;
						}
						}
						if ( onObject5 === true ) {
						   if (moveForward == true){
						   velocity.z = 200;
						}if (moveBackward == true){
						   velocity.z = -200;
						}if (moveRight == true){
						   velocity.x = -200;
						}if (moveLeft == true){
						   velocity.x = 200;
						}
						}
						if ( onObject6 === true ) {
						   if (moveForward == true){
						   velocity.z = 200;
						}if (moveBackward == true){
						   velocity.z = -200;
						}if (moveRight == true){
						   velocity.x = -200;
						}if (moveLeft == true){
						   velocity.x = 200;
						}
						}
						if ( onObject7 === true ) {
						   if (moveForward == true){
						   velocity.z = 200;
						}if (moveBackward == true){
						   velocity.z = -200;
						}if (moveRight == true){
						   velocity.x = -200;
						}if (moveLeft == true){
						   velocity.x = 200;
						}
						}
					}
					if (onFloor){
						scene.fog = new THREE.Fog( 0xE76201, 0, 60);
						gamePause = true;
					}
                    //--------------------------------------------------------//
                                     //makes lava go up//
					floorGeometry.translate(0,0.3,0);
					//---------------------------------------------------------//
					controls.getObject().translateX( velocity.x * delta );
					controls.getObject().translateY( velocity.y * delta );
					controls.getObject().translateZ( velocity.z * delta );
					if ( controls.getObject().position.y < 10 ) {
						velocity.y = 0;
						controls.getObject().position.y = 10;
						canJump = true;
					} 

					prevTime = time;
				}
				currentScore = Math.round(camera.getWorldPosition().y-10);
				if (currentScore > score)
				{
					score = currentScore;
				}
				document.getElementById("scoreText").innerHTML = "Score: ".concat(score);

				renderer.render( scene, camera );
				
}