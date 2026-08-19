const CONFIG = {
  tokenAddress: "TBA",
  dexScreenerPair: "",
  pumpFunUrl: "",
  twitter: "https://x.com/mrnavaccinex",
  telegram: "https://t.me/mrnavaccine_tg",
};

function isTokenLive() {
  const addr = (CONFIG.tokenAddress || "").trim();
  return Boolean(addr) && addr.toUpperCase() !== "TBA" && addr.length > 20;
}

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (isTokenLive()) return `https://pump.fun/coin/${CONFIG.tokenAddress}`;
  return "https://pump.fun";
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = isTokenLive() ? CONFIG.tokenAddress : "TBA";

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    if (!isTokenLive()) {
      toast.textContent = "CA is TBA — nothing to copy yet.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
      return;
    }

    try {
      await navigator.clipboard.writeText(CONFIG.tokenAddress);
      copyBtn.textContent = "Copied";
      toast.textContent = "Contract address copied.";
      toast.classList.add("show");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select the address manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("site-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    if (CONFIG.telegram) {
      el.href = CONFIG.telegram;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    if (CONFIG.twitter) el.href = CONFIG.twitter;
  });
}

function initTweetEmbed() {
  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  script.charset = "utf-8";
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initNav();
  initSocialLinks();
  initTweetEmbed();
});
