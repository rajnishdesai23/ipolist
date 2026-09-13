/**
 * Direct registrar official allotment URLs
 */
export function getRegistrarPortalUrl(registrarName?: string, registrarWebsite?: string): string {
  if (registrarWebsite && registrarWebsite.startsWith("http") && !registrarWebsite.includes("linkintime.co.in/")) {
    return registrarWebsite;
  }

  const name = (registrarName || "").toLowerCase();

  if (name.includes("kfin") || name.includes("karvy")) {
    return "https://ipostatus.kfintech.com/";
  }
  if (name.includes("link intime") || name.includes("mufg") || name.includes("linkintime")) {
    return "https://in.mpms.mufg.com/Initial_Offer/public-issues.html";
  }
  if (name.includes("bigshare")) {
    return "https://www.bigshareonline.com/ipo_Allotment.html";
  }
  if (name.includes("skyline")) {
    return "https://www.skylinerta.com/ipo.php";
  }
  if (name.includes("beetal")) {
    return "https://beetalfinancial.com/";
  }
  if (name.includes("cameo")) {
    return "https://ipo.cameoindia.com/";
  }
  if (name.includes("bse")) {
    return "https://www.bseindia.com/investors/appli_check.aspx";
  }

  // Standard official BSE Allotment Server fallback
  return "https://www.bseindia.com/investors/appli_check.aspx";
}

export const BROKER_APPLY_LINKS = {
  zerodha: "https://zerodha.com/open-account",
  angelone: "https://www.angelone.in/open-demat-account",
  groww: "https://groww.in/ipo",
};
