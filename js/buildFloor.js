import * as THREE from "../Dependencies/three.module.js";
import {getScene} from "./setup.js";

function build() {

	var texture = THREE.ImageUtils.loadTexture( "../Models/textures/sand.jpg");
				texture.wrapS = THREE.RepeatWrapping; 
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set( 10, 10 ); 
    
    var material_box = new THREE.MeshLambertMaterial({map: texture});
				material_box.color=  new THREE.Color(1,1,1);
				material_box.wireframe=false;
				
				var geometry_box = new THREE.BoxGeometry(400,0,400,64,64,64);
				

				var BoxMesh = new THREE.Mesh(geometry_box,material_box);
				
				var normalMap = THREE.ImageUtils.loadTexture('../Models/textures/sandNormal.png', undefined, function () {
					BoxMesh.material.normalMap = normalMap;
					//renderer.render(getScene(), camera);
				});
				BoxMesh.position.y=0;
				BoxMesh.material.needsUpdate = true;
				BoxMesh.recieveShadow = true;
				getScene().add(BoxMesh);
				
}

export {build};
