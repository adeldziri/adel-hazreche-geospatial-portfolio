/**
 * ADEL HAZRECHE — Technical Portfolio
 * Lightweight Vanilla JavaScript (Zero Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initArchitecturePipeline();
  initClipboardHelpers();
  initSmoothScroll();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      drawer.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('is-open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close when clicking a link inside mobile drawer
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Interactive Architecture Pipeline Data & Switcher
 */
const PIPELINE_DATA = {
  1: {
    title: "1. Field Data Capture & Survey",
    inputs: "High-precision GNSS coordinates, RTK surveys, drone point clouds, field redlines, engineering as-builts, inspection forms.",
    transform: "Coordinate reference system normalization, spatial validation, QA/QC topology validation, attribute schema mapping.",
    output: "Field-verified, provenance-tracked spatial primitives with survey timestamps and surveyor metadata."
  },
  2: {
    title: "2. Spatial Database Engineering",
    inputs: "Normalized spatial tables, spatial indices (GIST), PostGIS spatial extension on PostgreSQL.",
    transform: "Relational foreign keys, geometric constraint triggers, audit logging, multi-user versioned editing workflows.",
    output: "Enterprise spatial database acting as the single source of truth for all physical and logical infrastructure assets."
  },
  3: {
    title: "3. Network Data Modeling",
    inputs: "Physical nodes, splitters, splice enclosures, ducts, chambers, conduits, cables, and trace lines.",
    transform: "Geometric network topology rules, connectivity graphs (directed/undirected), port-to-port and fiber-to-fiber mapping.",
    output: "Validated graph data structures capable of traversal, continuous tracing, and topological integrity enforcement."
  },
  4: {
    title: "4. Network Intelligence & Spatial Analysis",
    inputs: "Network topology graph, customer tie-ins, load parameters, terrain elevation, rights-of-way.",
    transform: "Upstream/downstream tracing, point-of-failure isolation, outage impact simulation, route optimization, shortest-path calculation.",
    output: "Instant spatial decision-support calculations, blast-radius metrics, and situational dispatch advisories."
  },
  5: {
    title: "5. Operational WebGIS Platforms",
    inputs: "Vector tiles (MVT), OGC GeoServices (WMS, WFS), secure REST endpoints, role-based spatial permissions.",
    transform: "Hardware-accelerated web rendering (WebGL/MapLibre/OpenLayers), client-side spatial query engines, responsive UI.",
    output: "Interactive, browser-based asset portals accessible across desktop consoles, field tablets, and control room monitors."
  },
  6: {
    title: "6. Field Operations & Closed-Loop Workflows",
    inputs: "Work orders, maintenance tickets, contractor updates, optical time-domain reflectometer (OTDR) readings.",
    transform: "Offline-first SQLite/SpatiaLite sync, asynchronous push/pull deltas, conflict resolution, automated as-built signoff.",
    output: "Real-time synchronization between frontline engineering crews and central engineering databases."
  },
  7: {
    title: "7. Digital-Twin Foundations",
    inputs: "Full physical and logical infrastructure models, real-time SCADA/telemetry feeds, spatial sensor logs.",
    transform: "Continuous asset lifecycle state transitions, spatial simulation pipelines, predictive capacity modeling.",
    output: "Traceable, auditable spatial digital twin foundation ready for predictive operations and industrial simulation."
  }
};

function initArchitecturePipeline() {
  const nodes = document.querySelectorAll('.pipeline-node');
  const detailsPanel = document.getElementById('architecture-details');
  if (!detailsPanel || nodes.length === 0) return;

  const titleEl = detailsPanel.querySelector('.detail-title');
  const inputsEl = detailsPanel.querySelector('.detail-inputs');
  const transformEl = detailsPanel.querySelector('.detail-transform');
  const outputEl = detailsPanel.querySelector('.detail-output');

  function updatePanel(stepId) {
    const data = PIPELINE_DATA[stepId];
    if (!data) return;

    nodes.forEach(node => {
      if (node.getAttribute('data-step') === String(stepId)) {
        node.classList.add('is-active');
        node.setAttribute('aria-selected', 'true');
      } else {
        node.classList.remove('is-active');
        node.setAttribute('aria-selected', 'false');
      }
    });

    if (titleEl) titleEl.textContent = data.title;
    if (inputsEl) inputsEl.textContent = data.inputs;
    if (transformEl) transformEl.textContent = data.transform;
    if (outputEl) outputEl.textContent = data.output;
  }

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = node.getAttribute('data-step');
      updatePanel(step);
    });

    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const step = node.getAttribute('data-step');
        updatePanel(step);
      }
    });
  });
}

/**
 * Copy to Clipboard with Unobtrusive Feedback Toast
 */
function initClipboardHelpers() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  if (copyButtons.length === 0) return;

  let toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.className = 'copy-feedback-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  let toastTimeout;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        toast.textContent = `Copied to clipboard: ${textToCopy}`;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      } catch (err) {
        // Fallback prompt if clipboard permissions are restricted
        window.prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
      }
    });
  });
}

/**
 * Smooth Scrolling for Anchor Links with Header Offset
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
