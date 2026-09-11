/* ============================================================
   GOAL IIT-JEE & MEDICAL COACHING CENTRE, DHANBAD
   Digital Card & Prospectus Configuration and Engine
   ============================================================ */

/**
 * EDITABLE CONFIGURATION AREA
 * Update contact details, links, or addresses here.
 * Note: Never invent fake ranks, toppers, or unverified claims.
 */
const CONFIG = {
  instituteName: "GOAL IIT–JEE & Medical Coaching Centre",
  city: "Dhanbad",
  
  // Medical Division (GOAL Empire)
  phoneMedical: "9334098595",
  whatsappMedical: "9334098595",
  phoneMedicalAlt: "9308057050",
  addressMedical: "GOAL Empire — Memko More, Opp. Prabhatam Grand Mall, Dhaiya, Dhanbad",

  // Engineering Division (GOAL Empire)
  phoneEngineering: "9334098595",
  whatsappEngineering: "9334098595",
  phoneEngineeringAlt: "9308057050",
  addressEngineering: "GOAL Empire — Memko More, Opp. Prabhatam Grand Mall, Dhaiya, Dhanbad",

  // Online Review & Map URLs (Configurable)
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJkd4KCaO89jkR-5rBOe9yg3E", // Google Business review page
  googleMapsUrl: "https://maps.app.goo.gl/nrwjSwJdJ8LpchpF6",
  prospectusUrl: "https://drive.google.com/file/d/1rSO-aBlHHshFzRKpAUZy22W5R07CdKRy/view?usp=drive_link",
  digitalCardUrl: "", // Leave empty to automatically use live deployed URL
  email: "dhanbad@goaleducation.com",
  siteUrl: "https://algorivexlabs-droid.github.io/goal-digital-card" // Deployment origin for canonical/og:image metadata
};

// Global Configurable URLs
const GOOGLE_REVIEW_URL = CONFIG.googleReviewUrl;
const PROSPECTUS_URL = "https://drive.google.com/file/d/1rSO-aBlHHshFzRKpAUZy22W5R07CdKRy/view?usp=drive_link";
const DIGITAL_CARD_URL = CONFIG.digitalCardUrl;

/**
 * Helper: Strip non-numeric characters for phone/WhatsApp links
 */
function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Helper: Determine if value is a non-empty string
 */
function isSet(value) {
  return Boolean(String(value || "").trim());
}

/**
 * Build a valid WhatsApp link with optional pre-filled message
 */
function buildWhatsAppUrl(phoneNumber, message) {
  const cleanNumber = digitsOnly(phoneNumber);
  if (!cleanNumber) return "";
  const base = "https://wa.me/" + cleanNumber;
  return message ? base + "?text=" + encodeURIComponent(message) : base;
}

/**
 * Safely bind an anchor tag with href and accessibility attributes
 */
function setLink(elementId, href, isAvailable) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (isAvailable && href) {
    el.href = href;
    el.removeAttribute("aria-disabled");
    el.removeAttribute("tabindex");
  } else {
    el.href = "#";
    el.setAttribute("aria-disabled", "true");
  }
}

/**
 * Check whether a programme relates to Engineering/JEE
 */
function isEngineeringProgram(program) {
  return /jee|iit|engineering/i.test(String(program || ""));
}

/**
 * Synchronize social sharing metadata if siteUrl is configured
 */
function syncMetadata() {
  if (!CONFIG.siteUrl) return;
  const origin = CONFIG.siteUrl.replace(/\/$/, "");
  const ogImage = origin + "/assets/og-image.svg";
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = origin + "/";
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    meta.setAttribute("content", ogImage);
  });
}

/**
 * Apply configuration links to DOM elements
 */
