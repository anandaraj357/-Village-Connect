import dns from 'dns/promises';
import { URL } from 'url';
import sanitizeHtmlLib from 'sanitize-html';

const PRIVATE_IP_RANGES = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // Link-local / Cloud metadata
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i
];

/**
 * Validates a target URL against SSRF and protocol restrictions
 */
export async function validateTargetUrl(rawUrl, allowedDomains = null) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('URL must be a valid non-empty string');
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (err) {
    throw new Error(`Invalid URL format: ${rawUrl}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Forbidden protocol: ${parsed.protocol}. Only HTTP and HTTPS are permitted.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  for (const regex of PRIVATE_IP_RANGES) {
    if (regex.test(hostname)) {
      throw new Error(`SSRF Protection: Access to private or loopback host ${hostname} is blocked.`);
    }
  }

  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const addr of addresses) {
      for (const regex of PRIVATE_IP_RANGES) {
        if (regex.test(addr.address)) {
          throw new Error(`SSRF Protection: Host ${hostname} resolves to blocked private address ${addr.address}`);
        }
      }
    }
  } catch (dnsErr) {
    if (dnsErr.message.includes('SSRF Protection')) throw dnsErr;
  }

  if (allowedDomains && Array.isArray(allowedDomains) && allowedDomains.length > 0) {
    const isDomainAllowed = allowedDomains.some((domain) => {
      const d = domain.toLowerCase();
      return hostname === d || hostname.endsWith(`.${d}`);
    });

    if (!isDomainAllowed) {
      throw new Error(`Domain not in administrator whitelist: ${hostname}`);
    }
  }

  return parsed.toString();
}

/**
 * Sanitizes scraped HTML text
 */
export function sanitizeExtractedHtml(dirtyHtml) {
  if (!dirtyHtml) return '';
  return sanitizeHtmlLib(dirtyHtml, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'table', 'tr', 'td', 'th', 'span', 'br'],
    allowedAttributes: {
      a: ['href', 'title', 'target'],
      table: ['class', 'border'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan']
    },
    nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript', 'iframe'],
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform('a', { rel: 'noopener noreferrer' })
    }
  });
}

/**
 * Strips all HTML to clean plain text
 */
export function stripToPlainText(htmlOrText) {
  if (!htmlOrText) return '';
  // Add space around block and tag boundaries so adjacent tags don't concatenate words
  const spaced = String(htmlOrText).replace(/></g, '> <');
  const sanitized = sanitizeHtmlLib(spaced, {
    allowedTags: [],
    allowedAttributes: {},
    nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript', 'iframe']
  });
  return sanitized
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
