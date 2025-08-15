(() => {
  const s = document.currentScript;
  const widgetUrl = (s && s.dataset.widgetUrl) || "https://bot.yourdomain.com/widget";
  const brand = (s && s.dataset.brand) || "Mojo Insurance";
  const primary = (s && s.dataset.primary) || "#0ea5e9";
  const position = (s && s.dataset.position) || "right";

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    zIndex: "2147483647",
    bottom: "20px",
    [position]: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: position === "right" ? "flex-end" : "flex-start",
  });
  document.body.appendChild(container);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.ariaLabel = "Open chat";
  Object.assign(btn.style, {
    height: "48px",
    minWidth: "48px",
    borderRadius: "999px",
    border: "none",
    padding: "0 16px",
    boxShadow: "0 12px 24px rgba(0,0,0,.18)",
    cursor: "pointer",
    background: primary,
    color: "#fff",
    fontWeight: "600",
  });
  btn.textContent = "Chat";
  container.appendChild(btn);

  const frame = document.createElement("iframe");
  frame.title = `${brand} Chat`;
  Object.assign(frame.style, {
    width: "360px",
    maxWidth: "calc(100vw - 32px)",
    height: "520px",
    border: "0",
    borderRadius: "16px",
    marginTop: "12px",
    display: "none",
  });
  frame.allow = "clipboard-read; clipboard-write; microphone; geolocation";
  frame.src = `${widgetUrl}?brand=${encodeURIComponent(brand)}&primary=${encodeURIComponent(primary)}`;
  container.appendChild(frame);

  let open = false;
  const setOpen = (v) => { open = v; frame.style.display = open ? "block" : "none"; btn.textContent = open ? "Close" : "Chat"; };
  btn.addEventListener("click", () => setOpen(!open));
  window.addEventListener("message", (e) => { if (typeof e.data === "object" && e.data?.type === "mojo:close") setOpen(false); });
})();
