var container, controls;
var camera, scene, renderer, light;
var cameraPositionZ;
// var stats;

axios.get('data/config.json')
  .then(function (res) {
    init(res.data);
    animate();
  })
  .catch(function (err) {
    console.error(err);
  });

function init(config) {
  cameraPositionZ =  config.cameraWheelZ.begin;
  container = document.getElementById( 'stage' );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.3, 2000 );
  camera.position.set(0, 0, cameraPositionZ);
  camera.lookAt(new THREE.Vector3(0, 0, 2000));

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  // ground
  // var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  // mesh.rotation.x = - Math.PI / 2;
  // mesh.receiveShadow = true;
  // scene.add( mesh );

  // var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add( grid );
    
  light = new THREE.DirectionalLight(0xffffff);
  var targetObject = new THREE.Object3D();
  scene.add(targetObject);
  targetObject.position.set(0, -1000, 0);
  light.position.set( 0, 1000, 0 );
  light.target = targetObject;
  scene.add( light );

  var ambiLight = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( ambiLight );
  // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

  // model
  var loader = new THREE.GLTFLoader();  //from the docs
  loader.load('../data/model/untitled.glb', function (data) {      
    var obj = data.scene;
    // obj.children.forEach(child => {
    //   child.material.refractionRatio = 0.1;
    //   console.log(child.material.refractionRatio )
    // })
    scene.add(obj);
    // console.log(obj);
    // obj.children.forEach(child => {
    //   console.log(child.material.refractionRatio )
    // })
  });
  // var loader = new THREE.FBXLoader();
  // loader.load('../model/ComicScene.fbx', function (object) {
  //   // object.mixer = new THREE.AnimationMixer( object );
  // 	// 		object.traverse( function ( child ) {
  //   //       scene.add(child);
  // 	// 			if ( child.isMesh ) {

  // 	// 				child.castShadow = true;
  // 	// 				child.receiveShadow = true;
  // 	// 			}
  // 	// 		} );
  //   scene.add(object);
  //   console.log('loded', object)
  // } );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  // sceneガンマ値を補正
  renderer.outputEncoding = THREE.GammaEncoding;
  // renderer.shadowMap.enabled = true;
  
  container.appendChild(renderer.domElement);

  // controls = new THREE.OrbitControls( camera, renderer.domElement  );
  // controls.target.set( 0, 0, 0 );
  // controls.update();

  window.addEventListener( 'resize', onWindowResize, false );
  var scrollElement = document.getElementById('wheel');
  scrollElement.addEventListener('wheel', function (event) { onWheelEvent(event, config.cameraWheelZ) }, false);
  
  // stats
  // stats = new Stats();
  // container.appendChild( stats.dom );
}

// window resize function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// animate update function
function animate() {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
  camera.position.set(0, 0, cameraPositionZ);
  camera.updateMatrix();
  // controls.update();
  // stats.update();　
}

// mouse wheel and camera move event
function onWheelEvent(event, cameraWheelZ) {
  // console.log(cameraPositionZ, cameraWheelZ)
  if (cameraWheelZ.begin <= cameraPositionZ && cameraPositionZ <= cameraWheelZ.end) {
    cameraPositionZ += event.deltaY * -0.01;
  }
  if (cameraWheelZ.begin > cameraPositionZ) {
    cameraPositionZ = cameraWheelZ.begin
  }
  if (cameraWheelZ.end < cameraPositionZ) {
    cameraPositionZ = cameraWheelZ.end
  }
  event.preventDefault();
}


