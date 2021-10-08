  var container, stats, controls;
var camera, scene, renderer, light;
  
var mixers = [];

  init();
  animate();

  function init() {

    container = document.getElementById( 'stage' );

    camera = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.3, 1000 );
    camera.position.set(153, 0, -9);
    camera.lookAt(new THREE.Vector3(153, 0, 1300));

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );


  // ground
  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add( grid );
    
    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 200, 100 );
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add( light );

    scene.add( new THREE.CameraHelper( light.shadow.camera ) );

    // model
    var loader = new THREE.FBXLoader();
    loader.load('../model/ComicScene.fbx', function (object) {
      // object.mixer = new THREE.AnimationMixer( object );
			// 		object.traverse( function ( child ) {
            
      //       scene.add(child);
			// 			if ( child.isMesh ) {

			// 				child.castShadow = true;
			// 				child.receiveShadow = true;

			// 			}

			// 		} );
      
      scene.add(object);
      console.log('loded', object)
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
   
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera, renderer.domElement  );
		controls.target.set( 150, 0, -19 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  //

  function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );
    controls.update();
    stats.update();

  }