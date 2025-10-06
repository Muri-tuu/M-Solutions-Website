(function(){
  // Minimal vanilla adaptation: themed bouncing spheres with cursor attraction
  function initBallpit(canvas, opts){
    if(!window.THREE){ console.warn('THREE not loaded'); return; }
    const options = Object.assign({ count: 120, gravity: 0.6, friction: 0.9, wallBounce: 0.95, followCursor: true }, opts||{});
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 30; camera.position.y = 0; camera.position.x = 0;

    const ambient = new THREE.AmbientLight(0xffffff, 0.9); scene.add(ambient);
    const point = new THREE.PointLight(0xffffff, 1.2); point.position.set(0,10,15); scene.add(point);

    const themeIsDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const brandPrimary = new THREE.Color('#FF6B35');
    const brandSecondary = new THREE.Color('#39FF14');
    const neutralA = themeIsDark ? new THREE.Color('#e5e7eb') : new THREE.Color('#111827');

    const colors = [ brandPrimary, brandSecondary, neutralA ];

    const spheres = []; const velocities = []; const sizes=[];
    const geometry = new THREE.SphereGeometry(1, 24, 24);

    for(let i=0;i<options.count;i++){
      const mat = new THREE.MeshPhysicalMaterial({ color: colors[i%colors.length], metalness:0.3, roughness:0.4, clearcoat: 0.4, clearcoatRoughness: 0.2 });
      const mesh = new THREE.Mesh(geometry, mat);
      const size = 0.6 + Math.random()*1.2; sizes.push(size); mesh.scale.set(size,size,size);
      mesh.position.set((Math.random()-0.5)*20, (Math.random()-0.5)*12, (Math.random()-0.5)*6);
      spheres.push(mesh); scene.add(mesh);
      velocities.push(new THREE.Vector3((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3));
    }

    let bounds = { x: 14, y: 9, z: 6 };
    const mouse = new THREE.Vector2(0,0); const worldMouse = new THREE.Vector3();
    const planeZ = new THREE.Plane(new THREE.Vector3(0,0,1), 0); const ray = new THREE.Raycaster();

    function resize(){ const w=canvas.clientWidth, h=canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix(); bounds.x = (camera.aspect)*14; bounds.y = 9; }
    window.addEventListener('resize', resize); resize();

    function updateMouse(e){ const rect=canvas.getBoundingClientRect(); mouse.x = ((e.clientX-rect.left)/rect.width)*2-1; mouse.y = -(((e.clientY-rect.top)/rect.height)*2-1); ray.setFromCamera(mouse, camera); ray.ray.intersectPlane(planeZ, worldMouse); }
    if(options.followCursor){ window.addEventListener('mousemove', updateMouse); }

    function tick(){
      for(let i=0;i<spheres.length;i++){
        const s = spheres[i]; const v = velocities[i]; const size = sizes[i];
        v.y -= options.gravity*0.01*size; // gravity
        s.position.add(v);
        // walls
        if(Math.abs(s.position.x)+size > bounds.x){ s.position.x = Math.sign(s.position.x)*(bounds.x-size); v.x *= -options.wallBounce; }
        if(Math.abs(s.position.y)+size > bounds.y){ s.position.y = Math.sign(s.position.y)*(bounds.y-size); v.y *= -options.wallBounce; v.y *= options.friction; }
        if(Math.abs(s.position.z)+size > bounds.z){ s.position.z = Math.sign(s.position.z)*(bounds.z-size); v.z *= -options.wallBounce; }
        // cursor attraction
        if(options.followCursor){ const dir = worldMouse.clone().sub(s.position); const dist = dir.length()+0.0001; dir.normalize(); v.addScaledVector(dir, 0.002*size*Math.min(10,1/dist)); }
        // friction
        v.multiplyScalar(options.friction);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }
    tick();
    canvas._ballpit = { dispose: function(){ window.removeEventListener('resize', resize); if(options.followCursor){ window.removeEventListener('mousemove', updateMouse);} renderer.dispose(); }}
  }
  window.initBallpit = initBallpit;
})();
