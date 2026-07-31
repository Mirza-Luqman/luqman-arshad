const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  revealItems.forEach((item) => observer.observe(item));
}

const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}

const terminalContent = {
  proof: `<code><span>$</span> proofcounter solve semigroup_associativity

strategy     lean_generation
result       PROVED
certificate  build/certificates/associativity.lean
verification Lean kernel accepted

status       <strong>VERIFIED</strong></code>`,
  counterexample: `<code><span>$</span> proofcounter solve magma_commutativity

strategy     exhaustive_finite_model
carrier      2 elements
result       DISPROVED
certificate  build/countermodels/magma_2.json

status       <strong>VALIDATED</strong></code>`,
};

const terminal = document.getElementById("proof-terminal");
const terminalButtons = document.querySelectorAll("[data-terminal-mode]");
terminalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.terminalMode;
    terminalButtons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    if (terminal && terminalContent[mode]) {
      terminal.innerHTML = terminalContent[mode];
    }
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const projectRows = document.querySelectorAll(".library-row[data-category]");
const projectCount = document.getElementById("project-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((candidate) => {
      candidate.setAttribute("aria-pressed", String(candidate === button));
    });
    projectRows.forEach((row) => {
      const categories = row.dataset.category.split(" ");
      const visible = selectedFilter === "all" || categories.includes(selectedFilter);
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (projectCount) {
      projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    }
  });
});

const canvas = document.getElementById("landmark-canvas");
if (canvas) {
  const context = canvas.getContext("2d");
  let scanOffset = 0;

  const handPoints = [
    [0.18, 0.78], [0.12, 0.62], [0.09, 0.47], [0.11, 0.36], [0.16, 0.28],
    [0.23, 0.56], [0.22, 0.39], [0.22, 0.25], [0.22, 0.12],
    [0.28, 0.53], [0.28, 0.34], [0.28, 0.18], [0.29, 0.07],
    [0.33, 0.56], [0.34, 0.39], [0.35, 0.26], [0.36, 0.15],
    [0.38, 0.62], [0.40, 0.49], [0.42, 0.39], [0.44, 0.30],
  ];

  const handConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15],
    [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17],
  ];

  const posePoints = [
    [0.72, 0.24], [0.65, 0.36], [0.79, 0.36], [0.60, 0.54], [0.84, 0.54],
    [0.56, 0.72], [0.88, 0.72], [0.67, 0.62], [0.77, 0.62], [0.64, 0.84],
    [0.80, 0.84],
  ];

  const poseConnections = [
    [0, 1], [0, 2], [1, 2], [1, 3], [3, 5], [2, 4], [4, 6],
    [1, 7], [2, 8], [7, 8], [7, 9], [8, 10],
  ];

  function drawConnections(points, connections, width, height, color) {
    context.strokeStyle = color;
    context.lineWidth = Math.max(1, width / 520);
    connections.forEach(([first, second]) => {
      context.beginPath();
      context.moveTo(points[first][0] * width, points[first][1] * height);
      context.lineTo(points[second][0] * width, points[second][1] * height);
      context.stroke();
    });
  }

  function drawPoints(points, width, height, color, radius) {
    context.fillStyle = color;
    points.forEach(([x, y]) => {
      context.beginPath();
      context.arc(x * width, y * height, radius, 0, Math.PI * 2);
      context.fill();
    });
  }

  function drawFace(width, height) {
    const centerX = width * 0.53;
    const centerY = height * 0.34;
    const radiusX = width * 0.075;
    const radiusY = height * 0.16;
    const points = [];
    for (let index = 0; index < 36; index += 1) {
      const angle = (index / 36) * Math.PI * 2;
      points.push([
        (centerX + Math.cos(angle) * radiusX) / width,
        (centerY + Math.sin(angle) * radiusY) / height,
      ]);
    }
    drawPoints(points, width, height, "#6fa7ff", Math.max(1.5, width / 390));
    drawPoints(
      [[0.50, 0.32], [0.56, 0.32], [0.53, 0.39], [0.51, 0.44], [0.55, 0.44]],
      width,
      height,
      "#78e1bf",
      Math.max(2, width / 330),
    );
  }

  function drawLandmarks() {
    const ratio = window.devicePixelRatio || 1;
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(280, Math.round(bounds.width));
    const height = Math.max(210, Math.round(bounds.height));
    if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0b1117";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "rgba(120, 225, 191, 0.08)";
    context.lineWidth = 1;
    for (let x = 0; x < width; x += width / 12) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y < height; y += height / 8) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    drawConnections(handPoints, handConnections, width, height, "rgba(120, 225, 191, 0.58)");
    drawPoints(handPoints, width, height, "#78e1bf", Math.max(2.2, width / 260));
    drawFace(width, height);
    drawConnections(posePoints, poseConnections, width, height, "rgba(35, 84, 165, 0.9)");
    drawPoints(posePoints, width, height, "#6fa7ff", Math.max(2.4, width / 250));

    context.fillStyle = "#e7edf1";
    context.font = `700 ${Math.max(10, width / 54)}px ui-monospace, monospace`;
    context.fillText("MULTIMODAL LANDMARK FUSION", width * 0.05, height * 0.08);
    context.fillStyle = "#91a0ac";
    context.font = `600 ${Math.max(9, width / 68)}px ui-monospace, monospace`;
    context.fillText("21 HAND", width * 0.05, height * 0.94);
    context.fillText("468 FACE", width * 0.42, height * 0.94);
    context.fillText("33 POSE", width * 0.74, height * 0.94);

    const lineY = (scanOffset % 1) * height;
    context.strokeStyle = "rgba(180, 95, 6, 0.55)";
    context.beginPath();
    context.moveTo(0, lineY);
    context.lineTo(width, lineY);
    context.stroke();
  }

  function animateLandmarks() {
    scanOffset += 0.003;
    drawLandmarks();
    if (!reducedMotion) {
      window.requestAnimationFrame(animateLandmarks);
    }
  }

  animateLandmarks();
  window.addEventListener("resize", drawLandmarks, { passive: true });
}
