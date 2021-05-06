import {build} from "./buildFloor.js";
import {resizeFloor} from "./buildFloor.js";
import {PointerLockControls} from "../Dependencies/PointerLockControls.js";
import * as THREE from "../Dependencies/three.module.js";
import {loadModel} from "./loadModels.js";
import {resizeModel} from "./loadModels.js";
import { Vector3 } from "../Dependencies/three.module.js";
import { Color } from "../Dependencies/three.module.js";
import {GUI} from '../Dependencies/dat.gui.module.js';
import { BoxGeometry } from "../Dependencies/three.module.js";
import { PointLight } from "../Dependencies/three.module.js";

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
var models = new THREE.Group();

var options = {
	light: {
	moonIntensity: 0,
	ambientIntensity: 0.5,
	torchIntensity: 0.1
	},
	model: {
		size: 0.3,
		floor: 700
	}
  };
  
  var gui = new GUI();
  

  //gui.add(options.light, 'moonIntensity', 0, 10).listen();
  gui.add(options.light, 'ambientIntensity', 0, 2).listen();
  //gui.add(options.light, 'torchIntensity', 0, 2).listen();
  gui.add(options.model, "size").onFinishChange(function (value) {
    resizeModel(value);
});
gui.add(options.model, "floor").onFinishChange(function (value) {
    resizeFloor(value);
});



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

	//adding moon
		
	var moon_geo = new THREE.SphereGeometry(30, 30, 30);
	var moon_mat = new THREE.MeshPhongMaterial();
	const texture = new THREE.TextureLoader().load("../Models/textures/moonTexture.jpg");
	moon_mat.map = texture;
	moon_mat.color = new THREE.Color(1, 1, 1); //
	var moon_mesh = new THREE.Mesh(moon_geo, moon_mat);
	scene.add(moon_mesh);
	moon_mesh.position.y = 1000;
	moon_mesh.position.z = -10;

	

			

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
	
	build(700);
	addLight();
}
var torchGroup = new THREE.Group();
function addLight() {
	
	cameralight = new THREE.PointLight(new THREE.Color(0.7, 0.7, 1), options.light.moonIntensity);
	cameralight.position.y = 100;
	cameralight.position.z = -10;
	
	cameralight.castShadow = true;
	for (let x = 0; x < 8; x++) {
		
			var torchlight = new THREE.PointLight(new THREE.Color(0.7, 0.7, 1), options.light.torchIntensity);
			torchlight.castShadow = true;
			var cordX = (400*Math.random()) * Math.round(Math.random()) ? 1 : -1;
			var cordZ = (400*Math.random()) * Math.round(Math.random()) ? 1 : -1;
			torchlight.position.x = cordX
			torchlight.position.z = cordZ;
			torchlight.position.y = 3;

			var torch_geo = new BoxGeometry(0.5, 2, 2);
			var torch_mat = new THREE.MeshPhongMaterial();
			torch_mat.color = new THREE.Color(1, 1, 1);
			var torch = new THREE.Mesh(torch_geo, torch_mat);
			torch.position.y = 1;
			torch.position.x - cordX;
			torch.position.z = cordZ;
			//scene.add(torch);

			torchGroup.add(torchlight)
		}
	

	ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), options.light.ambientIntensity);
	camera.add(cameralight);
	scene.add(ambientlight);
	scene.add(torchGroup);
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

function updateGUI() {
	cameralight.intensity = options.light.moonIntensity;
	ambientlight.intensity = options.light.ambientIntensity;
	torchGroup.intensity = options.light.torchIntensity;
	//console.log(options.light.torchIntensity);

}


function animate() {
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


	updateGUI();
	
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
		//console.log(controls.getObject().position.y);			
	}






init();
animate();
loadModel('../Models/DeadTree1.fbx');





export {getScene, getControls};