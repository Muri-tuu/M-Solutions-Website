(function(){
  function initGridDistortion(containerOrSelector, opts){
    var container = typeof containerOrSelector === 'string' ? document.querySelector(containerOrSelector) : containerOrSelector;
    if(!container || !window.THREE){ return; }
    var grid = opts && opts.grid != null ? opts.grid : 15;
    var mouse = opts && opts.mouse != null ? opts.mouse : 0.1;
    var strength = opts && opts.strength != null ? opts.strength : 0.15;
    var relaxation = opts && opts.relaxation != null ? opts.relaxation : 0.9;
    var imageSrc = opts && opts.imageSrc ? opts.imageSrc : '';

    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML='';
    container.appendChild(renderer.domElement);

    var camera = new THREE.OrthographicCamera(0,0,0,0,-1000,1000);
    camera.position.z = 2;

    var uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null },
      uDataTexture: { value: null }
    };

    var vertexShader = "uniform float time; varying vec2 vUv; varying vec3 vPosition; void main(){ vUv = uv; vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
    var fragmentShader = "uniform sampler2D uDataTexture; uniform sampler2D uTexture; uniform vec4 resolution; varying vec2 vUv; void main(){ vec2 uv = vUv; vec4 offset = texture2D(uDataTexture, vUv); gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg); }";

    var size = grid;
    var data = new Float32Array(4 * size * size);
    for (var i=0;i<size*size;i++){ data[i*4] = Math.random()*255-125; data[i*4+1] = Math.random()*255-125; }
    var dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    var geometry = new THREE.PlaneGeometry(1,1,size-1,size-1);
    var material = new THREE.ShaderMaterial({ side: THREE.DoubleSide, uniforms: uniforms, vertexShader: vertexShader, fragmentShader: fragmentShader, transparent:true });
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    var textureLoader = new THREE.TextureLoader();
    if(imageSrc){
      textureLoader.load(imageSrc, function(texture){
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTexture.value = texture;
        handleResize();
      });
    }

    function handleResize(){
      var rect = container.getBoundingClientRect();
      var width = rect.width; var height = rect.height;
      if(width===0 || height===0){ return; }
      var aspect = width/height;
      renderer.setSize(width, height, false);
      if(plane){ plane.scale.set(aspect, 1, 1); }
      var frustumHeight = 1; var frustumWidth = frustumHeight*aspect;
      camera.left = -frustumWidth/2; camera.right = frustumWidth/2; camera.top = frustumHeight/2; camera.bottom = -frustumHeight/2; camera.updateProjectionMatrix();
      uniforms.resolution.value.set(width, height, 1, 1);
    }

    var mouseState = { x:0, y:0, prevX:0, prevY:0, vX:0, vY:0 };
    function onMouseMove(e){ var rect = container.getBoundingClientRect(); var x = (e.clientX - rect.left) / rect.width; var y = 1 - (e.clientY - rect.top) / rect.height; mouseState.vX = x - mouseState.prevX; mouseState.vY = y - mouseState.prevY; mouseState.x = x; mouseState.y = y; mouseState.prevX = x; mouseState.prevY = y; }
    function onMouseLeave(){ dataTexture.needsUpdate = true; mouseState = { x:0, y:0, prevX:0, prevY:0, vX:0, vY:0 }; }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    function animate(){
      uniforms.time.value += 0.05;
      var d = dataTexture.image.data;
      for (var i=0;i<size*size;i++){ d[i*4]*=relaxation; d[i*4+1]*=relaxation; }
      var gridMouseX = size * mouseState.x; var gridMouseY = size * mouseState.y; var maxDist = size * mouse;
      for (var i=0;i<size;i++){
        for (var j=0;j<size;j++){
          var distSq = Math.pow(gridMouseX - i,2) + Math.pow(gridMouseY - j,2);
          if(distSq < maxDist*maxDist){ var index = 4*(i + size*j); var power = Math.min(maxDist / Math.sqrt(distSq||1), 10); d[index] += strength * 100 * mouseState.vX * power; d[index+1] -= strength * 100 * mouseState.vY * power; }
        }
      }
      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function onResize(){ handleResize(); }
    window.addEventListener('resize', onResize);
    handleResize();
    requestAnimationFrame(animate);
  }
  window.initGridDistortion = initGridDistortion;
})();
