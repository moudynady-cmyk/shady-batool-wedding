# Secure RSVP CSV Export Setup

This feature exports only rows where `attendance = Attending` from the existing
Supabase `rsvp` table.

## 1. Set a private export password

Choose a strong password that is not used anywhere else.

Using the Supabase CLI:

```bash
supabase secrets set RSVP_EXPORT_PASSWORD="YOUR-STRONG-PRIVATE-PASSWORD"
```

You may also add `RSVP_EXPORT_PASSWORD` from the Supabase Dashboard under your
project's Edge Function secrets.

Never place this password, a Supabase secret key, or a service-role key inside
`src`, `.env` variables prefixed with `VITE_`, or any browser code.

## 2. Deploy the Edge Function

```bash
supabase functions deploy export-rsvp-csv --no-verify-jwt
```

The included `supabase/config.toml` also sets `verify_jwt = false`. The function
still protects the export by checking `RSVP_EXPORT_PASSWORD` server-side before
reading any guest data.

## 3. Keep public SELECT access disabled

The public website only needs INSERT access for RSVP submissions. Do not create
an `anon` SELECT policy for the `rsvp` table. The export function uses a
server-side Supabase secret key and does not expose it to visitors.

## 4. Open the private export control

Open your deployed wedding website using:

```text
https://YOUR-DOMAIN.com/?manage=guests
```

A small `Guest List` button appears only when this query parameter is present.
Press it, enter the private export password, and download the CSV.

Normal visitors opening the website without `?manage=guests` will not see the
button or any admin interface.

## Exported columns

- Full Name
- Phone Number
- Number of Guests
- Attendance
- Message

The downloaded CSV includes a UTF-8 BOM so Arabic guest names and messages open
correctly in Microsoft Excel. Phone numbers and other cells are sanitized to
reduce spreadsheet formula-injection risks.