function applyConfiguration() {
  const defaultGreeting = "Hello, I would like to know more about admissions at GOAL, Dhanbad.";
  const medicalWa = buildWhatsAppUrl(CONFIG.whatsappMedical, defaultGreeting);
  const engineeringWa = buildWhatsAppUrl(CONFIG.whatsappEngineering, defaultGreeting);
  const primaryWa = medicalWa || engineeringWa;
  
  const medicalTel = CONFIG.phoneMedical ? "tel:" + CONFIG.phoneMedical : "";
  const engineeringTel = CONFIG.phoneEngineering ? "tel:" + CONFIG.phoneEngineering : "";
  const primaryTel = medicalTel || engineeringTel;

  const reviewUrl = (GOOGLE_REVIEW_URL || "").trim();
  const mapsUrl = (CONFIG.googleMapsUrl || "").trim();
  const prospectus = (PROSPECTUS_URL || CONFIG.prospectusUrl || "").trim();
  const applyProspectus = (id) => {
    const el = document.getElementById(id);
    if (!el || !prospectus) return;
    el.href = prospectus;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.removeAttribute("aria-disabled");
  };

  applyProspectus("btnProspectus");
  applyProspectus("pillProspectus");
  applyProspectus("dockProspectus");

  setLink("btnMaps", mapsUrl, isSet(mapsUrl));
  setLink("callMedical", medicalTel, isSet(medicalTel));
  setLink("callEngineering", engineeringTel, isSet(engineeringTel));
  setLink("waMedical", medicalWa, isSet(medicalWa));
  setLink("waEngineering", engineeringWa, isSet(engineeringWa));
  setLink("btnWhatsapp", primaryWa, isSet(primaryWa));
  setLink("btnCall", primaryTel, isSet(primaryTel));
  setLink("contactCall", primaryTel, isSet(primaryTel));
  setLink("contactWa", primaryWa, isSet(primaryWa));
  setLink("waFloat", primaryWa, isSet(primaryWa));
  setLink("btnWaFinal", primaryWa, isSet(primaryWa));

  // Google Review Button — opens Google Maps review page in new tab, no WhatsApp
  const btnGoogleReview = document.getElementById("btnGoogleReview");
  if (btnGoogleReview) {
    const reviewTarget = (CONFIG.googleReviewUrl || "").trim();
    if (reviewTarget) {
      btnGoogleReview.href = reviewTarget;
      btnGoogleReview.target = "_blank";
      btnGoogleReview.rel = "noopener noreferrer";
      btnGoogleReview.removeAttribute("aria-disabled");
    } else {
      // URL not configured — disable button gracefully
      btnGoogleReview.href = "#reviews";
      btnGoogleReview.setAttribute("aria-disabled", "true");
    }
  }

  syncMetadata();
}

/**
 * Graceful fallback for campus facility images
 */
function initImageFallbacks() {
  const figures = document.querySelectorAll(".shots figure");
  figures.forEach((figure) => {
    const img = figure.querySelector("img");
    if (!img) return;

    const markEmpty = () => {
      figure.classList.add("is-empty");
    };

    img.addEventListener("error", markEmpty);
    if (img.complete && img.naturalHeight === 0) {
      markEmpty();
    }
  });
}

/**
 * Bottom Navigation active state synchronizer using IntersectionObserver
 */
function initNavigationObserver() {
  const navLinks = Array.from(document.querySelectorAll(".dock a"));
  const sectionIds = ["home", "programs", "reviews", "admission", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!("IntersectionObserver" in window)) {
    // Fallback scroll listener
    window.addEventListener(
      "scroll",
      () => {
        const marker = window.scrollY + window.innerHeight * 0.4;
        let activeId = "home";
        for (const sec of [...sections].reverse()) {
          if (sec.offsetTop <= marker) {
            activeId = sec.id;
            break;
          }
        }
        navLinks.forEach((link) => {
          link.classList.toggle("on", link.dataset.nav === activeId);
        });
      },
      { passive: true }
    );
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -50% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("on", link.dataset.nav === activeId);
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => observer.observe(sec));
}

/**
 * Slide-up Admission Enquiry Sheet Modal
 */
function initEnquiryModal() {
  const sheet = document.getElementById("sheet");
  const closeBtn = document.getElementById("sheetClose");
  if (!sheet || !closeBtn) return;

  const openSheet = () => {
    sheet.hidden = false;
    document.body.style.overflow = "hidden";
    const firstInput = sheet.querySelector("input");
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeSheet = () => {
    sheet.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".js-enquire").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openSheet();
    });
  });

  closeBtn.addEventListener("click", closeSheet);

  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) {
      closeSheet();
    }
  });
}

