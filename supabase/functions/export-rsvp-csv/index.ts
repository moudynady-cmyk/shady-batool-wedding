import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-export-password",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers":
    "Content-Disposition, X-Record-Count, X-Guest-Count",
  "Access-Control-Max-Age": "86400",
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

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getAdminKey(): string | null {
  const currentSecrets = Deno.env.get("SUPABASE_SECRET_KEYS");

  if (currentSecrets) {
    try {
      const parsed = JSON.parse(currentSecrets) as Record<string, unknown>;
      const defaultKey = parsed.default;

      if (typeof defaultKey === "string" && defaultKey.trim()) {
        return defaultKey;
      }

      for (const value of Object.values(parsed)) {
        if (typeof value === "string" && value.trim()) {
          return value;
        }
      }
    } catch (error) {
      console.warn(
        "Unable to parse SUPABASE_SECRET_KEYS. Falling back to the legacy service-role key.",
        error,
      );
    }
  }

  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? null;
}

async function digest(value: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(hash);
}

async function safeEqual(left: string, right: string): Promise<boolean> {
  const [leftHash, rightHash] = await Promise.all([
    digest(left),
    digest(right),
  ]);

  if (leftHash.length !== rightHash.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < leftHash.length; index += 1) {
    difference |= leftHash[index] ^ rightHash[index];
  }

  return difference === 0;
}

function csvCell(value: unknown): string {
  let text = String(value ?? "")
    .replace(/\r\n|\r|\n/g, " ")
    .trim();

  if (/^[=+\-@]/.test(text)) {
    text = "'" + text;
  }

  return '"' + text.replace(/"/g, '""') + '"';
}

function createCsv(rows: RSVPRow[]): string {
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
      .join(",")
  );

  const lines = [header.map(csvCell).join(","), ...body];

  return "\uFEFF" + lines.join("\r\n");
}

Deno.serve(async (request: Request): Promise<Response> => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const configuredPassword = Deno.env.get("RSVP_EXPORT_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const adminKey = getAdminKey();

    if (!configuredPassword || !supabaseUrl || !adminKey) {
      console.error(
        "Guest export is missing RSVP_EXPORT_PASSWORD, SUPABASE_URL, or an admin key.",
      );

      return jsonResponse(
        { error: "Guest export is not configured yet." },
        500,
      );
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
      return jsonResponse(
        { error: "The export password is incorrect." },
        401,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, adminKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await supabaseAdmin
      .from("rsvp")
      .select("full_name, phone, guests, attendance, message")
      .eq("attendance", "Attending")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Unable to query attending RSVP rows:", error);
      return jsonResponse(
        { error: "Unable to read the RSVP table." },
        500,
      );
    }

    const rows = (data ?? []) as RSVPRow[];
    const recordCount = rows.length;
    const guestCount = rows.reduce((total, row) => {
      return total + Math.max(0, Number(row.guests) || 0);
    }, 0);

    const date = new Date().toISOString().slice(0, 10);
    const filename = "shady-batool-attending-guests-" + date + ".csv";

    console.log(
      "Exporting " +
        recordCount +
        " attending responses representing " +
        guestCount +
        " guests.",
    );

    return new Response(createCsv(rows), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="' + filename + '"',
        "Cache-Control": "no-store, private, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Record-Count": String(recordCount),
        "X-Guest-Count": String(guestCount),
      },
    });
  } catch (error) {
    console.error("Unexpected guest export error:", error);
    return jsonResponse(
      { error: "An unexpected error occurred while exporting guests." },
      500,
    );
  }
});
