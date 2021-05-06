import {getScene} from "./setup.js";
import * as THREE from "../Dependencies/three.module.js";
import {FBXLoader} from "../Dependencies/FBXLoader.js";

var loader = new FBXLoader();
var objGroup = new THREE.Group();

function resizeModel(size) {
    objGroup.scale.multiplyScalar(size);
}




function loadModel(model) {
    var models = [];
    for (let x = 0; x < 10; x++) {
    loader.load( model, function ( object ) {
        object.scale.multiplyScalar(0.3); 
        object.castShadow = true;
        object.receiveShadow = true;
        //getScene().add( object );
        object.position.x = (400*Math.random());
        object.position.x *= Math.round(Math.random()) ? 1 : -1;
        object.position.z = (400*Math.random());
        object.position.z *= Math.round(Math.random()) ? 1 : -1;
        object.position.y = 0;
        
        objGroup.add(object);
    } );

    }
    getScene().add(objGroup);
}





export {loadModel, resizeModel};