/**
 * Shared form validation for the two lead forms (contact page + quote modal).
 *
 * The API already validates everything server-side — that stays the source of
 * truth. This exists so a driver filling the form on a phone finds out about a
 * typo *while typing*, not after tapping Send and getting a generic failure.
 *
 * Every validator returns null when the value is acceptable, or a short
 * human-readable message when it is not.
 */

/* ---------------------------------------------------------------- phone -- */

export function phoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // A US number pasted with its country code: 1 (213) 371-6155
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.slice(0, 10);
}

/**
 * Progressive US mask, applied on every keystroke:
 *   2         -> "2"
 *   213       -> "(213) "
 *   2135550   -> "(213) 555-0"
 *   2135550142-> "(213) 555-0142"
 * Deleting works naturally because we always rebuild from the raw digits.
 */
export function formatUsPhone(raw: string): string {
  const d = phoneDigits(raw);
  if (d.length === 0) return '';
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function validatePhone(raw: string): string | null {
  const d = phoneDigits(raw);
  if (d.length === 0) return 'Please give us a phone number we can reach you on.';
  if (d.length < 10) return `That is only ${d.length} digit${d.length === 1 ? '' : 's'} — a US number needs 10.`;
  // NANP: area code and exchange code cannot begin with 0 or 1.
  if (/^[01]/.test(d)) return 'Area code cannot start with 0 or 1.';
  if (/^\d{3}[01]/.test(d)) return 'That does not look like a real US number — check the middle three digits.';
  if (/^(\d)\1{9}$/.test(d)) return 'Please enter a real phone number.';
  return null;
}

/* ---------------------------------------------------------------- email -- */

export function validateEmail(raw: string, required = false): string | null {
  const v = raw.trim();
  if (!v) return required ? 'Please enter your email address.' : null;
  if (v.length > 254) return 'That email address is too long.';
  // Deliberately practical rather than RFC-exhaustive: one @, a dot in the
  // domain, no spaces or characters that break mail headers.
  if (!/^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/.test(v)) {
    return v.includes('@')
      ? 'That email address looks incomplete — check the part after the @.'
      : 'An email address needs an @ sign.';
  }
  return null;
}

/* ----------------------------------------------------------------- name -- */

export function validateName(raw: string): string | null {
  const v = raw.trim();
  if (!v) return 'Please tell us your name.';
  if (v.length < 2) return 'Please enter your full name.';
  if (v.length > 100) return 'That name is too long.';
  if (!/[A-Za-z]/.test(v)) return 'Please enter your name in letters.';
  return null;
}

/* ------------------------------------------------------------ MC number -- */

/** Accepts "123456", "MC123456" or "MC-123456"; stores whatever they typed. */
export function validateMcNumber(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null; // optional
  const digits = v.replace(/^mc[-\s]?/i, '').replace(/\D/g, '');
  if (!digits) return 'An MC number is digits, for example MC-123456.';
  if (digits.length < 4 || digits.length > 8) return 'An MC number is usually 5 to 8 digits.';
  return null;
}

/* --------------------------------------------------------------- select -- */

export function validateRequiredSelect(raw: string, what: string): string | null {
  return raw.trim() ? null : `Please choose ${what}.`;
}

/* ------------------------------------------------------------ free text -- */

export function validateOptionalText(raw: string, max: number, what: string): string | null {
  return raw.length > max ? `${what} is too long (${raw.length} of ${max} characters).` : null;
}
