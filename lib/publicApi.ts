export type DeletionInfo = {
  appName: string;
  supportEmail: string;
  processingDays: number;
  deletedData: string[];
  retainedData: string[];
};

export const DEFAULT_DELETION_INFO: DeletionInfo = {
  appName: "Question Bank",
  supportEmail: "oreoluwa.creatives@gmail.com",
  processingDays: 30,
  deletedData: [
    "Account profile (name, email, phone, avatar, study preferences)",
    "Uploaded study materials and extracted document text",
    "Generated and saved practice questions",
    "Test attempts, scores, and analytics",
    "Subscription and device session records",
  ],
  retainedData: [
    "Payment records required for tax, fraud prevention, or legal compliance may be kept for up to 7 years where applicable.",
    "Anonymized aggregate statistics that cannot identify you.",
  ],
};

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";
}

function isReachableApiUrl(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return !["localhost", "127.0.0.1", "0.0.0.0"].includes(host);
  } catch {
    return false;
  }
}

export async function submitDeletionRequest(payload: {
  email: string;
  reason?: string;
}) {
  const apiUrl = getApiUrl();

  if (!isReachableApiUrl(apiUrl)) {
    throw new Error(
      "Deletion requests are temporarily unavailable. Email oreoluwa.creatives@gmail.com from your account address to request deletion."
    );
  }

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/account-deletion/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Could not reach the server. Email oreoluwa.creatives@gmail.com from your account address to request deletion."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Could not submit deletion request");
  }

  return data as {
    message: string;
    requestId: string;
    alreadyPending?: boolean;
  };
}
