import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Uses DOMPurify with strict whitelist and security hooks
 *
 * SECURITY NOTES:
 * - Only allows safe HTML tags (no script, iframe, object, embed)
 * - Strips all event handlers (onclick, onerror, etc.)
 * - Removes data attributes to prevent data exfiltration
 * - Validates URLs in href/src to prevent javascript: protocol
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    // Allowed HTML tags - strict whitelist
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "span",
      "div",
      "blockquote",
    ],
    // Allowed attributes - minimal set
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
    // Protocol whitelist for links
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|#):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    // Security settings
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SAFE_FOR_TEMPLATES: true,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    // Add security hooks
    SANITIZE_DOM: true,
    FORCE_BODY: true,
  });
};

/**
 * Creates a sanitized HTML object safe for dangerouslySetInnerHTML
 * @param html - The HTML string to sanitize
 * @returns Object with __html property containing sanitized HTML
 */
export const createSafeHtml = (html: string) => {
  return { __html: sanitizeHtml(html) };
};
