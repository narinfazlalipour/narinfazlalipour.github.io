/* -------------------------------------------------------------------------
   Brain-Heart Seam Canvas Simulation — Narin Fazlalipour Portfolio
   A visual seam connecting the neuroscience mind with the presence-driven heart
   ------------------------------------------------------------------------- */

export function initSeam() {
  const container = document.querySelector('.seam-interactive');
  const canvas = document.getElementById('seam-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let active = true;

  // Set sizing
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 380 * dpr; // locked to height in css
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `380px`;
  };
  resize();
  window.addEventListener('resize', resize);

  // Nodes storage
  let neuralNodes = [];
  let heartNodes = [];
  let bridgeConnections = [];
  let pulses = []; // active traveling waves

  // Mouse coords
  let mx = -1000;
  let my = -1000;
  let isHovered = false;

  // Color tokens (using custom variables or direct color fallbacks)
  const colors = {
    neural: '#7B8C9C', // Sky Blue
    heart: '#8B3A1C',  // Umber / Deep red-brown
    ember: '#D98A4F',  // Warm gold
    line: 'rgba(37, 22, 18, 0.08)',
    lineDark: 'rgba(245, 197, 153, 0.08)'
  };

  const getThemeColor = (key) => {
    const isDark = document.body.classList.contains('theme-dark');
    if (key === 'line') return isDark ? colors.lineDark : colors.line;
    return colors[key];
  };

  // Generate Heart Node Coordinates (Parametric Equation)
  const generateHeartCoords = (cx, cy, scale) => {
    const coords = [];
    const step = (Math.PI * 2) / 16;
    for (let t = 0; t < Math.PI * 2; t += step) {
      // parametric heart curve
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      coords.push({
        x: cx + x * scale,
        y: cy + y * scale,
        baseX: cx + x * scale,
        baseY: cy + y * scale
      });
    }
    return coords;
  };

  const initSimulation = () => {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = 380;

    neuralNodes = [];
    heartNodes = [];
    bridgeConnections = [];
    pulses = [];

    // 1. Generate Neural Network (Left Side)
    const neuralCount = 18;
    for (let i = 0; i < neuralCount; i++) {
      neuralNodes.push({
        x: 40 + Math.random() * (w * 0.4 - 60),
        y: 40 + Math.random() * (h - 80),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 3 + Math.random() * 2
      });
    }

    // 2. Generate Heart Network (Right Side)
    const heartCenterY = h / 2;
    const heartCenterX = w * 0.78;
    const heartScale = clamp(w * 0.007, 3.5, 7.5);
    const coords = generateHeartCoords(heartCenterX, heartCenterY, heartScale);
    coords.forEach(c => {
      heartNodes.push({
        x: c.x,
        y: c.y,
        baseX: c.baseX,
        baseY: c.baseY,
        pulseOffset: Math.random() * Math.PI * 2,
        size: 3.5
      });
    });

    // 3. Create Bridges (connect random left nodes to random right nodes)
    const bridgeCount = 6;
    for (let i = 0; i < bridgeCount; i++) {
      const leftIndex = Math.floor(Math.random() * neuralNodes.length);
      const rightIndex = Math.floor(Math.random() * heartNodes.length);
      bridgeConnections.push({
        from: neuralNodes[leftIndex],
        to: heartNodes[rightIndex]
      });
    }
  };

  initSimulation();

  // Helper limits
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // Draw & Update Loop
  const draw = () => {
    if (!active) return;

    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = 380;

    ctx.clearRect(0, 0, w, h);

    const isDark = document.body.classList.contains('theme-dark');
    const lineThemeColor = getThemeColor('line');

    // 1. Draw Static Bridge Connections
    ctx.lineWidth = 1;
    ctx.strokeStyle = lineThemeColor;
    bridgeConnections.forEach(b => {
      ctx.beginPath();
      ctx.moveTo(b.from.x, b.from.y);
      ctx.lineTo(b.to.x, b.to.y);
      ctx.stroke();
    });

    // 2. Update and Draw Neural Nodes (Drifting networks)
    neuralNodes.forEach((node, i) => {
      // Update drift
      node.x += node.vx;
      node.y += node.vy;

      // Bounce bounds
      if (node.x < 20 || node.x > w * 0.45) node.vx *= -1;
      if (node.y < 20 || node.y > h - 20) node.vy *= -1;

      // Draw local node connections (Neural mesh)
      for (let j = i + 1; j < neuralNodes.length; j++) {
        const other = neuralNodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 75) {
          ctx.strokeStyle = isDark ? `rgba(245, 197, 153, ${0.1 * (1 - dist/75)})` : `rgba(37, 22, 18, ${0.12 * (1 - dist/75)})`;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      // Draw dot
      ctx.fillStyle = isDark ? 'rgba(245, 197, 153, 0.4)' : colors.neural;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Update and Draw Heart Nodes
    const pulseTime = Date.now() * 0.0035;
    heartNodes.forEach((node, i) => {
      // Heart breathing movement (simulating heartbeat pulse contraction)
      const pulseScale = 1 + Math.sin(pulseTime + node.pulseOffset) * 0.035;
      const dx = node.x - (w * 0.78);
      const dy = node.y - (h / 2);

      // Apply temporary heartbeat contraction
      const currentX = (w * 0.78) + dx * pulseScale;
      const currentY = (h / 2) + dy * pulseScale;

      // Draw local heart boundary connections (drawing the heart outline)
      const nextNode = heartNodes[(i + 1) % heartNodes.length];
      const nextDx = nextNode.x - (w * 0.78);
      const nextDy = nextNode.y - (h / 2);
      const nextCurrentX = (w * 0.78) + nextDx * pulseScale;
      const nextCurrentY = (h / 2) + nextDy * pulseScale;

      ctx.strokeStyle = isDark ? 'rgba(217, 138, 79, 0.22)' : 'rgba(139, 58, 28, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(currentX, currentY);
      ctx.lineTo(nextCurrentX, nextCurrentY);
      ctx.stroke();

      // Node dot
      ctx.fillStyle = colors.heart;
      ctx.beginPath();
      ctx.arc(currentX, currentY, node.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Interactive mouse tracking (draw connections to mouse)
    if (isHovered) {
      // Neural connection
      neuralNodes.forEach(node => {
        const dist = Math.hypot(node.x - mx, node.y - my);
        if (dist < 90) {
          ctx.strokeStyle = `rgba(219, 138, 79, ${0.35 * (1 - dist/90)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      });
      // Heart connection
      heartNodes.forEach(node => {
        const dist = Math.hypot(node.x - mx, node.y - my);
        if (dist < 90) {
          ctx.strokeStyle = `rgba(139, 58, 28, ${0.35 * (1 - dist/90)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      });
    }

    // 5. Update and Draw Click Pulses (Energy traveling)
    for (let pIndex = pulses.length - 1; pIndex >= 0; pIndex--) {
      const p = pulses[pIndex];
      p.progress += 0.015; // speed of pulse

      if (p.progress >= 1) {
        // Pulse arrived at the heart!
        // Trigger a temporary visual flash on the heart
        ctx.fillStyle = 'rgba(217, 138, 79, 0.6)';
        ctx.beginPath();
        ctx.arc(p.to.x, p.to.y, 25, 0, Math.PI * 2);
        ctx.fill();

        pulses.splice(pIndex, 1);
        continue;
      }

      // Linear interpolation of coordinate along the bridge
      const px = p.from.x + (p.to.x - p.from.x) * p.progress;
      const py = p.from.y + (p.to.y - p.from.y) * p.progress;

      // Glow backing
      ctx.fillStyle = 'rgba(217, 138, 79, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      // Sharp core
      ctx.fillStyle = colors.ember;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  // Event handlers
  container.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
    isHovered = true;
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Click generates a pulse along all bridge connections
  container.addEventListener('click', () => {
    bridgeConnections.forEach(b => {
      pulses.push({
        from: b.from,
        to: b.to,
        progress: 0
      });
    });
  });

  // Start loop
  draw();

  // Mode changer check to toggle drawing calculations
  document.addEventListener('modechange', (e) => {
    if (e.detail === 'narrative') {
      active = true;
      resize();
      draw();
    } else {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }
  });

  // Cleanup
  return () => {
    active = false;
    window.removeEventListener('resize', resize);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  };
}
