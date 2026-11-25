# Luqman Arshad - AI/ML & Verification Systems Portfolio

A recruiter- and researcher-facing engineering portfolio presenting 12 systems across formal verification, multimodal sensing, computer vision, ML observability, LLM evaluation, accessibility testing, offline security tooling, and embedded robotics control.

## Highlights

- **9 flagship visual & interactive exhibits**, including deployed live links (`ChronoFret`, `AccessDelta`, `Model Observatory`), interactive live sandboxes (`ShareVeil` offline redactor, `ProofOrCounter` 3-mode verification trace, `Multimodal Perception` interactive landmark canvas, `Reasoning Eval Lab` pipeline trace), and generated scientific/simulation artifacts (`Uncertainty-Aware QA`, `Robotics Control Lab`).
- **Dual formal-verification research showcase** switching between the **C-to-Rust Equivalence Verifier (v1.2)** (LLVM IR + `cvc5`, compositional summary reuse, symbolic heap/pointer semantics, 318 passing tests, 0 false proofs) and the **SAIR Stage 2 Magma Solver**.
- **Searchable, filterable 12-project library** with an interactive **Technical Dossier Modal** covering problem motivation, architecture flows, verified evidence, CLI commands, and explicit interpretation boundaries for every system.
- **Architectural light & dark themes**, responsive mobile navigation drawer, scroll progress indicator, and zero runtime frameworks for fast static GitHub Pages delivery.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Deployment

Pushes to `main` deploy automatically to GitHub Pages through `.github/workflows/deploy.yml`.

## Evidence policy

The site links to public source repositories under `github.com/Mirza-Luqman`, identifies simulated results as simulation, marks exploratory research figures as pilot evidence, labels private formal-verification work clearly without leaking proprietary code or competition protocols, and scopes team research by role (`PipGuard`: Chao Qin as project leader; Luqman Arshad as technical presenter).

## Public site

The deployed portfolio is available at <https://mirza-luqman.github.io/luqman-arshad/>.
