(function(){
  // Advanced vanilla Ballpit: instanced spheres with continuous motion and cursor coupling
  function initBallpit(canvas, opts){
    if(!window.THREE){ console.warn('THREE not loaded'); return; }
    const options = Object.assign({ count: 200, gravity: 0.6, friction: 0.992, wallBounce: 0.96, followCursor: true, maxVelocity: 0.5, separationMargin: 0.15 }, opts||{});

    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0,0,28);
    camera.lookAt(0,0,0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.0); scene.add(ambient);
    const key = new THREE.PointLight(0xffffff, 1.1); key.position.set(0, 12, 16); scene.add(key);

    // Theme colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const brandPrimary = new THREE.Color('#FF6B35');
    const brandSecondary = new THREE.Color('#39FF14');
    const neutral = isDark ? new THREE.Color('#9ca3af') : new THREE.Color('#111827');
    const palette = [brandPrimary, brandSecondary, neutral];

    // Instanced spheres
    const count = options.count;
    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const material = new THREE.MeshPhysicalMaterial({ metalness:0.4, roughness:0.35, clearcoat:0.6, clearcoatRoughness:0.25 });
    const inst = new THREE.InstancedMesh(geometry, material, count);
    inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count*3), 3);
    inst.instanceColor.needsUpdate = true;
    scene.add(inst);

    // Physics arrays
    const positions = new Float32Array(count*3);
    const velocities = new Float32Array(count*3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    const tmpPos = new THREE.Vector3();
    const tmpVel = new THREE.Vector3();
    const tmpMat = new THREE.Matrix4();
    const color = new THREE.Color();

    function rand(a,b){ return a + Math.random()*(b-a); }

    // Initialize positions with rejection sampling to avoid overlaps
    function farEnough(ix, x, y, z, size){
      const minSepSqBase = (size + options.separationMargin);
      for(let j=0;j<ix;j++){
        const bj=j*3; const sj=sizes[j]||1.0;
        const dx = x-positions[bj+0], dy=y-positions[bj+1], dz=z-positions[bj+2];
        const minSep = minSepSqBase + sj; if (dx*dx+dy*dy+dz*dz < (minSep*minSep)) return false;
      }
      return true;
    }
    for(let i=0;i<count;i++){
      const base = i*3;
      sizes[i] = rand(0.6, 1.4);
      phases[i] = rand(0, Math.PI*2);
      let px,py,pz,tries=0; do { px=rand(-18,18); py=rand(-10,10); pz=rand(-6,6); tries++; } while(!farEnough(i,px,py,pz,sizes[i]) && tries<200);
      positions[base+0] = px; positions[base+1] = py; positions[base+2] = pz;
      velocities[base+0] = rand(-0.4,0.4);
      velocities[base+1] = rand(-0.2,0.6);
      velocities[base+2] = rand(-0.4,0.4);
      // instance color
      color.copy(palette[i%palette.length]);
      inst.instanceColor.setXYZ(i, color.r, color.g, color.b);
    }
    inst.instanceColor.needsUpdate = true;

    let bounds = { x: 16, y: 10, z: 7 };
    const plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const attract = new THREE.Vector3(0,0,0);
    const clock = new THREE.Clock();

    function resize(){
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w,h,false);
      camera.aspect = w/h; camera.updateProjectionMatrix();
      bounds.x = Math.max(12, camera.aspect*14);
      bounds.y = 10;
    }
    window.addEventListener('resize', resize); resize();

    let attractStrength = 0.6; // stronger on hover
    function onMove(e){
      const rect=canvas.getBoundingClientRect();
      const inside = e.clientX>=rect.left && e.clientX<=rect.right && e.clientY>=rect.top && e.clientY<=rect.bottom;
      attractStrength = inside ? 1.0 : 0.35;
      mouse.x=((e.clientX-rect.left)/rect.width)*2-1; mouse.y=-(((e.clientY-rect.top)/rect.height)*2-1); ray.setFromCamera(mouse, camera); ray.ray.intersectPlane(plane, attract);
    }
    if(options.followCursor){ window.addEventListener('mousemove', onMove); }

    // Scroll coupling
    let scrollVel = 0;
    function onWheel(ev){ scrollVel += -Math.sign(ev.deltaY) * 0.12; }
    window.addEventListener('wheel', onWheel, { passive: true });

    function clampMag(vx, vy, vz, max){ const m = Math.hypot(vx, vy, vz); if(m>max){ const f=max/m; return [vx*f, vy*f, vz*f]; } return [vx,vy,vz]; }

    function tick(){
      const dt = Math.min(clock.getDelta(), 1/30);
      const time = clock.elapsedTime;

      for(let i=0;i<count;i++){
        const b = i*3; const sx=sizes[i];
        // velocities
        let vx = velocities[b+0];
        let vy = velocities[b+1];
        let vz = velocities[b+2];
        // gravity
        vy -= options.gravity * 0.25 * dt * sx;
        // small perpetual swirl to prevent resting
        vx += 0.3 * dt * Math.sin(time*1.7 + phases[i]);
        vz += 0.3 * dt * Math.cos(time*1.3 + phases[i]);
        // attraction to cursor
        if(options.followCursor){
          const dx = attract.x - positions[b+0];
          const dy = attract.y - positions[b+1];
          const dz = attract.z - positions[b+2];
          const invDist = 1/Math.max(0.001, Math.hypot(dx,dy,dz));
          vx += dx * invDist * attractStrength * dt;
          vy += dy * invDist * attractStrength * dt;
          vz += dz * invDist * attractStrength * dt;
        }
        // scroll influence (global y impulse with decay)
        vy += scrollVel * 0.02;
        // friction and clamp
        vx *= options.friction; vy *= options.friction; vz *= options.friction;
        [vx,vy,vz] = clampMag(vx,vy,vz, options.maxVelocity);
        velocities[b+0]=vx; velocities[b+1]=vy; velocities[b+2]=vz;

        // integrate
        positions[b+0] += vx;
        positions[b+1] += vy;
        positions[b+2] += vz;

        // walls
        if(Math.abs(positions[b+0])+sx > bounds.x){ positions[b+0] = Math.sign(positions[b+0])*(bounds.x - sx); velocities[b+0] *= -options.wallBounce; }
        if(Math.abs(positions[b+1])+sx > bounds.y){ positions[b+1] = Math.sign(positions[b+1])*(bounds.y - sx); velocities[b+1] *= -options.wallBounce; }
        if(Math.abs(positions[b+2])+sx > bounds.z){ positions[b+2] = Math.sign(positions[b+2])*(bounds.z - sx); velocities[b+2] *= -options.wallBounce; }
      }

      // decay scroll velocity
      scrollVel *= 0.92;

      // Pairwise separation to avoid contact
      const sepMargin = options.separationMargin;
      for(let i=0;i<count;i++){
        const bi=i*3; const si=sizes[i];
        for(let j=i+1;j<count;j++){
          const bj=j*3; const sj=sizes[j];
          let dx = positions[bi+0]-positions[bj+0];
          let dy = positions[bi+1]-positions[bj+1];
          let dz = positions[bi+2]-positions[bj+2];
          const distSq = dx*dx+dy*dy+dz*dz; const minSep = si+sj+sepMargin; const minSepSq = minSep*minSep;
          if(distSq < minSepSq){
            const dist = Math.sqrt(distSq)||0.0001; const overlap = (minSep - dist)*0.5; dx/=dist; dy/=dist; dz/=dist;
            positions[bi+0]+= dx*overlap; positions[bi+1]+= dy*overlap; positions[bi+2]+= dz*overlap;
            positions[bj+0]-= dx*overlap; positions[bj+1]-= dy*overlap; positions[bj+2]-= dz*overlap;
          }
        }
      }

      // write transforms
      for(let i=0;i<count;i++){
        const b=i*3; tmpPos.set(positions[b+0], positions[b+1], positions[b+2]); tmpMat.makeTranslation(tmpPos.x, tmpPos.y, tmpPos.z); tmpMat.multiply(new THREE.Matrix4().makeScale(sizes[i], sizes[i], sizes[i])); inst.setMatrixAt(i, tmpMat);
      }
      inst.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    tick();

    canvas._ballpit = { dispose: function(){ window.removeEventListener('resize', resize); window.removeEventListener('wheel', onWheel); if(options.followCursor){ window.removeEventListener('mousemove', onMove); } renderer.dispose(); } };
  }
  window.initBallpit = initBallpit;
})();
