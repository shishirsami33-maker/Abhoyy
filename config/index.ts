export const BRAND_NAME = "Abhoyy";
export const BRAND_NAME_BN = "অভয়";

export const FREE_FIRST_MOCK = true;

// Prices in BDT. Placeholder null shows as "৳ XX" until decided
export const PRICES: { free: number; single: number | null; pack: number | null } = {
  free: 0,
  single: null,
  pack: null,
};

export const BKASH_MERCHANT_NUMBER = "01800-ABHOYY"; // placeholder formatted merchant number
export const REQUIRE_CAMERA = true;
export const MAX_CV_SIZE_MB = 5;
export const SESSION_EXPIRY_DAYS = 7;
export const LEGAL_DRAFT_BANNER = true;
export const MOCK_FAILURES = false; // toggle to test error states

export const NAV_LINKS = [
  { href: "/how-it-works", labelKey: "nav.howItWorks" },
  { href: "/#interview-types", labelKey: "nav.types" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/#faq", labelKey: "nav.faq" },
];
