document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cursorTrail");
  const ctx = canvas.getContext("2d");

  let mouseMoved = false;
  const pointer = {
    x: 0,
    y: 0,
  };

  const params = {
    pointsNumber: 40,
    widthFactor: 10,
    mouseThreshold: 0.5,
    spring: 0.4,
    friction: 0.5,
  };

  const trail = new Array(params.pointsNumber);

  function initializeTrail() {
    for (let i = 0; i < params.pointsNumber; i++) {
      trail[i] = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 0,
        dy: 0,
      };
    }
  }

  function updateMousePosition(eX, eY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = eX - rect.left;
    pointer.y = eY - rect.top;
  }

  function setupCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    initializeTrail();
  }

  function update(t) {
    if (!mouseMoved) {
      pointer.x =
        (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * canvas.width;
      pointer.y =
        (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
        canvas.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    trail.forEach((p, pIdx) => {
      const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
      const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= params.friction;
      p.dy *= params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "rgba(160, 93, 134, 1)");
    gradient.addColorStop(1, "rgba(57, 34, 115, 1)");

    ctx.strokeStyle = gradient;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
      const xc = 0.5 * (trail[i].x + trail[i + 1].x);
      const yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
      ctx.stroke();
    }
    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();
    window.requestAnimationFrame(update);
  }

  function handleMouseMove(e) {
    mouseMoved = true;
    updateMousePosition(e.clientX, e.clientY);
  }

  function handleTouchMove(e) {
    mouseMoved = true;
    updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
  }

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("resize", setupCanvas);

  setupCanvas();
  window.requestAnimationFrame(update);
});
