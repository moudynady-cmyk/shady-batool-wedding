const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export type GuestExportResult = {
  blob: Blob;
  filename: string;
  recordCount: number;
  guestCount: number;
};

function filenameFromDisposition(value: string | null) {
  if (!value) return null;

  const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

  const regularMatch = value.match(/filename="?([^";]+)"?/i);
  return regularMatch?.[1] ?? null;
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string; message?: string };
    return payload.error || payload.message || "Unable to export the guest list.";
  } catch {
    return "Unable to export the guest list.";
  }
}

export async function exportAttendingGuests(
  password: string,
): Promise<GuestExportResult> {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/functions/v1/export-rsvp-csv`,
    {
      method: "POST",
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    },
  );

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const blob = await response.blob();
  const fallbackDate = new Date().toISOString().slice(0, 10);
  const filename =
    filenameFromDisposition(response.headers.get("Content-Disposition")) ||
    `shady-batool-attending-guests-${fallbackDate}.csv`;

  return {
    blob,
    filename,
    recordCount: Number(response.headers.get("X-Record-Count") || 0),
    guestCount: Number(response.headers.get("X-Guest-Count") || 0),
  };
}
