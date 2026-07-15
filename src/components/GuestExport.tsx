import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { exportAttendingGuests } from "../services/exportGuests";
import "../styles/guest-export.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17.5v2h14v-2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

export default function GuestExport() {
  const shouldReduceMotion = useReducedMotion();
  const passwordId = useId();
  const enabled = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("manage") === "guests";
  }, []);

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, open]);

  if (!enabled) return null;

  const handleExport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      setError("Enter the export password first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await exportAttendingGuests(password);
      triggerDownload(result.blob, result.filename);
      setSuccess(
        `Downloaded ${result.recordCount} responses covering ${result.guestCount} guests.`,
      );
      setPassword("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export the guest list. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        className="guest-export__launcher"
        onClick={() => {
          setOpen(true);
          setError("");
          setSuccess("");
        }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        aria-label="Open attending guest export"
      >
        <span><DownloadIcon /></span>
        Guest List
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="guest-export__backdrop"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !loading) setOpen(false);
            }}
          >
            <motion.section
              className="guest-export__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guest-export-title"
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, y: 22, scale: 0.97 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              <button
                type="button"
                className="guest-export__close"
                onClick={() => setOpen(false)}
                disabled={loading}
                aria-label="Close guest export"
              >
                <CloseIcon />
              </button>

              <div className="guest-export__seal" aria-hidden="true">
                <DownloadIcon />
              </div>

              <p className="guest-export__eyebrow">Private guest management</p>
              <h2 id="guest-export-title">Attending Guests</h2>
              <p className="guest-export__copy">
                Download the confirmed attending responses from Supabase as a
                CSV file ready for Excel or Google Sheets.
              </p>

              <form onSubmit={handleExport}>
                <label htmlFor={passwordId}>Export password</label>
                <div className="guest-export__field">
                  <span aria-hidden="true"><LockIcon /></span>
                  <input
                    id={passwordId}
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    autoComplete="current-password"
                    autoFocus
                    placeholder="Enter your private password"
                    disabled={loading}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.p
                      key="error"
                      className="guest-export__message guest-export__message--error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.p
                      key="success"
                      className="guest-export__message guest-export__message--success"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {success}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="guest-export__submit"
                  disabled={loading}
                >
                  <span aria-hidden="true"><DownloadIcon /></span>
                  {loading ? "Preparing CSV..." : "Download CSV"}
                </button>
              </form>

              <small>
                Only rows with attendance set to <strong>Attending</strong> are
                included.
              </small>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
