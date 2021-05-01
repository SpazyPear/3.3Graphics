import {build} from "./buildFloor.js";
import {PointerLockControls} from "../Dependencies/PointerLockControls.js";
import * as THREE from "../Dependencies/three.module.js";
import {loadModel} from "./loadModels.js";
import { Vector3 } from "../Dependencies/three.module.js";

var camera, scene, renderer, controls, cameralight, ambientlight;
var controlsEnabled = true;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var onGround = true;
var rising = false;
var falling = false;
var called = false;
var timeS = 0;
var clock;


function init() {
	clock = new THREE.Clock();
	clock.start();
	var ratio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(45,ratio,0.00001,1000);

	var Pos = new THREE.Vector3(0,4,0);
	camera.position.set(Pos.x,Pos.y,Pos.z);
	var Dir = new THREE.Vector3(0, 0, 1);
	camera.lookAt(Dir.x,Dir.y,Dir.z);
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.shadowMapEnabled = true;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	controls = new PointerLockControls(camera, renderer.domElement);
	document.addEventListener( 'click', function () {

		controls.lock();
	}
	, false );

	//adding light

		cameralight = new THREE.DirectionalLight(new THREE.Color(1, 1, 1), 4);
		cameralight.position.set(new Vector3(10, 50, 0));
		
		cameralight.castShadow = true;
		cameralight.directionalLightShadow = true;
		
		ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5);
		camera.add(cameralight);
		scene.add(ambientlight);
		const helper = new THREE.DirectionalLightHelper( cameralight, 20 );
		scene.add( helper );
			

controls.enabled = true;
	scene.add( controls.getObject() );

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
  break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32:
				called = true;
				rising = true;
				break;

		}

	};
	var time = 0;
	var delta = 0;


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
	window.addEventListener( 'resize', onWindowResize, false );
	
	build();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function getScene() {
	return scene;
}

function getControls() {
	return controls;
}
var step = 1;

function animate() {

	cameralight.target.position.set = new Vector3(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
	requestAnimationFrame( animate );
	if ( controlsEnabled == true ) {

	 var time = performance.now();
		var delta =  ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveLeft ) - Number( moveRight );
		//direction.normalize();

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
		if (onGround == false) {
			velocity.x /= 1.1;
			velocity.z /= 1.1;
		}

		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateZ( velocity.z * delta );
		
		prevTime = time; 

	}
	
	if (called == true) {
		
		jumpRise();
	}
	else {
		step = 1;
		controls.getObject().position.y = 4;
	}

	
	
	renderer.render( scene, camera );
	
	}
	
	function jumpRise() {
		
		var delta = clock.getDelta();
		if(controls.getObject().position.y < 10 && rising == true) {
			controls.getObject().position.y += 1/step;
			step += 0.3;
		}
		else if(controls.getObject().position.y > 9 && falling == false) {
			rising = false;
			falling = true;
		}
		
		else if (controls.getObject().position.y < 3 && falling == true) {
			called = false;
			falling = false;
			rising = false;
		}
		else if (falling == true) {
			controls.getObject().position.y -= 1/step;
			step -= 0.1;
		}
		console.log(controls.getObject().position.y);			
	}


init();
animate();
loadModel('../Models/DeadTree1.fbx');

export {getScene, getControls};