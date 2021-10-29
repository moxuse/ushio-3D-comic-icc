var container, controls;
var camera, scene, renderer, light;
var from, to, wheelPosition;
var loading = document.getElementById('loading');
var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.mobile();
var timerId;
var beseDistance = 0;
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
  wheelPosition = 0;
  var speed = config.camera.speed;
  var begin = config.camera.begin;
  var end = config.camera.end;
  from = new THREE.Vector3(begin.x, begin.y, begin.z);
  to = new THREE.Vector3(end.x, end.y, end.z);
  
  container = document.getElementById( 'stage' );

  camera = new THREE.PerspectiveCamera( 36, window.innerWidth / window.innerHeight, 0.01, 100 );
  camera.position.set(begin.x, begin.y, begin.z);
  camera.lookAt(new THREE.Vector3(0, 0, -2000));

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
  loader.load('../data/model/ushio_ICC.glb', function (data) {      
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
    loading.classList.add('loaded');
    setTimeout(() => {
      loading.classList.add('hidden');
    }, 2000)
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
  scrollElement.addEventListener('wheel', function (event) { onWheelEvent(event, speed) }, false);
  
  if (isMobile) {
    document.documentElement.addEventListener('touchmove', function (event) { onTouchMovie(event, speed) }, false);
    document.documentElement.addEventListener('touchstart', function (e) {
      if (e.touches.length >= 2) {
        e.preventDefault();
      }
    }, {passive: false});
    /* ダブルタップによる拡大を禁止 */
    var t = 0;
    document.documentElement.addEventListener('touchend', function (e) {
    var now = new Date().getTime();
      if ((now - t) < 350){
        e.preventDefault();
      }
      t = now;
    }, false);
  }
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

  camera.position.lerpVectors(from, to, wheelPosition);
  camera.updateMatrix();
  // controls.update();
  // stats.update();　s
}

// mouse wheel and camera move event
function onWheelEvent(event, speed) {
  event.preventDefault();
  // console.log(wheelPosition, cameraWheelZ)
  if (0 <= wheelPosition && wheelPosition <= 1) {
    wheelPosition -= event.deltaY * (-0.00001 * speed);
  }
  
  if (0 > wheelPosition) {
    wheelPosition = 0;
  }
  if (1 <= wheelPosition) {
    wheelPosition = 1;
  }
}

function onTouchMovie(event, speed) {
  var touches = event.changedTouches;
  if (touches.length > 1) {
    var x1 = touches[0].pageX ;
		var y1 = touches[0].pageY ;
		var x2 = touches[1].pageX ;
    var y2 = touches[1].pageY;
    
		var distance = Math.sqrt( Math.pow( x2 - x1, 2 ) + Math.pow( y2 - y1, 2 ) ) ;
    
    clearTimeout(timerId);
    if (beseDistance) {
      if (beseDistance > distance) {
        wheelPosition -= distance * 0.000025 * speed;
      } else if (beseDistance <= distance) {
        wheelPosition += distance * 0.000025 * speed;
      }
      timeoutId = setTimeout( function () {
				beseDistance = 0;
      }, 100);
      if (0 > wheelPosition) {
        wheelPosition = 0;
      }
      if (1 <= wheelPosition) {
        wheelPosition = 1;
      }
    } else {
      beseDistance = distance;
    }
  }
  event.preventDefault();
}


