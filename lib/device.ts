const DEVICE_KEY = "qb_web_device_id";

export function getDeviceId() {
  if (typeof window === "undefined") return "web";
  const existing = window.localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const id = window.crypto.randomUUID();
  window.localStorage.setItem(DEVICE_KEY, id);
  return id;
}

export function getDeviceName() {
  if (typeof navigator === "undefined") return "Web browser";
  const agent = navigator.userAgent;
  if (/Edg\//.test(agent)) return "Web · Edge";
  if (/Chrome\//.test(agent)) return "Web · Chrome";
  if (/Firefox\//.test(agent)) return "Web · Firefox";
  if (/Safari\//.test(agent)) return "Web · Safari";
  return "Web browser";
}

export function getDevicePayload() {
  return { deviceId: getDeviceId(), deviceName: getDeviceName() };
}
