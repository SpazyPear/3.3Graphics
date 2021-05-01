import {getScene} from "./setup.js";
import * as THREE from "../Dependencies/three.module.js";
import {FBXLoader} from "../Dependencies/FBXLoader.js";

var loader = new FBXLoader();

function loadModel(model) {
    loader.load( model, function ( object ) {

        object.castShadow = true;
        getScene().add( object );
        object.position.y = 3;
        
    
    } );
}



export {loadModel};

    

    

