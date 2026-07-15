import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { submitRSVP } from "../services/rsvp";
import "../styles/rsvp.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type Attendance = "Attending" | "Not Attending";

type FormState = {
  full_name: string;
  phone: string;
  guests: number;
  attendance: Attendance;
  message: string;
};

const INITIAL_FORM: FormState = {
  full_name: "",
  phone: "",
  guests: 1,
  attendance: "Attending",
  message: "",
};

function RSVPMonogram() {
  return (
    <svg className="rsvp-monogram" viewBox="0 0 150 132" aria-hidden="true">
      <path className="rsvp-monogram__oval" d="M75 7c28 0 46 21 46 52 0 34-19 58-46 58S29 93 29 59C29 28 47 7 75 7Z" />
      <path className="rsvp-monogram__sprig rsvp-monogram__sprig--left" d="M54 99c-12 5-22 15-27 28m14-17-12-1m18-7-9-7m4 18-7 9" />
      <path className="rsvp-monogram__sprig rsvp-monogram__sprig--right" d="M96 99c12 5 22 15 27 28m-14-17 12-1m-18-7 9-7m-4 18 7 9" />
      <text x="47" y="73">S</text>
      <text x="73" y="90">B</text>
      <path className="rsvp-monogram__heart" d="M75 119s-7-4.3-7-9.1c0-2.6 1.9-4.4 4.2-4.4 1.3 0 2.1.7 2.8 1.7.7-1 1.5-1.7 2.8-1.7 2.3 0 4.2 1.8 4.2 4.4 0 4.8-7 9.1-7 9.1Z" />
    </svg>
  );
}

function Flourish() {
  return (
    <span className="rsvp-flourish" aria-hidden="true">
      <i />
      <b>♥</b>
      <i />
    </span>
  );
}

function FieldIcon({ type }: { type: "name" | "phone" | "guests" | "message" }) {
  const paths: Record<typeof type, ReactNode> = {
    name: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20c.6-4 3-6.2 6.5-6.2s5.9 2.2 6.5 6.2" />
      </>
    ),
    phone: (
      <path d="M7.2 3.8 9.8 8l-2 2c1.2 2.7 3.3 4.8 6 6l2-2 4.2 2.6c-.4 2.5-2 3.7-4.2 3.4C9.8 19.1 4.9 14.2 4 8.2c-.3-2.2.9-3.9 3.2-4.4Z" />
    ),
    guests: (
      <>
        <circle cx="9" cy="8.5" r="2.6" />
        <circle cx="16.5" cy="10" r="2.1" />
        <path d="M3.8 19c.5-3.8 2.4-5.7 5.3-5.7s4.8 1.9 5.3 5.7M14.2 14.2c3.2-.5 5.2 1.1 5.8 4.8" />
      </>
    ),
    message: (
      <>
        <path d="M4 5.8h16v11H9l-5 3v-14Z" />
        <path d="M7.5 9.5h9M7.5 13h6" />
      </>
    ),
  };

  return (
    <span className="rsvp-field__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">{paths[type]}</svg>
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5v3M17 3.5v3M4.5 9h15M6.5 5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 13h3M8 16.5h7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.3 4.2L19 7" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12h15M14 7l5 5-5 5" />
    </svg>
  );
}

