export const BRAND_NAME = "Abhoyy";
export const BRAND_NAME_BN = "অভয়";

export const FREE_FIRST_MOCK = true;

// Re-export pricing & billing specifications
export * from './pricing';

// Backward-compatible price summary for components referencing legacy PRICES
export const PRICES = {
  free: 0,
  single10: 79,
  single15: 109,
  single20: 139,
  single: 109, // default 15 min recommended
  starter: 219,
  practice: 399,
  careerBuilder: 599,
  pack: 599, // default top package
};

export const BKASH_MERCHANT_NUMBER = "01800-ABHOYY"; // placeholder formatted merchant number
export const REQUIRE_CAMERA = true;
export const MAX_CV_SIZE_MB = 5;
export const SESSION_EXPIRY_DAYS = 7;
export const LEGAL_DRAFT_BANNER = true;
export const MOCK_FAILURES = false; // toggle to test error states

export const CONTACT_INFO = {
  phone: "+880 1816729550",
  phoneRaw: "+8801816729550",
  whatsapp: "+880 1816729550",
  whatsappUrl: "https://wa.me/8801816729550",
  email: "shishirsami33@gmail.com",
  linkedin: "https://www.linkedin.com/in/shishirsami",
  twitter: "https://x.com/SamiShishi39925",
  facebook: "https://www.facebook.com/shahriarshishirsami",
  instagram: "https://www.instagram.com/_shi_shir_33",
  founderPortfolio: "https://www.shishirsami.com/",
  founderName: "Shahriar Shishir Sami",
  parentCompany: "ShishirSami Labs",
  parentCompanyUrl: "https://www.shishirsami.com/shishirsamilabs",
  institution: "American International University-Bangladesh",
};

export const NAV_LINKS = [
  { href: "/how-it-works", labelKey: "nav.howItWorks" },
  { href: "/#interview-types", labelKey: "nav.types" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/#faq", labelKey: "nav.faq" },
];

