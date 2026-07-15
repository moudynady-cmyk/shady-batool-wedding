import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers":
    "Content-Disposition, X-Record-Count, X-Guest-Count",
};

type ExportRequest = {
  password?: string;
};

type RSVPRow = {
  full_name: string | null;
  phone: string | null;
  guests: number | null;
  attendance: string | null;
  message: string | null;
};

function jsonResponse(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getSecretKey() {
  const currentSecrets = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (currentSecrets) {
    try {
      const parsed = JSON.parse(currentSecrets) as Record<string, string>;
      const firstKey = parsed.default || Object.values(parsed)[0];
      if (firstKey) return firstKey;
    } catch {
      // Fall back to the legacy service-role environment variable below.
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

async function safeEqual(left: string, right: string) {
  const [leftHash, rightHash] = await Promise.all([digest(left), digest(right)]);
  if (leftHash.length !== rightHash.length) return false;

  let difference = 0;
  for (let index = 0; index < leftHash.length; index += 1) {
    difference |= leftHash[index] ^ rightHash[index];
  }

  return difference === 0;
}

function csvCell(value: unknown) {
  let text = String(value ?? "")
    .replace(/\r\n|\r|\n/g, " ")
    .trim();

  // Prevent spreadsheet formula injection and preserve leading + signs in phones.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

function createCsv(rows: RSVPRow[]) {
  const header = [
    "Full Name",
    "Phone Number",
    "Number of Guests",
    "Attendance",
    "Message",
  ];

  const body = rows.map((row) =>
    [
      row.full_name,
      row.phone,
      row.guests ?? 0,
      row.attendance,
      row.message,
    ]
      .map(csvCell)
      .join(","),
  );

  // UTF-8 BOM keeps Arabic names/messages readable when opened in Excel.
  return `\uFEFF${[header.map(csvCell).join(","), ...body].join("\r\n")}`;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const configuredPassword = Deno.env.get("RSVP_EXPORT_PASSWORD");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = getSecretKey();

  if (!configuredPassword || !supabaseUrl || !secretKey) {
    console.error("Guest export function is missing required environment variables.");
    return jsonResponse({ error: "Guest export is not configured yet." }, 500);
  }

  let payload: ExportRequest;
  try {
    payload = (await request.json()) as ExportRequest;
  } catch {
    return jsonResponse({ error: "Invalid request body." }, 400);
  }

  const suppliedPassword = payload.password?.trim() ?? "";
  const authorized =
    suppliedPassword.length > 0 &&
    (await safeEqual(suppliedPassword, configuredPassword));

  if (!authorized) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return jsonResponse({ error: "The export password is incorrect." }, 401);
  }

  const supabaseAdmin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabaseAdmin
    .from("rsvp")
    .select("full_name, phone, guests, attendance, message")
    .eq("attendance", "Attending")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Unable to query attending RSVP rows:", error);
    return jsonResponse({ error: "Unable to read the RSVP table." }, 500);
  }

  const rows = (data ?? []) as RSVPRow[];
  const recordCount = rows.length;
  const guestCount = rows.reduce(
    (total, row) => total + Math.max(0, Number(row.guests) || 0),
    0,
  );
  const date = new Date().toISOString().slice(0, 10);
  const filename = `shady-batool-attending-guests-${date}.csv`;

  return new Response(createCsv(rows), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, private, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Record-Count": String(recordCount),
      "X-Guest-Count": String(guestCount),
    },
  });
});
