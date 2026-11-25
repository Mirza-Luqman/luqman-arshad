/* ==========================================================================
   Luqman Arshad — Portfolio v4 Interactive Layer
   ========================================================================== */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Theme Toggle ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");

  function syncThemeUI(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#080d13" : "#0b1117");
    }
  }

  syncThemeUI(document.documentElement.getAttribute("data-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      syncThemeUI(next);
      try {
        localStorage.setItem("la-theme", next);
      } catch (err) {
        // Ignore storage errors in private browsing modes.
      }
    });
  }

  /* ---------- 2. Scroll Progress & Active Section Spy ---------- */
  const progressEl = document.getElementById("scroll-progress");
  const navLinks = Array.from(document.querySelectorAll(".site-nav a[data-nav]"));
  const spySections = navLinks
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  function updateScrollProgress() {
    if (window.scrollY < 220) {
      navLinks.forEach((link) => link.classList.remove("is-active"));
    }
    if (!progressEl) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    progressEl.style.width = `${(ratio * 100).toFixed(2)}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  updateScrollProgress();

  if ("IntersectionObserver" in window && spySections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.dataset.nav === activeId);
            });
          }
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );
    spySections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- 3. Mobile Navigation Drawer ---------- */
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");

  function setDrawerOpen(open) {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.setAttribute("aria-expanded", String(open));
    mobileDrawer.hidden = !open;
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const open = mobileMenuBtn.getAttribute("aria-expanded") !== "true";
      setDrawerOpen(open);
    });
    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setDrawerOpen(false));
    });
  }

  /* ---------- 4. Scroll Reveal ---------- */
  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const copyrightYear = document.getElementById("copyright-year");
  if (copyrightYear) {
    copyrightYear.textContent = String(new Date().getFullYear());
  }

  /* ---------- 5. ChronoFret Mini Telemetry Tabs ---------- */
  const cfModels = {
    chronotype: {
      title: "Bayesian-shrinkage hourly windows",
      desc: "Identifies peak combined pitch + timing hours (e.g., 21:00–23:00 in demo dataset) while protecting against sparse hourly samples.",
    },
    decay: {
      title: "Technique skill-decay forecasting",
      desc: "Estimates when a specific practiced technique will likely cross a configurable maintenance threshold and exports .ics reminders.",
    },
    fatigue: {
      title: "Multimodal fatigue coupling",
      desc: "Tracks how pitch and timing errors co-move with hand-motion variance, MediaPipe blink rate, and head-angle drift proxies.",
    },
    drift: {
      title: "Longitudinal instrument tuning drift",
      desc: "Fits a multi-week cents/week regression over session median pitch offsets to flag progressive setup or string drift.",
    },
  };

  const cfButtons = document.querySelectorAll("[data-cf-model]");
  const cfDetail = document.getElementById("cf-model-detail");
  cfButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.cfModel;
      const model = cfModels[key];
      if (!model || !cfDetail) return;
      cfButtons.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      cfDetail.innerHTML = "";
      const strong = document.createElement("strong");
      strong.textContent = model.title;
      const span = document.createElement("span");
      span.textContent = model.desc;
      cfDetail.append(strong, span);
    });
  });

  /* ---------- 6. ShareVeil Interactive Offline Redactor ---------- */
  const svSamples = {
    log: [
      { kind: "text", value: "2026-09-23T14:12:08Z WARN auth retry user=" },
      { kind: "email", raw: "alice@example.com", placeholder: "[REDACTED_EMAIL_1]" },
      { kind: "text", value: "\nAuthorization: Bearer " },
      { kind: "secret", raw: "eyJhbGciOiJIUzI1NiJ9.demo.token", placeholder: "[REDACTED_BEARER_TOKEN_1]" },
      { kind: "text", value: "\nfallback_key=" },
      { kind: "secret", raw: '"sk-proj-demo9918273645abcdef"', placeholder: '"[REDACTED_API_KEY_1]"' },
      { kind: "text", value: "\nretry_same_user=" },
      { kind: "email", raw: "alice@example.com", placeholder: "[REDACTED_EMAIL_1]" },
      { kind: "text", value: "  # consistent label" },
    ],
    prompt: [
      { kind: "text", value: "Debug why webhook fails for " },
      { kind: "email", raw: "ops@acme.test", placeholder: "[REDACTED_EMAIL_1]" },
      { kind: "text", value: ":\nGITHUB_TOKEN=" },
      { kind: "secret", raw: "ghp_DemoToken881234567890abcdef", placeholder: "[REDACTED_GITHUB_TOKEN_1]" },
      { kind: "text", value: "\nSLACK_BOT=" },
      { kind: "secret", raw: "xoxb-112233-445566-demoSecret", placeholder: "[REDACTED_SLACK_TOKEN_1]" },
      { kind: "text", value: "\nHTTP 403 returned on /hooks/deploy" },
    ],
    url: [
      { kind: "text", value: "DATABASE_URL=postgres://" },
      { kind: "secret", raw: "admin:s3cr3tPass99", placeholder: "[REDACTED_URL_CREDENTIALS_1]" },
      { kind: "text", value: "@db.internal:5432/prod\nAWS_ACCESS_KEY_ID=" },
      { kind: "secret", raw: "AKIAIOSFODNN7EXAMPLE", placeholder: "[REDACTED_AWS_ACCESS_KEY_1]" },
      { kind: "text", value: "\nOWNER_CONTACT=" },
      { kind: "email", raw: "security@corp.example", placeholder: "[REDACTED_EMAIL_1]" },
    ],
  };

  let svCurrentSample = "log";
  let svCurrentView = "redacted";
  const svOutput = document.getElementById("shareveil-output");
  const svEmailsToggle = document.getElementById("sv-emails-toggle");
  const svFindingsBadge = document.getElementById("sv-findings-badge");
  const svSampleButtons = document.querySelectorAll("[data-sv-sample]");
  const svViewButtons = document.querySelectorAll("[data-sv-view]");

  function renderShareVeil() {
    if (!svOutput) return;
    const segments = svSamples[svCurrentSample] || svSamples.log;
    const redactEmails = svEmailsToggle ? svEmailsToggle.checked : true;
    const isRedacted = svCurrentView === "redacted";

    svOutput.textContent = "";
    let findingCount = 0;

    segments.forEach((seg) => {
      if (seg.kind === "text") {
        svOutput.appendChild(document.createTextNode(seg.value));
        return;
      }
      const activeMatch = seg.kind === "secret" || (seg.kind === "email" && redactEmails);
      if (activeMatch) {
        findingCount += 1;
        const span = document.createElement("span");
        span.className = isRedacted ? "sv-redacted-token" : "sv-raw-secret";
        span.textContent = isRedacted ? seg.placeholder : seg.raw;
        svOutput.appendChild(span);
      } else {
        svOutput.appendChild(document.createTextNode(seg.raw));
      }
    });

    if (svFindingsBadge) {
      svFindingsBadge.textContent = `${findingCount} ${findingCount === 1 ? "finding" : "findings"} · check exit ${findingCount > 0 ? 1 : 0}`;
    }
  }

  svSampleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      svCurrentSample = btn.dataset.svSample;
      svSampleButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderShareVeil();
    });
  });

  svViewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      svCurrentView = btn.dataset.svView;
      svViewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderShareVeil();
    });
  });

  if (svEmailsToggle) {
    svEmailsToggle.addEventListener("change", renderShareVeil);
  }
  renderShareVeil();

  /* ---------- 7. ProofOrCounter 3-Mode Terminal ---------- */
  const terminalContent = {
    proof: `<code><span>$</span> proofcounter bench benchmarks/manifest.json

case         semigroup_associativity
strategy     lean_generation (kernel-checked)
result       PROVED
certificate  runs/associativity/proof.lean
verification Lean 4 kernel accepted

status       <strong>VERIFIED · 5/5 CI BENCHMARK</strong></code>`,
    counterexample: `<code><span>$</span> proofcounter run examples/noncommutative-magma.json --max-size 4

case         unrestricted_magma_commutativity
strategy     exhaustive_finite_model
carrier      2 elements · closure &amp; axioms verified
result       DISPROVED
certificate  runs/noncommutative/counterexample.json

status       <strong>VALIDATED COUNTERMODEL</strong></code>`,
    z3: `<code><span>$</span> proofcounter run conjecture.json --backend openai-compatible --max-size 5

prover       attempt 1 rejected -> Lean error fed to repair loop
disprover    exhaustive (n=2..3) clear -> Z3 finite encoding (n=4)
result       DISPROVED (disprover won wall-clock race)
certificate  runs/exp-01/counterexample.json (digest matched)

status       <strong>VERIFIED · ZERO UNCHECKED VERDICTS</strong></code>`,
  };

  const terminal = document.getElementById("proof-terminal");
  const terminalButtons = document.querySelectorAll("[data-terminal-mode]");
  terminalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.terminalMode;
      terminalButtons.forEach((c) => c.setAttribute("aria-pressed", String(c === button)));
      if (terminal && terminalContent[mode]) {
        terminal.innerHTML = terminalContent[mode];
      }
    });
  });

  /* ---------- 8. Reasoning Eval Lab 2-Stage Terminal ---------- */
  const evalContent = {
    run: `<code><span>$</span> reasoning-eval run --backend openai-compatible \\
    --base-url http://localhost:8000/v1 --samples 4 --concurrency 8

worker[0..7]  async semaphore active (resumable index)
stream        append-only outputs/generations.jsonl
retry_audit   latency_ms + attempt metadata recorded
security      OPENAI_API_KEY read from env, never written

status        <strong>RESUMABLE · DECOUPLED SCORING</strong></code>`,
    score: `<code><span>$</span> reasoning-eval evaluate \\
    --problems examples/sample_math.jsonl \\
    --generations outputs/generations.jsonl --output outputs/scores.jsonl

extractor     balanced-brace \\boxed{...} + final-answer fallback
equivalence   exact match + decimal / fraction / percentage check
metrics       aggregate accuracy + pass@k across multi-sample runs

status        <strong>RE-SCORABLE WITHOUT RE-RUNNING INFERENCE</strong></code>`,
  };

  const evalTerminal = document.getElementById("eval-terminal");
  const evalButtons = document.querySelectorAll("[data-eval-stage]");
  evalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stage = button.dataset.evalStage;
      evalButtons.forEach((c) => c.setAttribute("aria-pressed", String(c === button)));
      if (evalTerminal && evalContent[stage]) {
        evalTerminal.innerHTML = evalContent[stage];
      }
    });
  });

  /* ---------- 9. Multimodal Perception Upgraded Canvas ---------- */
  const canvas = document.getElementById("landmark-canvas");
  const landmarkEventEl = document.getElementById("landmark-event");
  const landmarkButtons = document.querySelectorAll("[data-landmark-mode]");

  if (canvas) {
    const context = canvas.getContext("2d");
    let scanOffset = 0;
    let activeModality = "all";

    const modalityEvents = {
      all: "gesture:victory · face:right · lean:left",
      hand: "21 landmarks · finger reach -> victory",
      face: "468 mesh pts · nose-to-eye yaw -> right",
      pose: "33 pose pts · shoulder-to-hip -> lean_left",
    };

    landmarkButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        activeModality = btn.dataset.landmarkMode;
        landmarkButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        if (landmarkEventEl && modalityEvents[activeModality]) {
          landmarkEventEl.textContent = modalityEvents[activeModality];
        }
        drawLandmarks();
      });
    });

    const handPoints = [
      [0.18, 0.79], [0.12, 0.64], [0.09, 0.50], [0.11, 0.39], [0.16, 0.31],
      [0.23, 0.58], [0.22, 0.41], [0.22, 0.27], [0.22, 0.14],
      [0.28, 0.55], [0.28, 0.36], [0.28, 0.21], [0.29, 0.10],
      [0.33, 0.58], [0.34, 0.42], [0.35, 0.29], [0.36, 0.19],
      [0.38, 0.64], [0.40, 0.51], [0.42, 0.42], [0.44, 0.33],
    ];

    const handConnections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15],
      [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17],
    ];

    const posePoints = [
      [0.74, 0.23], [0.67, 0.35], [0.81, 0.35], [0.62, 0.53], [0.86, 0.53],
      [0.58, 0.71], [0.90, 0.71], [0.69, 0.61], [0.79, 0.61], [0.66, 0.83],
      [0.82, 0.83],
    ];

    const poseConnections = [
      [0, 1], [0, 2], [1, 2], [1, 3], [3, 5], [2, 4], [4, 6],
      [1, 7], [2, 8], [7, 8], [7, 9], [8, 10],
    ];

    function drawConnections(points, connections, width, height, color, alpha) {
      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.lineWidth = Math.max(1.1, width / 480);
      connections.forEach(([first, second]) => {
        context.beginPath();
        context.moveTo(points[first][0] * width, points[first][1] * height);
        context.lineTo(points[second][0] * width, points[second][1] * height);
        context.stroke();
      });
      context.restore();
    }

    function drawPoints(points, width, height, color, radius, alpha) {
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = color;
      points.forEach(([x, y]) => {
        context.beginPath();
        context.arc(x * width, y * height, radius, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    }

    function drawFace(width, height, alpha) {
      const centerX = width * 0.52;
      const centerY = height * 0.42;
      const radiusX = width * 0.082;
      const radiusY = height * 0.19;
      const points = [];
      for (let i = 0; i < 36; i += 1) {
        const angle = (i / 36) * Math.PI * 2;
        points.push([
          (centerX + Math.cos(angle) * radiusX) / width,
          (centerY + Math.sin(angle) * radiusY) / height,
        ]);
      }
      drawPoints(points, width, height, "#6fa7ff", Math.max(1.5, width / 380), alpha);
      drawPoints(
        [[0.49, 0.39], [0.55, 0.39], [0.525, 0.47], [0.50, 0.53], [0.545, 0.53]],
        width,
        height,
        "#78e1bf",
        Math.max(2.1, width / 310),
        alpha,
      );
    }

    function drawLandmarks() {
      const ratio = window.devicePixelRatio || 1;
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(280, Math.round(bounds.width));
      const height = Math.max(180, Math.round(bounds.height));
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#0b1117";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(120, 225, 191, 0.07)";
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

      const handAlpha = activeModality === "all" || activeModality === "hand" ? 1 : 0.16;
      const faceAlpha = activeModality === "all" || activeModality === "face" ? 1 : 0.16;
      const poseAlpha = activeModality === "all" || activeModality === "pose" ? 1 : 0.16;

      drawConnections(handPoints, handConnections, width, height, "rgba(110, 231, 183, 0.65)", handAlpha);
      drawPoints(handPoints, width, height, "#6ee7b7", Math.max(2.2, width / 255), handAlpha);
      drawFace(width, height, faceAlpha);
      drawConnections(posePoints, poseConnections, width, height, "rgba(79, 148, 255, 0.85)", poseAlpha);
      drawPoints(posePoints, width, height, "#7db4ff", Math.max(2.4, width / 245), poseAlpha);

      context.fillStyle = "#8ea3b5";
      context.font = `600 ${Math.max(9, width / 62)}px "JetBrains Mono", monospace`;
      context.fillText("21 HAND", width * 0.08, height * 0.92);
      context.fillText("468 FACE", width * 0.44, height * 0.92);
      context.fillText("33 POSE", width * 0.76, height * 0.92);

      const lineY = (scanOffset % 1) * height;
      context.strokeStyle = "rgba(79, 148, 255, 0.45)";
      context.beginPath();
      context.moveTo(0, lineY);
      context.lineTo(width, lineY);
      context.stroke();
    }

    function animateLandmarks() {
      scanOffset += 0.0028;
      drawLandmarks();
      if (!reducedMotion) {
        window.requestAnimationFrame(animateLandmarks);
      }
    }

    animateLandmarks();
    window.addEventListener("resize", drawLandmarks, { passive: true });
  }

  /* ---------- 10. Research Track Switcher ---------- */
  const researchTabs = document.querySelectorAll("[data-research-tab]");
  const researchPanels = {
    c2rust: document.getElementById("panel-c2rust"),
    sair: document.getElementById("panel-sair"),
  };

  researchTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.researchTab;
      researchTabs.forEach((t) => {
        t.setAttribute("aria-selected", String(t === tab));
      });
      Object.entries(researchPanels).forEach(([key, panel]) => {
        if (panel) panel.hidden = key !== target;
      });
    });
  });

  /* ---------- 11. Project Library Filter & Search ---------- */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectRows = document.querySelectorAll(".library-row[data-category]");
  const searchInput = document.getElementById("library-search");
  const projectCount = document.getElementById("project-count");
  const emptyLibrary = document.getElementById("empty-library");

  let activeFilter = "all";

  function applyLibraryFilter() {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let visibleCount = 0;

    projectRows.forEach((row) => {
      const categories = (row.dataset.category || "").split(" ");
      const searchText = `${row.dataset.search || ""} ${row.textContent || ""}`.toLowerCase();
      const matchesCat = activeFilter === "all" || categories.includes(activeFilter);
      const matchesQuery = !query || searchText.includes(query);
      const visible = matchesCat && matchesQuery;
      row.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (projectCount) {
      projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    }
    if (emptyLibrary) {
      emptyLibrary.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((c) => c.setAttribute("aria-pressed", String(c === button)));
      applyLibraryFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyLibraryFilter);
  }

  /* ---------- 12. Technical Dossier Modal (All 12 Projects) ---------- */
  const DOSSIERS = {
    chronofret: {
      category: "Multimodal AI Product",
      status: "Live · Public",
      title: "ChronoFret",
      subtitle: "Local-first longitudinal guitar performance coach combining YIN pitch, MediaPipe landmarks, and personal time-series modeling.",
      problem: "Most music practice tools grade a single session in isolation. ChronoFret models every practice session as an observation in a personal longitudinal time series—identifying peak local-hour chronotype windows, skill decay, fatigue coupling, and gradual instrument tuning drift.",
      flow: ["Mic (Web Audio + YIN)", "Webcam (MediaPipe Hand/Face)", "Light + Idle Events", "Browser IndexedDB", "4 Time-Series Models", "Dashboard + .ics Export"],
      highlights: [
        "Processes raw audio buffers and video frames strictly in browser memory; only numeric session summaries persist in IndexedDB.",
        "Four statistical models: Bayesian-shrinkage hourly chronotype, technique decay forecasting, fatigue/error correlation, and weekly cents-drift regression.",
        "Includes an accelerated deterministic demo dataset so reviewers can inspect all analytics without hardware permissions.",
        "Verified with 17 Vitest suites covering pitch math, hourly shrinkage, decay bounds, tuning regression, and calendar export."
      ],
      stats: [
        { k: "Test Suite", v: "17 passing Vitest suites" },
        { k: "Stack", v: "TypeScript, React, Vite, MediaPipe, Dexie" },
        { k: "Privacy", v: "Zero server, zero uploads, local-first" },
        { k: "Deployment", v: "GitHub Pages SPA (HTTPS)" }
      ],
      cli: "pnpm install\npnpm typecheck && pnpm test && pnpm build\npnpm dev",
      boundary: "YIN targets monophonic pitch (full chords do not get a single pitch score). Movement and blink indicators are behavioral proxies, not medical measurements. The included demo dataset is clearly labeled and is not presented as real player evidence.",
      liveUrl: "https://mirza-luqman.github.io/chronofret/",
      repoUrl: "https://github.com/Mirza-Luqman/chronofret"
    },
    accessdelta: {
      category: "Developer Tools & Accessibility CI",
      status: "Live · Public",
      title: "AccessDelta",
      subtitle: "Browser-based accessibility regression testing with element-level baseline comparisons, offline HTML reports, and a GitHub Action.",
      problem: "Large accessibility backlogs make fresh audit reports hard to act on in pull requests. AccessDelta keeps existing debt visible while pinpointing exactly what is new, worsened, resolved, or unchanged at the element level.",
      flow: ["Playwright Real Browser", "axe-core WCAG A/AA", "Snapshot JSON", "Element-Level Baseline Diff", "Offline Report + Summary", "CI Gate (0/1/2)"],
      highlights: [
        "Element-level fingerprinting: a new unlabeled input is flagged as NEW even if another input already had the same rule violation.",
        "Stable page IDs decouple identity from hostnames so localhost baselines compare cleanly against preview URLs across desktop and mobile viewports.",
        "Honest error semantics: page timeouts or unknown tags exit with code 2 (error) rather than falsely looking like resolved issues.",
        "Ships a self-contained offline HTML report with search, impact/change filters, HTML snippets, axe repair guidance, and a Linux GitHub Action."
      ],
      stats: [
        { k: "Test Suite", v: "29 passing tests (core · CLI · browser)" },
        { k: "Stack", v: "Node 22+, Playwright, axe-core, Actions" },
        { k: "CI Exit Contract", v: "0 clean · 1 regression · 2 error" },
        { k: "Demo Evidence", v: "2 new, 2 resolved, 1 unchanged" }
      ],
      cli: "npm ci\nnpx playwright install chromium --only-shell\nnpm run demo\nnode src/cli.js scan http://localhost:3000 --id home --baseline baseline/snapshot.json --out current",
      boundary: "Uses axe-core's automated WCAG 2.0/2.1/2.2 A/AA checks and explicitly states that automated scanning is a starting point—keyboard, screen reader, and inclusive user testing remain essential.",
      liveUrl: "https://mirza-luqman.github.io/accessdelta/",
      repoUrl: "https://github.com/Mirza-Luqman/accessdelta"
    },
    shareveil: {
      category: "Security & Privacy CLI",
      status: "Public",
      title: "ShareVeil",
      subtitle: "Offline, zero-dependency Python CLI and library for redacting credentials from logs, AI prompts, and bug reports.",
      problem: "Developers regularly paste stack traces, config snippets, and logs into AI chats or bug trackers without noticing embedded tokens. ShareVeil provides a fast, inspectable offline step immediately before sharing—preserving debugging readability via consistent per-run placeholders.",
      flow: ["UTF-8 Log / Prompt / Stdin", "9 Heuristic Detectors", "Overlap Merge", "Consistent Label Map", "Redacted Text + Offset Findings"],
      highlights: [
        "Zero runtime dependencies and zero network calls; runs purely inside the local Python 3.10+ process.",
        "Assigns consistent placeholders within a run (e.g., [REDACTED_SECRET_1]) so multi-line traces stay followable.",
        "Detects GitHub tokens, AWS access keys, sk- API keys, Slack tokens, Bearer headers, credential assignments, URL credentials, PEM/OpenSSH private keys, and opt-in emails.",
        "Refuses to overwrite existing files via -o, never echoes matched values in reports, and uses exit codes 0/1/2 for `check`."
      ],
      stats: [
        { k: "Test Suite", v: "22 passing tests in CI" },
        { k: "Platforms", v: "Py 3.10–3.14 (Linux) + Win & macOS" },
        { k: "Dependencies", v: "None (Python standard library)" },
        { k: "API", v: "CLI (redact / check) + Python library" }
      ],
      cli: "python -m unittest discover -s tests -v\npython -m shareveil redact examples/demo.txt --emails\nshareveil check app.log --json",
      boundary: "Heuristic pattern matching, not provider validation. A clean check does not prove zero secrets exist (e.g., unlabeled or encoded secrets). Use dedicated repo scanners like Gitleaks for Git history and always revoke exposed credentials.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/shareveil"
    },
    "c2rust-verifier": {
      category: "Formal Verification Research",
      status: "Private Research · v1.2",
      title: "C-to-Rust Equivalence Verifier (v1.2)",
      subtitle: "Automated correspondence discovery, compositional summary verification, and symbolic memory/pointer equivalence checking using LLVM IR and cvc5.",
      problem: "Translating legacy C libraries to Rust introduces subtle semantic bugs around integer domains, pointer aliasing, nullability, and heap lifetime. Whole-program verification rarely scales, while naive inlining hits exponential O(3^k) CFG path explosion.",
      flow: ["C Source + Rust Crate", "Clang / Rustc LLVM IR", "Tarjan SCC Call Graph", "FunctionSummary Substitution", "cvc5 MemoryEngine (Alias/Heap)", "PROVED_SCOPED / DIFFERENT / UNKNOWN"],
      highlights: [
        "Compositional Verification: builds C/Rust call graphs with Tarjan SCC recursion detection and synthesizes formal FunctionSummary contracts strictly from PROVED_SCOPED pairs—achieving up to 231x solver speedup at k=6 and proving k=8 in 5.9 ms.",
        "Advanced Pointer & Heap Semantics: models aliased (a == b) vs. disjoint (a != b) pointers, nullable pointers, and bounded symbolic heap lifecycle (malloc/free/__rust_alloc) to catch aliasing bugs and unguarded null derefs that v1.1 missed.",
        "Controlled 5-Way Ablation (v1.1 -> v1.2-full): Set A 8/52 -> 11/52 (+37.5%), Set B 14/188 -> 22/188 (+57.1%), Set C 7/23 (2 false) -> 15/23 (65.2%, 0 false proofs).",
        "Real-crate unlocks with zero regressions: quadtree (0 -> 4/29 at k=3, 5/29 at k=5), rect_pack_h (0 -> 1/12 under #![forbid(unsafe_code)]), and kd3 (6 -> 9/26)."
      ],
      stats: [
        { k: "Regression Suite", v: "318 / 318 tests passing (0 skips)" },
        { k: "False Proofs (v1.2)", v: "0 across Sets A, B, and C" },
        { k: "Peak Speedup", v: "231x at depth k=6 (cvc5 1.3.1)" },
        { k: "Prior Milestone", v: "Hybrid coverage-guided Cargo regression gen" }
      ],
      cli: "# Offline compositional + advanced memory pipeline (private repo)\npython -m automatch.pipeline --project example \\\n  --c-root /path/to/c --rust-root /path/to/rust-crate \\\n  --out /path/to/fresh-results --compositional --advanced-memory",
      boundary: "Matching is transpiler-independent hypothesis generation; only formal checks establish equivalence. PROVED_SCOPED, DIFFERENT, and UNKNOWN remain strictly distinct, per-function proofs do not establish whole-repository equivalence, and optional LLM hints never count as verification evidence.",
      liveUrl: null,
      repoUrl: null
    },
    "proof-or-counter": {
      category: "Formal Reasoning",
      status: "Public",
      title: "ProofOrCounter",
      subtitle: "Model-agnostic prove-or-disprove harness racing Lean 4 proof generation against exhaustive and Z3 finite countermodel search.",
      problem: "LLMs frequently hallucinate plausible-looking mathematical arguments or assert false conjectures. ProofOrCounter enforces a strict machine-verified trust boundary under one wall-clock budget.",
      flow: ["JSON Conjecture Task", "Race: LLM -> Lean 4 Compiler", "Race: Exhaustive -> Z3 Finite Model", "Certificate Digest & Verification", "PROVED / DISPROVED / UNRESOLVED"],
      highlights: [
        "Connects to any OpenAI-compatible backend (vLLM, Ollama, LM Studio) and returns bounded Lean 4 compiler diagnostics for iterative proof repair.",
        "Exhaustively searches small finite carriers before escalating to a Z3 finite encoding, verifying closure, axioms, and falsifying witnesses.",
        "Every run emits verdict.json, proof.lean or counterexample.json, and prover-trace.json with latency and digests.",
        "5/5 deterministic benchmark cases (3 disproved 2-element models + 2 Lean 4 kernel proofs) verified continuously in GitHub Actions."
      ],
      stats: [
        { k: "CI Evidence", v: "12 unit tests + 5/5 Lean/Z3 benchmark" },
        { k: "Stack", v: "Python, Lean 4 (elan), Z3, Ruff" },
        { k: "Plugins", v: "Magma & semigroup equational tasks" },
        { k: "Trust Boundary", v: "Lean kernel + exhaustive witness verifier" }
      ],
      cli: "proofcounter bench benchmarks/manifest.json\nproofcounter run examples/noncommutative-magma.json --output-dir runs/demo --backend none --max-size 4",
      boundary: "Protocol 1.0 handles universally quantified identities over one binary operation. Finite search cannot prove truth and bounded proof search cannot establish falsehood—UNRESOLVED is an intentional, honest outcome. Contains no competition prompts or judge logic.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/proof-or-counter"
    },
    "model-observatory": {
      category: "ML Systems & MLOps",
      status: "Live · Public",
      title: "Model Observatory",
      subtitle: "Dependency-light Python CLI producing deterministic HTML & JSON classification reports covering calibration, selective risk, slices, and drift.",
      problem: "Aggregate accuracy routinely hides severe overconfidence, degraded minority slices, or subtle input distribution shifts. Model Observatory packages pre-deployment and monitoring checks into one stdlib-only command.",
      flow: ["Prediction JSONL", "Strict Schema Guard", "Quality + Calibration + Risk", "Worst-First Slices", "Reference vs Current Drift", "summary.json + report.html"],
      highlights: [
        "Pure Python standard library runtime—runs cleanly in locked-down CI pipelines or lightweight batch jobs.",
        "Covers accuracy, balanced accuracy, macro F1, log loss, Brier score, ECE, selective risk-coverage curves, worst-first slices, JSD, and confidence PSI.",
        "Strict schema loader rejects malformed JSON, duplicate IDs, non-finite probabilities, and rows not summing to 1 with file/line context.",
        "29 hand-calculated and end-to-end tests passing across Python 3.10–3.12 in CI."
      ],
      stats: [
        { k: "Test Suite", v: "29 passing tests (Py 3.10–3.12)" },
        { k: "Dependencies", v: "Zero runtime dependencies (stdlib)" },
        { k: "Artifacts", v: "Self-contained HTML + summary.json" },
        { k: "Live Demo", v: "Synthetic shifted dataset (n=600, seed=17)" }
      ],
      cli: "python -m pytest\nmodel-observatory demo --output-dir demo-output --size 600 --seed 17\nmodel-observatory compare --reference ref.jsonl --current cur.jsonl --output-dir report",
      boundary: "PSI and Jensen-Shannon divergence flag distribution change without explaining root cause. Drift thresholds are deliberately not hard-coded because acceptable risk depends on domain policy. The live report uses a disclosed synthetic dataset.",
      liveUrl: "https://mirza-luqman.github.io/model-observatory/",
      repoUrl: "https://github.com/Mirza-Luqman/model-observatory"
    },
    "multimodal-perception": {
      category: "Real-Time Computer Vision",
      status: "Public",
      title: "Multimodal Perception",
      subtitle: "Real-time MediaPipe Holistic + OpenCV pipeline fusing 21 hand, 468 face, and 33 pose landmarks into tested geometry events.",
      problem: "Webcam vision projects often tangle landmark inference with application logic, making behavior impossible to unit-test without a live camera. Multimodal Perception separates a deterministic, camera-free geometry core from the live runtime.",
      flow: ["Camera Frame", "MediaPipe Holistic", "21 Hand / 468 Face / 33 Pose", "Pure-Python Geometry Core", "Gesture + Yaw + Lean Events", "JSONL Evaluation CLI"],
      highlights: [
        "Dependency-free geometry core computes finger reach, joint angles, nose-to-eye yaw proxy, and shoulder-to-hip torso lean.",
        "Emits structured frame-level events (e.g., gesture=victory, face_turn=right, torso_lean=left) testable on synthetic or saved JSONL landmarks.",
        "14 deterministic CI tests cover gesture, face-turn, torso-lean, modality-fusion, and invalid-input edge cases on Python 3.10–3.12.",
        "Includes `multimodal-perception evaluate` for auditable benchmarking on labeled landmark files."
      ],
      stats: [
        { k: "Landmarks Fused", v: "21 Hand · 468 Face · 33 Pose" },
        { k: "Test Suite", v: "14 deterministic CI tests" },
        { k: "Stack", v: "Python, MediaPipe Holistic, OpenCV, pytest" },
        { k: "Prior Student Run", v: "~85% gesture / ~90% pose (disclosed)" }
      ],
      cli: "multimodal-perception demo\npytest\nmultimodal-perception camera --camera 0",
      boundary: "Gesture rules are interpretable geometric baselines, not a trained sign-language model, and face turn is a 2D yaw proxy rather than metric 3D pose. Historical ~85%/~90% numbers are explicitly disclosed as prior student-project test cases rather than reproduced repository benchmarks.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/multimodal-perception"
    },
    "uncertainty-aware-qa": {
      category: "LLM Evaluation & Calibration",
      status: "Public",
      title: "Uncertainty-Aware QA",
      subtitle: "Reproducible black-box LLM confidence benchmark with semantic clustering, paired bootstrap intervals, and preregistered confirmatory pooling.",
      problem: "When only black-box API access is available, choosing reliable confidence estimates for selective answering requires controlled, resumable experiments rather than ad-hoc prompting.",
      flow: ["SQuAD / TruthfulQA Subset", "Multi-Sample Resumable Collector", "LLM / Lexical Semantic Clustering", "6 Confidence Signals", "Bootstrap 95% CIs + Platt Ref", "Confirmatory Report"],
      highlights: [
        "Implements 6 signals: self-consistency, verbalized confidence, semantic-entropy confidence, SelfCheckGPT-style support, combined mean, and agreement-gated verbal confidence.",
        "Atomic resumable JSONL collection with .config.json sidecars preventing accidental mixed-config runs and strict `--require-llm-clustering` guards.",
        "Generates calibration curves, nested sample-count ablations without extra API calls, paired bootstrap 95% CIs, and held-out Platt/logistic supervised references.",
        "36 passing unit/offline analysis tests verify scoring, clustering repair trails, and confirmatory pooling."
      ],
      stats: [
        { k: "Test Suite", v: "36 passing tests + offline path" },
        { k: "Signals Evaluated", v: "6 black-box + supervised reference" },
        { k: "Benchmarks", v: "Deterministic SQuAD & TruthfulQA strata" },
        { k: "Pilot Figure", v: "n = 100 exploratory pilot" }
      ],
      cli: "uncertainty-collect --limit 5 --samples 5 --output results/squad.jsonl\nuncertainty-analyze --input results/squad.jsonl --output-dir results/analysis --bins 10\nuncertainty-report --metrics results/analysis/metrics.json",
      boundary: "The displayed calibration figure is explicitly marked as an exploratory n=100 pilot; confirmatory decisions use excluded pilot IDs and a frozen equal-stratum pooling command.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/uncertainty-aware-qa"
    },
    "reasoning-eval-lab": {
      category: "LLM Evaluation Infrastructure",
      status: "Public",
      title: "Reasoning Eval Lab",
      subtitle: "Concurrent, resumable inference and exact/numeric scoring pipeline for mathematical reasoning models.",
      problem: "Long reasoning evaluations waste GPU hours when interrupted scripts lose progress or couple expensive generation tightly to answer parsing.",
      flow: ["JSONL Math Problems", "Async Concurrent Workers", "OpenAI-Compat Endpoint (vLLM/Ollama)", "Append-Only generations.jsonl", "Balanced-Brace \\boxed{} Extractor", "Exact/Numeric + Pass@k Scores"],
      highlights: [
        "Concurrency-limited asyncio client talks to vLLM, Ollama, LM Studio, or any OpenAI-compatible server with retry and latency logging.",
        "Append-only JSONL storage tracks completed problem/sample pairs so interrupted runs resume cleanly without re-querying.",
        "Decoupled evaluation stage supports balanced-brace \\boxed{...} extraction, final-answer fallbacks, and numeric equivalence across decimals, fractions, and percentages.",
        "Reads OPENAI_API_KEY solely from environment variables and never writes credentials into output artifacts."
      ],
      stats: [
        { k: "Test Suite", v: "9 CI tests (Py 3.10–3.12)" },
        { k: "Stack", v: "Python, asyncio, JSONL, Ruff, unittest" },
        { k: "Backends", v: "Mock smoke backend + OpenAI-compat" },
        { k: "Metrics", v: "Aggregate accuracy & pass-at-samples" }
      ],
      cli: "reasoning-eval run --input examples/sample_math.jsonl --output outputs/generations.jsonl --backend mock --samples 2\nreasoning-eval evaluate --problems examples/sample_math.jsonl --generations outputs/generations.jsonl --output outputs/scores.jsonl",
      boundary: "Generalized portfolio architecture containing no competition prompts, private datasets, or judge protocols. Built-in sample data validates pipeline behavior rather than claiming model accuracy.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/reasoning-eval-lab"
    },
    "robotics-control-lab": {
      category: "Embedded Control & Simulation",
      status: "Public",
      title: "Robotics Control Lab",
      subtitle: "Deterministic Python simulations for range-sensor obstacle avoidance and anti-windup PID two-wheel self-balancing control.",
      problem: "Physical student robotics prototypes are difficult for external reviewers to inspect or reproduce. This lab isolates the core control laws behind clean interfaces, deterministic numerical simulations, and automated spec tests.",
      flow: ["Range / Gyro Inputs", "Hysteresis FSM / Anti-Windup PID", "Torque & Velocity Commands", "Low-Order Balance Dynamics", "CSV Trace + Response Plot"],
      highlights: [
        "Obstacle avoidance uses stop/release hysteresis to eliminate threshold chatter, steers toward greater clearance, and reverses when boxed in.",
        "Self-balancing controller implements a bounded PID loop with integral anti-windup and explicit torque saturation (+/-10).",
        "Default 10 ms closed-loop simulation from an initial 0.18 rad lean settles within +/-0.02 rad after 0.65 s and ends below 0.005 rad.",
        "10 pytest checks enforce settling time, final tilt error, saturation bounds, and hysteresis transitions in CI."
      ],
      stats: [
        { k: "Test Suite", v: "10 simulation-enforced pytest checks" },
        { k: "Settling Spec", v: "< 0.65 s to +/-0.02 rad; < 0.005 rad final" },
        { k: "Torque Limit", v: "Strictly bounded within +/-10" },
        { k: "Stack", v: "Python, PID, FSM, Matplotlib, Ruff" }
      ],
      cli: "pytest\nrobotics-control-lab --csv outputs/balance_response.csv --plot docs/balance-response.png",
      boundary: "Uses a disclosed low-order unstable pendulum model for software verification—not a full physical digital twin (omits wheel slip, backlash, battery sag, and sensor delay). Must not serve as the sole safety layer on physical hardware.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/robotics-control-lab"
    },
    "prompt-storyboard-studio": {
      category: "Generative Video Tooling",
      status: "Public",
      title: "Prompt Storyboard Studio",
      subtitle: "Schema-validated storyboard-to-prompt compiler that catches duration, style, and continuity errors before paid video generation.",
      problem: "Iterative text-to-video experiments quickly devolve into inconsistent folders of prompts with broken shot continuity and aspect-ratio drift that only show up after burning generation credits.",
      flow: ["JSON Storyboard", "Dataclass Schema Checks", "Shot ID & Duration Bounds", "Continuity Anchor Verification", "Provider-Neutral Prompt Compiler", "Reviewable Markdown Shot List"],
      highlights: [
        "Validates unique shot IDs, bounded durations, exact incoming/outgoing continuity anchors, camera/lighting language, and explicit negative constraints.",
        "Intentionally avoids calling paid video APIs so prompt plans can be versioned, reviewed, and tested in CI first.",
        "Includes a 5-shot, 30-second future-and-drone storyboard reconstructing the structured workflow behind his First Prize win at a Harbin AIGC prompt-video competition.",
        "6 CI pytest checks validate schema integrity, continuity handoffs, and full rendered coverage."
      ],
      stats: [
        { k: "Test Suite", v: "6 passing pytest checks in CI" },
        { k: "Included Example", v: "5 connected shots · 30 s total runtime" },
        { k: "Stack", v: "Python, JSON, dataclasses, Ruff, pytest" },
        { k: "Inspiration", v: "Harbin AIGC Video Competition 1st Prize" }
      ],
      cli: "pytest\nprompt-storyboard validate examples/future-drone-storyboard.json\nprompt-storyboard render examples/future-drone-storyboard.json --output examples/future-drone-prompts.md",
      boundary: "Validates structural continuity rather than visual quality or physics. The included drone storyboard is explicitly disclosed as a fresh reconstruction of the workflow rather than claiming to be the archived original winning prompt file.",
      liveUrl: null,
      repoUrl: "https://github.com/Mirza-Luqman/prompt-storyboard-studio"
    },
    "sair-stage-2": {
      category: "Competition Research",
      status: "Private Competition",
      title: "SAIR Stage 2 Magma Solver",
      subtitle: "Hybrid Python + Lean 4 theorem-proving and finite-countermodel engine for universal magma equational implications.",
      problem: "Automatically deciding whether one universal magma equation implies another requires balancing rapid refutation via small finite models against constructive proof search—while accepting only machine-verified certificates.",
      flow: ["Equational Implication", "Unification + Bidirectional BFS + Library", "Exhaustive / Z3 Finite Magmas (n=2..7)", "Error-Guided LLM Proof Repair", "Lean 4 Kernel / Table Validator", "Verified Certificate"],
      highlights: [
        "Combines finite-model search over magmas of size 2–7 with symbolic unification, bidirectional BFS rewriting, constancy-lemma synthesis, and proof-library lookup.",
        "Falls back to an LLM guided by structured Lean 4 compiler error messages when deterministic symbolic search does not close the goal.",
        "Follows a Stage 1 performance ranking 1st university-wide and ~80th overall with 58.0% accuracy, 43.4% F1, and 99.6% parse success.",
        "Generalized public verification architecture is published separately in ProofOrCounter."
      ],
      stats: [
        { k: "Stage 1 Rank", v: "1st University-wide · ~80th Overall" },
        { k: "Stage 1 Metrics", v: "58.0% acc · 43.4% F1 · 99.6% parse" },
        { k: "Finite Search", v: "Magma carriers of size 2–7" },
        { k: "Public Analog", v: "Mirza-Luqman/proof-or-counter" }
      ],
      cli: "# Competition solver remains private pending disclosure clearance.\n# Inspect the generalized public harness:\ngit clone https://github.com/Mirza-Luqman/proof-or-counter.git",
      boundary: "Competition-specific solver code, prompts, datasets, and judge protocols are kept strictly private pending disclosure clearance. No private materials are exposed in this portfolio.",
      liveUrl: null,
      repoUrl: null
    }
  };

  const modal = document.getElementById("dossier-modal");
  const modalClose = document.getElementById("dossier-close");
  const modalTitle = document.getElementById("dossier-title");
  const modalSubtitle = document.getElementById("dossier-subtitle");
  const modalCategory = document.getElementById("dossier-category");
  const modalStatus = document.getElementById("dossier-status");
  const modalProblem = document.getElementById("dossier-problem");
  const modalFlow = document.getElementById("dossier-flow");
  const modalHighlights = document.getElementById("dossier-highlights");
  const modalStats = document.getElementById("dossier-stats");
  const modalCli = document.getElementById("dossier-cli");
  const modalBoundary = document.getElementById("dossier-boundary");
  const modalActions = document.getElementById("dossier-actions");
  const copyCmdBtn = document.getElementById("copy-cmd-btn");

  let lastFocusedTrigger = null;

  function openDossier(projectId, triggerEl) {
    const data = DOSSIERS[projectId];
    if (!data || !modal) return;
    lastFocusedTrigger = triggerEl || document.activeElement;

    modalCategory.textContent = data.category;
    modalStatus.textContent = data.status;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalProblem.textContent = data.problem;

    modalFlow.textContent = "";
    data.flow.forEach((step, idx) => {
      const node = document.createElement("span");
      node.className = "flow-node";
      node.textContent = step;
      modalFlow.appendChild(node);
      if (idx < data.flow.length - 1) {
        const arrow = document.createElement("span");
        arrow.className = "flow-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "\u2192";
        modalFlow.appendChild(arrow);
      }
    });

    modalHighlights.textContent = "";
    data.highlights.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      modalHighlights.appendChild(li);
    });

    modalStats.textContent = "";
    data.stats.forEach((item) => {
      const wrap = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = item.k;
      const dd = document.createElement("dd");
      dd.textContent = item.v;
      wrap.append(dt, dd);
      modalStats.appendChild(wrap);
    });

    modalCli.textContent = data.cli;
    if (copyCmdBtn) copyCmdBtn.textContent = "Copy";
    modalBoundary.textContent = data.boundary;

    modalActions.textContent = "";
    if (data.liveUrl) {
      const liveLink = document.createElement("a");
      liveLink.className = "button button-primary";
      liveLink.href = data.liveUrl;
      liveLink.target = "_blank";
      liveLink.rel = "noreferrer";
      liveLink.textContent = "Open Live Deployment \u2197";
      modalActions.appendChild(liveLink);
    }
    if (data.repoUrl) {
      const repoLink = document.createElement("a");
      repoLink.className = data.liveUrl ? "button button-secondary" : "button button-primary";
      repoLink.href = data.repoUrl;
      repoLink.target = "_blank";
      repoLink.rel = "noreferrer";
      repoLink.textContent = "Inspect on GitHub \u2197";
      modalActions.appendChild(repoLink);
    }
    if (!data.liveUrl && !data.repoUrl) {
      const privatePill = document.createElement("span");
      privatePill.className = "status-pill status-private";
      privatePill.textContent = "Private Research Repository";
      modalActions.appendChild(privatePill);
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    if (modalClose) modalClose.focus();
  }

  function closeDossier() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  document.querySelectorAll("[data-project-detail]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openDossier(trigger.dataset.projectDetail, trigger);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeDossier);
  }
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeDossier();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDossier();
      setDrawerOpen(false);
    }
  });

  if (copyCmdBtn) {
    copyCmdBtn.addEventListener("click", async () => {
      const text = modalCli ? modalCli.textContent : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        copyCmdBtn.textContent = "Copied!";
        setTimeout(() => {
          copyCmdBtn.textContent = "Copy";
        }, 1800);
      } catch (err) {
        copyCmdBtn.textContent = "Select & copy";
      }
    });
  }

  /* ---------- 13. Copy Email Button ---------- */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = copyEmailBtn.dataset.email || "arshadluqman474@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        copyEmailBtn.textContent = "Copied: " + email;
        setTimeout(() => {
          copyEmailBtn.textContent = "Copy email address";
        }, 2400);
      } catch (err) {
        window.location.href = "mailto:" + email;
      }
    });
  }
})();
