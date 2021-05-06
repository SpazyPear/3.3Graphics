import * as THREE from "../Dependencies/three.module.js";
import {getScene} from "./setup.js";

var floor;

function build(size) {

	var material_box = new THREE.MeshPhongMaterial();

	const texture = new THREE.TextureLoader().load("../Models/textures/sand.jpg");
	material_box.map = texture;

	const normalMap = new THREE.TextureLoader().load("../Models/textures/sandNormal.png");
	material_box.normalMap = normalMap;

	const displacementMap = new THREE.TextureLoader().load("../Models/textures/sandDisplacement.png")
	material_box.displacementMap = displacementMap;
				material_box.wireframe=false;
				
				var geometry_box = new THREE.BoxGeometry(size,0,size,64,64,64);
				floor = new THREE.Mesh(geometry_box,material_box);
				
				floor.position.y=0;
	
				//BoxMesh.castShadow = false;
        		floor.receiveShadow = true;
				floor.geometry.computeVertexNormals();
				getScene().add(floor);

	var material_sky = new THREE.MeshPhongMaterial();
	material_sky.side = THREE.DoubleSide;

	const sky_texture = new THREE.TextureLoader().load("../Models/textures/sky.jpg");
	material_sky.map = sky_texture;
	
	
	var sky_geo = new THREE.SphereGeometry(1000, 1000, 1000);
	var sky = new THREE.Mesh(sky_geo, material_sky);
	
	getScene().add(sky);

}

function resizeFloor(size) {
	getScene().remove(floor);
	build(size);
}

export {build, resizeFloor};