/**
 * Form submission and WhatsApp dispatch
 */
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const studentName = String(formData.get("studentName") || "").trim();
    const parentName = String(formData.get("parentName") || "").trim();
    const studentClass = String(formData.get("studentClass") || "").trim();
    const program = String(formData.get("program") || "").trim();
    const mobile = String(formData.get("mobile") || "").trim();

    if (!studentName || !parentName || !studentClass || !program || !mobile) {
      status.textContent = "Please fill in all details before submitting.";
      status.style.color = "var(--red)";
      return;
    }

    if (digitsOnly(mobile).length < 10) {
      status.textContent = "Please enter a valid 10-digit mobile number.";
      status.style.color = "var(--red)";
      return;
    }

    const messageLines = [
      "🎯 *GOAL Dhanbad — Admission Enquiry*",
      "",
      "• *Student Name:* " + studentName,
      "• *Parent Name:* " + parentName,
      "• *Class:* " + studentClass,
      "• *Programme:* " + program,
      "• *Contact Mobile:* " + mobile,
      "",
      "Kindly share details regarding batch schedules and admissions."
    ];

    const message = messageLines.join("\n");
    const targetNumber = isEngineeringProgram(program) ? CONFIG.whatsappEngineering : CONFIG.whatsappMedical;
    const whatsappUrl = buildWhatsAppUrl(targetNumber, message);

    if (!whatsappUrl) {
      status.textContent = "Counselor number is currently unavailable.";
      return;
    }

    status.style.color = "var(--navy)";
    status.textContent = "Connecting to Dhanbad Admissions on WhatsApp…";

    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      status.textContent = "WhatsApp opened! Our counselor will respond shortly.";
    }, 400);
  });
}

// ── SHARE DIGITAL CARD ENGINE ─────────────────────────────────
const PRODUCTION_LIVE_URL = "https://algorivexlabs-droid.github.io/goal-digital-card/";

function getDigitalCardUrl() {
  if (typeof DIGITAL_CARD_URL === "string" && DIGITAL_CARD_URL.trim()) {
    return DIGITAL_CARD_URL.trim();
  }
  if (typeof window !== "undefined" && window.location) {
    const loc = window.location;
    // Check if running on a live web host (not localhost, local IP, or file protocol)
    if (
      loc.protocol &&
      loc.protocol.startsWith("http") &&
      loc.hostname &&
      loc.hostname !== "localhost" &&
      loc.hostname !== "127.0.0.1" &&
      loc.hostname !== "0.0.0.0"
    ) {
      return loc.origin + loc.pathname;
    }
  }
  // Production fallback — NEVER returns localhost or repo URL
  return PRODUCTION_LIVE_URL;
}

function getShareMessage() {
  const url = getDigitalCardUrl();
  return [
    "🎓 GOAL IIT–JEE & Medical Coaching Centre, Dhanbad",
    "",
    "📖 Explore our Digital Card & Prospectus",
    "⭐ Read / Share your genuine Google Review",
    "🎓 Admission Enquiry",
    "",
    "🔗 View Digital Card: " + url
  ].join("\n");
}

/**
 * Validate and format recipient WhatsApp phone number.
 * - Accept Indian 10-digit mobile numbers (automatically prepending 91).
 * - Strip spaces, hyphens, and leading 0, 91, or +91.
 * - Also allow international numbers formatted with '+' or valid international digits.
 * - Returns formatted digits or null if invalid.
 */
function formatRecipientWhatsAppNumber(rawInput) {
  const str = String(rawInput || "").trim();
  if (!str) return null;

  // International format with explicit leading '+'
  if (str.startsWith("+")) {
    const clean = digitsOnly(str);
    if (!clean) return null;
    // If Indian number entered as +91...
    if (clean.startsWith("91")) {
      const national = clean.slice(2);
      if (/^[6-9]\d{9}$/.test(national) || /^\d{10}$/.test(national)) {
        return "91" + national;
      }
      return null;
    }
    // Generic international format (E.164: 7 to 15 digits)
    if (clean.length >= 7 && clean.length <= 15) {
      return clean;
    }
    return null;
  }

  // Extract all digits
  let digits = digitsOnly(str);
  if (!digits) return null;

  // If Indian number with leading 0 (e.g. 09876543210 -> 11 digits)
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // If Indian number with leading 91 (e.g. 919876543210 -> 12 digits)
  else if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  // Standard Indian 10-digit mobile number
  if (digits.length === 10) {
    if (/^[6-9]\d{9}$/.test(digits) || /^\d{10}$/.test(digits)) {
      return "91" + digits;
    }
    return null;
  }

  // Generic international digits directly without '+' (11-15 digits not starting with 91)
  if (digits.length >= 11 && digits.length <= 15) {
    return digits;
  }

  return null;
}

