export const CONSENT_COOKIE = "consent";

// "yes", "no", or nothing: the choice
export function readConsent(cookies) {
  return cookies.match(/(?:^|; )consent=(yes|no)/)?.[1];
}

// The cookie that remembers a choice, for a year
export const consentCookie = (value) =>
  `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;

// A browser that says no is always obeyed
export function privacySignal({ doNotTrack, globalPrivacyControl }) {
  return doNotTrack === "1" || globalPrivacyControl === true;
}
