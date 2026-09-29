/* neural.js — animated neural network background */
(function () {
  const canvas  = document.getElementById('neuralCanvas');
  const ctx     = canvas.getContext('2d');
  const NODES   = 55;
  const CONNECT = 140;   // max px distance to draw edge
  const SPEED   = 0.35;

  let W, H, nodes = [], pulses = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randNode() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  1.5 + Math.random() * 2.5,
      pulse: Math.random() * Math.PI * 2,  // glow phase
    };
  }

  function init() {
    nodes = Array.from({ length: NODES }, randNode);
  }

  function spawnPulse() {
    if (Math.random() > 0.03) return;
    const a = Math.floor(Math.random() * nodes.length);
    let b;
    do { b = Math.floor(Math.random() * nodes.length); } while (b === a);
    const dx = nodes[b].x - nodes[a].x;
    const dy = nodes[b].y - nodes[a].y;
    if (Math.hypot(dx, dy) < CONNECT) {
      pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.015 });
    }
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    // Update nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += 0.04;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const dist = Math.hypot(dx, dy);
        if (dist > CONNECT) continue;
        const alpha = (1 - dist / CONNECT) * 0.14;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const glow = 0.5 + 0.5 * Math.sin(n.pulse);
      const r    = n.r + glow;

      // Outer glow
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
      grad.addColorStop(0, `rgba(210,225,255,${0.18 * glow})`);
      grad.addColorStop(1, 'rgba(210,225,255,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,240,255,${0.65 + 0.35 * glow})`;
      ctx.fill();
    });

    // Pulses along edges
    spawnPulse();
    pulses = pulses.filter(p => {
      p.t += p.speed;
      if (p.t > 1) return false;
      const nx = nodes[p.a].x + (nodes[p.b].x - nodes[p.a].x) * p.t;
      const ny = nodes[p.a].y + (nodes[p.b].y - nodes[p.a].y) * p.t;
      const fade = Math.sin(p.t * Math.PI);
      ctx.beginPath();
      ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${fade * 0.9})`;
      ctx.fill();
      // trailing glow
      const tg = ctx.createRadialGradient(nx, ny, 0, nx, ny, 12);
      tg.addColorStop(0, `rgba(150,190,255,${fade * 0.3})`);
      tg.addColorStop(1, 'rgba(150,190,255,0)');
      ctx.beginPath();
      ctx.arc(nx, ny, 12, 0, Math.PI * 2);
      ctx.fillStyle = tg;
      ctx.fill();
      return true;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  requestAnimationFrame(draw);
})();