export default function RSVP() {
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name: keyof FormState, value: string | number) => {
    setSuccess(false);
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateAttendance = (attendance: Attendance) => {
    setSuccess(false);
    setError("");
    setForm((current) => ({
      ...current,
      attendance,
      guests: attendance === "Not Attending" ? 1 : current.guests,
    }));
  };

  const changeGuests = (amount: number) => {
    if (form.attendance === "Not Attending") return;

    updateField("guests", Math.min(10, Math.max(1, form.guests + amount)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = form.full_name.trim();
    const phone = form.phone.trim();

    if (!fullName || !phone) {
      setError("Please complete your name and phone number before confirming.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await submitRSVP({
        ...form,
        full_name: fullName,
        phone,
        message: form.message.trim(),
      });

      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      const responseError = err as { message?: string; code?: string };

      if (
        responseError.message?.toLowerCase().includes("duplicate") ||
        responseError.code === "23505"
      ) {
        setError("This phone number has already confirmed attendance.");
      } else {
        setError("Something went wrong while saving your reply. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reveal = (delay = 0, distance = 24) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.85, delay, ease: EASE },
  });

  return (
    <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp-ambient" aria-hidden="true">
        <span className="rsvp-ambient__glow rsvp-ambient__glow--one" />
        <span className="rsvp-ambient__glow rsvp-ambient__glow--two" />
        <span className="rsvp-ambient__grain" />
        <i className="rsvp-petal rsvp-petal--one" />
        <i className="rsvp-petal rsvp-petal--two" />
        <i className="rsvp-petal rsvp-petal--three" />
        <i className="rsvp-petal rsvp-petal--four" />
      </div>

      <motion.header className="rsvp-heading" {...reveal(0, 22)}>
        <p className="rsvp-heading__eyebrow">
          <span /> Chapter Four <span />
        </p>
        <h2 id="rsvp-title" className="rsvp-heading__title">
          Kindly <em>Reply</em>
        </h2>
        <p className="rsvp-heading__intro">
          Your presence would make our celebration complete. Let us know if we
          will have the joy of celebrating with you.
        </p>
      </motion.header>

      <motion.div className="rsvp-card" {...reveal(0.1, 34)}>
        <aside className="rsvp-invitation" aria-label="Wedding invitation details">
          <div className="rsvp-invitation__halo" aria-hidden="true" />
          <div className="rsvp-invitation__monogram-wrap">
            <RSVPMonogram />
          </div>

          <p className="rsvp-invitation__names">Shady &amp; Batool</p>
          <h3>Be Our Guest</h3>
          <Flourish />
          <p className="rsvp-invitation__copy">
            As we begin our forever, we would be honored to share this beautiful
            day with the people who mean the most to us.
          </p>

          <div className="rsvp-invitation__date">
            <span className="rsvp-invitation__date-icon"><CalendarIcon /></span>
            <div>
              <small>Save the date</small>
              <strong>27 August 2026</strong>
            </div>
          </div>

          <p className="rsvp-invitation__note">
            Kindly send one response for your household.
          </p>
        </aside>

        <form className="rsvp-form" onSubmit={handleSubmit} noValidate aria-busy={loading}>
          <div className="rsvp-form__heading">
            <div>
              <p>Attendance details</p>
              <h3>Will you join us?</h3>
            </div>
            <span aria-hidden="true">04</span>
          </div>

          <fieldset className="rsvp-attendance">
            <legend>Attendance</legend>
            <div className="rsvp-attendance__options">
              <label className={form.attendance === "Attending" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="attendance"
                  value="Attending"
                  checked={form.attendance === "Attending"}
                  onChange={() => updateAttendance("Attending")}
                />
                <span className="rsvp-attendance__mark"><CheckIcon /></span>
                <span>
                  <strong>Joyfully attending</strong>
                  <small>We cannot wait to celebrate</small>
                </span>
              </label>

              <label className={form.attendance === "Not Attending" ? "is-selected" : ""}>
                <input
                  type="radio"
                  name="attendance"
                  value="Not Attending"
                  checked={form.attendance === "Not Attending"}
                  onChange={() => updateAttendance("Not Attending")}
                />
                <span className="rsvp-attendance__mark"><CheckIcon /></span>
                <span>
                  <strong>Regretfully declining</strong>
                  <small>With love from afar</small>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="rsvp-form__grid">
            <label className="rsvp-field rsvp-field--wide">
              <span className="rsvp-field__label">Full Name <b>*</b></span>
              <span className="rsvp-field__control">
                <FieldIcon type="name" />
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={(event) => updateField("full_name", event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </span>
            </label>

            <label className="rsvp-field">
              <span className="rsvp-field__label">Phone Number <b>*</b></span>
              <span className="rsvp-field__control">
                <FieldIcon type="phone" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Your phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </span>
            </label>

            <div className={`rsvp-field rsvp-field--guests ${form.attendance === "Not Attending" ? "is-disabled" : ""}`}>
              <span className="rsvp-field__label">Number of Guests</span>
              <div className="rsvp-guests" aria-label="Number of guests">
                <FieldIcon type="guests" />
                <button
                  type="button"
                  onClick={() => changeGuests(-1)}
                  disabled={form.attendance === "Not Attending" || form.guests <= 1}
                  aria-label="Remove one guest"
                >
                  −
                </button>
                <output aria-live="polite">{form.guests}</output>
                <button
                  type="button"
                  onClick={() => changeGuests(1)}
                  disabled={form.attendance === "Not Attending" || form.guests >= 10}
                  aria-label="Add one guest"
                >
                  +
                </button>
              </div>
            </div>

            <label className="rsvp-field rsvp-field--wide">
              <span className="rsvp-field__label">A Note for the Couple</span>
              <span className="rsvp-field__control rsvp-field__control--textarea">
                <FieldIcon type="message" />
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  placeholder="Share a wish, a memory, or a little message..."
                  maxLength={500}
                />
              </span>
              <small className="rsvp-field__count">{form.message.length}/500</small>
            </label>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key="error"
                className="rsvp-status rsvp-status--error"
                role="alert"
                initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.div
                key="success"
                className="rsvp-status rsvp-status--success"
                role="status"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <span><CheckIcon /></span>
                <div>
                  <strong>Your reply has been received.</strong>
                  <small>Thank you for being part of our story.</small>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button className={`rsvp-submit ${success ? "is-success" : ""}`} disabled={loading} type="submit">
            <span className="rsvp-submit__shine" aria-hidden="true" />
            <span className="rsvp-submit__icon">
              {success ? <CheckIcon /> : <SendIcon />}
            </span>
            <span className="rsvp-submit__copy">
              <strong>{loading ? "Sending your reply..." : success ? "Attendance Confirmed" : "Confirm Attendance"}</strong>
              <small>{loading ? "Just a beautiful moment" : "Save my response"}</small>
            </span>
            <span className="rsvp-submit__arrow"><SendIcon /></span>
          </button>

          <p className="rsvp-form__privacy">
            Your details are used only to organize our wedding celebration.
          </p>
        </form>
      </motion.div>

      <motion.p className="rsvp-closing" {...reveal(0.16, 14)}>
        <span /> We cannot wait to celebrate with you <span />
      </motion.p>
    </section>
  );
}
