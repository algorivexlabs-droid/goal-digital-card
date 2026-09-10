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
  addressMedical: "Memko More, Opp. Prabhatam Grand Mall, Dhaiya, Dhanbad",

  // Engineering Division (GOAL Empire)
  phoneEngineering: "7488112425",
  whatsappEngineering: "7488112425",
  phoneEngineeringAlt: "9234300143",
  addressEngineering: "P.J. Memko More, Dhaiya, Dhanbad",

  // Online Review & Map URLs (Configurable)
  googleReviewUrl: "", // Paste Google Business review shortlink here
  googleMapsUrl: "https://maps.google.com/?q=GOAL+Coaching+Centre+Dhanbad", // Directions URL
  prospectusUrl: "#programs", // Local anchor or external PDF link
  email: "dhanbad@goaleducation.com",
  siteUrl: "" // Deployment origin for canonical/og:image metadata
};

// Global Configurable Review URL
const GOOGLE_REVIEW_URL = CONFIG.googleReviewUrl;

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
  const prospectus = (CONFIG.prospectusUrl || "").trim() || "#programs";

  setLink("btnProspectus", prospectus, true);
  setLink("btnMaps", mapsUrl, isSet(mapsUrl));
  setLink("callMedical", medicalTel, isSet(medicalTel));
  setLink("callEngineering", engineeringTel, isSet(engineeringTel));
  setLink("waMedical", medicalWa, isSet(medicalWa));
  setLink("waEngineering", engineeringWa, isSet(engineeringWa));
  setLink("btnWhatsapp", primaryWa, isSet(primaryWa));
  setLink("btnCall", primaryTel, isSet(primaryTel));
  setLink("waFloat", primaryWa, isSet(primaryWa));
  setLink("btnWaFinal", primaryWa, isSet(primaryWa));

  // Google Review Button Handler
  const btnGoogleReview = document.getElementById("btnGoogleReview");
  if (btnGoogleReview) {
    if (isSet(reviewUrl)) {
      btnGoogleReview.href = reviewUrl;
      btnGoogleReview.removeAttribute("aria-disabled");
    } else {
      // Graceful fallback to Dhanbad center WhatsApp when Google Review link is pending
      const reviewFeedbackWa = buildWhatsAppUrl(
        CONFIG.whatsappMedical || CONFIG.whatsappEngineering,
        "Hello GOAL Dhanbad, I would like to share my review and feedback regarding our experience."
      );
      btnGoogleReview.href = reviewFeedbackWa || primaryWa;
      btnGoogleReview.setAttribute("title", "Connect on WhatsApp to share your experience");
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

// Initialize all features on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  applyConfiguration();
  initImageFallbacks();
  initNavigationObserver();
  initEnquiryModal();
  initEnquiryForm();
});

// Run immediate config application
applyConfiguration();
