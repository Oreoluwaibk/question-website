import { ANDROID_PACKAGE, APP_SCHEME, SITE } from "@/lib/site";

function userAgent(value?: string) {
  if (value != null) return value;
  return typeof navigator === "undefined" ? "" : navigator.userAgent;
}

export function isAndroidDevice(userAgentValue?: string) {
  return /Android/i.test(userAgent(userAgentValue));
}

export function isIosPhone(userAgentValue?: string) {
  return /iPhone|iPod/i.test(userAgent(userAgentValue));
}

/** Android phones include "Mobile"; tablets usually do not. */
export function isPhoneDevice(userAgentValue?: string) {
  const agent = userAgent(userAgentValue);
  if (/iPhone|iPod/i.test(agent)) return true;
  return /Android/i.test(agent) && /Mobile/i.test(agent);
}

/** Where "Open app" should go on a phone. Empty when this phone has no app to open. */
export function phoneOpenAppHref(currentUrl: string, userAgentValue?: string) {
  if (!isPhoneDevice(userAgentValue)) return "";
  if (isAndroidDevice(userAgentValue)) return androidAppIntentUrl(currentUrl);
  if (isIosPhone(userAgentValue) && SITE.appStoreUrl) return SITE.appStoreUrl;
  return "";
}

/**
 * Chrome on Android opens the installed app when this intent URL is followed.
 * If the app is not installed, Chrome loads the fallback page instead.
 */
export function androidAppIntentUrl(fallbackUrl: string) {
  const fallback = encodeURIComponent(fallbackUrl);
  return `intent:///#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}

export function playStoreUrl() {
  return SITE.playStoreUrl;
}