/**
 * Dynamically construct WhatsApp sharing URL for a given recipient.
 * Format: https://wa.me/<phonenumber>?text=<encoded-message>
 * NEVER uses GOAL's own phone number.
 */
function buildWhatsAppShareUrl(recipientNumber) {
  const cleanRecipient = digitsOnly(recipientNumber);
  if (!cleanRecipient) return "";
  const msg = getShareMessage();
  return "https://wa.me/" + cleanRecipient + "?text=" + encodeURIComponent(msg);
}

function initShareFeature() {
  const shareSheet = document.getElementById("shareSheet");
  const shareClose = document.getElementById("shareClose");
  const shareCancelBtn = document.getElementById("shareCancelBtn");
  const shareForm = document.getElementById("shareForm");
  const sharePhoneInput = document.getElementById("sharePhoneInput");
  const shareStatus = document.getElementById("shareStatus");
  const btnCopyCardLink = document.getElementById("btnCopyCardLink");
  const btnWebShare = document.getElementById("btnWebShare");
  const copyNotification = document.getElementById("copyNotification");

  if (btnWebShare && navigator.share) {
    btnWebShare.style.display = "inline-flex";
    btnWebShare.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: "GOAL IIT–JEE & Medical Coaching Centre, Dhanbad",
          text: getShareMessage(),
          url: getDigitalCardUrl()
        });
      } catch (_) {}
    });
  }

  const openShareModal = () => {
    if (sharePhoneInput) sharePhoneInput.value = "";
    if (shareStatus) shareStatus.textContent = "";
    if (copyNotification) copyNotification.textContent = "";
    if (shareSheet) {
      shareSheet.hidden = false;
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (sharePhoneInput) sharePhoneInput.focus();
      }, 80);
    }
  };

  const closeShareModal = () => {
    if (shareSheet) {
      shareSheet.hidden = true;
      document.body.style.overflow = "";
    }
    if (shareStatus) shareStatus.textContent = "";
  };

  if (shareClose) shareClose.addEventListener("click", closeShareModal);
  if (shareCancelBtn) shareCancelBtn.addEventListener("click", closeShareModal);
  if (shareSheet) {
    shareSheet.addEventListener("click", (e) => {
      if (e.target === shareSheet) closeShareModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shareSheet && !shareSheet.hidden) {
      closeShareModal();
    }
  });

  if (sharePhoneInput) {
    sharePhoneInput.addEventListener("input", () => {
      if (shareStatus && shareStatus.textContent) {
        shareStatus.textContent = "";
      }
    });
  }

  if (shareForm) {
    shareForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawInput = sharePhoneInput ? sharePhoneInput.value : "";
      const validNumber = formatRecipientWhatsAppNumber(rawInput);

      if (!validNumber) {
        if (shareStatus) {
          shareStatus.textContent = "Please enter a valid WhatsApp number.";
          shareStatus.style.color = "var(--red)";
        }
        if (sharePhoneInput) sharePhoneInput.focus();
        return;
      }

      const shareUrl = buildWhatsAppShareUrl(validNumber);
      if (!shareUrl) {
        if (shareStatus) {
          shareStatus.textContent = "Please enter a valid WhatsApp number.";
          shareStatus.style.color = "var(--red)";
        }
        return;
      }

      if (shareStatus) shareStatus.textContent = "";
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      closeShareModal();
    });
  }

  if (btnCopyCardLink) {
    btnCopyCardLink.addEventListener("click", async () => {
      const url = getDigitalCardUrl();
      let copied = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch (_) {}
      }
      if (!copied) {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          copied = document.execCommand("copy");
        } catch (_) {}
        document.body.removeChild(ta);
      }

      if (copyNotification) {
        copyNotification.textContent = "Link copied successfully";
        copyNotification.style.color = "var(--green-deep)";
        setTimeout(() => {
          if (copyNotification.textContent === "Link copied successfully") {
            copyNotification.textContent = "";
          }
        }, 3500);
      }
    });
  }

  // Clicking "SHARE DIGITAL CARD" opens the recipient dialog on both mobile and desktop
  document.querySelectorAll(".js-share").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openShareModal();
    });
  });
}

// Initialize all features on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  applyConfiguration();
  initImageFallbacks();
  initNavigationObserver();
  initEnquiryModal();
  initEnquiryForm();
  initShareFeature();
});

// Run immediate config application
applyConfiguration();
