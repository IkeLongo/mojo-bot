(() => {
  const s = document.currentScript;
  const widgetUrl = (s && s.dataset.widgetUrl) || "https://bot.yourdomain.com/widget";
  const brand = (s && s.dataset.brand) || "Mojo Insurance";
  const gradient = (s && s.dataset.gradient) || "linear-gradient(134deg, #7A5AFD 0%, #A887FA 100%)";
  const align = (s && s.dataset.align) || "bottom-right"; // e.g., bottom-right, bottom-left, top-right, top-left

  // Fixed container anchored to viewport
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    zIndex: "2147483647",
    bottom: align.includes("bottom") ? "20px" : "",
    top: align.includes("top") ? "20px" : "",
    right: align.includes("right") ? "20px" : "",
    left: align.includes("left") ? "20px" : "",
    width: "auto",
    height: "auto",
  });
  // Make children position relative to this box
  container.style.position = "fixed";
  container.style.pointerEvents = "none"; // parent ignores events; children will enable
  document.body.appendChild(container);

  // Chat panel wrapper (absolute, stacked above the bubble)
  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "absolute",
    bottom: "72px",        // sits above the 64px bubble (+8px gap)
    right: "0",
    width: "360px",
    maxWidth: "calc(100vw - 32px)",
    height: "520px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,.18)",
    opacity: "0",
    transform: "translateY(8px)",
    transition: "opacity 200ms ease, transform 200ms ease",
    pointerEvents: "none",  // disabled until opened
    background: "transparent",
  });
  panel.style.boxSizing = "border-box";

  const frame = document.createElement("iframe");
  frame.title = `${brand} Chat`;
  Object.assign(frame.style, {
    width: "100%",
    height: "100%",
    border: "0",
    display: "block",
    background: "transparent",
  });
  // Pass embed=1 so the iframe renders the open panel (no inner bubble)
  const src = `${widgetUrl}?brand=${encodeURIComponent(brand)}&embed=1&gradient=${encodeURIComponent(gradient)}`;
  frame.src = src;
  frame.allow = "clipboard-read; clipboard-write; microphone; geolocation";
  panel.appendChild(frame);
  container.appendChild(panel);

  // Purple gradient circular bubble (the only toggle)
  const btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", "Open chat");
  Object.assign(btn.style, {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 12px 24px rgba(0,0,0,.18)",
    cursor: "pointer",
    backgroundImage: gradient,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    margin: "0",
    pointerEvents: "auto"  // enable clicks
  });
  btn.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>`;
  container.appendChild(btn);

  let open = false;
  const setOpen = (v) => {
    open = v;
    if (open) {
      // SNAP THE PANEL TO THE CORNER WHEN OPEN
      panel.style.bottom = "0";   // <-- key fix
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0)";
      panel.style.pointerEvents = "auto";
      btn.style.display = "none"; // hide bubble while open
    } else {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(8px)";
      panel.style.pointerEvents = "none";
      btn.style.display = "inline-flex";
    }
  };

  btn.addEventListener("click", () => setOpen(true));

  // Let the iframe ask the parent to close
  window.addEventListener("message", (e) => {
    if (typeof e.data === "object" && e.data?.type === "mojo:close") setOpen(false);
  });

  // Ensure pointer events work even though parent is none
  panel.style.pointerEvents = "none"; // default closed
  // When panel is opened we flip to auto in setOpen()

  // Start closed
  setOpen(false);
})();