# WEDEPART3
# Advance Tech Solutions

A responsive multi-page website for **Advance Tech Solutions**, a small IT business in Mbombela, Mpumalanga, South Africa. The site presents the company's services (computer repairs, networking, CCTV, software, printers, IT security) and lets customers request quotes or send messages.

**Live site:** `https://YOUR-USERNAME.github.io/advance-tech-solutions/` (replace after deploying)
**Repository:** `https://github.com/YOUR-USERNAME/advance-tech-solutions`

## Project structure

```
index.html        Home page
about.html        About, mission/vision/values, image gallery with lightbox
services.html     Searchable/filterable services, FAQ accordion, details modal
enquiry.html      Quote request form (validation, AJAX submit, cost estimate)
contact.html      Contact form (validation, compiled email), Leaflet map
css/style.css     All styles (responsive: tablet <= 900px, mobile <= 600px)
js/script.js      All JavaScript
images/           Optimised images
robots.txt        Crawler instructions
sitemap.xml       Page list for search engines
```

## Part 3 features

### JavaScript enhancements
| Feature | Where | Notes |
|---|---|---|
| Accordion (FAQ) | services.html | Keyboard accessible, uses `aria-expanded` |
| Modal | services.html | "View details" opens a dialog with a link to the enquiry form pre-filled for that service. Esc closes, focus is trapped |
| Interactive map | contact.html | Leaflet + OpenStreetMap with a marker and popup |
| Animation | All pages | Sections fade in once on scroll; disabled when the visitor prefers reduced motion |
| DOM manipulation / dynamic content | index.html, contact.html | Testimonials are built and rotated in the DOM; an "open now / closed" badge is calculated from business hours |
| Gallery with lightbox | about.html | Click to enlarge; arrow keys and Esc supported |
| Search, filter and sort | services.html | Live text search, category filter and price/name sorting with a results count and empty state |

### SEO
- **Keywords:** Local terms (Mbombela, Mpumalanga) used in titles, descriptions, headings and body copy.
- **Titles and meta descriptions:** Unique per page, plus canonical URLs and Open Graph tags.
- **Headings:** One `h1` per page followed by `h2`/`h3` in order. The logo is no longer an `h1`.
- **Images:** Descriptive file names, meaningful `alt` text, `width`/`height`, lazy loading, compressed to under 100 KB each.
- **URLs:** Short, descriptive file names (`services.html`, `enquiry.html`).
- **Internal linking:** Links between About, Services, Enquiry and Contact in the body text, not only the menu.
- **Local SEO:** `LocalBusiness` structured data (JSON-LD) on the home page.
- **Mobile-friendly:** Responsive layout and viewport tag.
- **robots.txt** and **sitemap.xml** included.
- **Page speed:** Scripts use `defer`, fonts are preconnected, images are compressed and lazy loaded.
- **Security:** Content-Security-Policy meta tag, `rel="noopener noreferrer"` on external links, referrer policy, honeypot field against spam bots, user input only written to the page with `textContent`.

### Forms and validation
- **enquiry.html** (quote request): Name, email, South African phone number, service, budget (optional) and description. After validation the data is sent with AJAX (`fetch`) to FormSubmit, and the visitor sees an indicative price range, availability and a note on how their budget compares. If sending fails, the estimate is still shown and the visitor is told to email or call.
- **contact.html** (general message): Name, email, optional phone, message type, subject and message. After validation the details are compiled into an email and opened in the visitor's email app using a `mailto:` link to `info@advancetech.co.za`.
- **Validation rules:** Required fields, name characters/length, email format, SA phone format (`071 234 5678` or `+27 71 234 5678`), minimum and maximum message lengths. Errors appear under each field and are announced to screen readers. HTML5 attributes (`required`, `maxlength`, `type`) are kept, and JavaScript adds the detailed checks.

## Changelog

### Part 3
- Added accordion, modal, lightbox gallery, Leaflet map, scroll animation, dynamic testimonials and open/closed badge.
- Added service search, category filter and sorting.
- Added `enquiry.html` (replaces `quote.html`) with AJAX submission and cost estimate.
- Rebuilt contact form to compile an email; added message type and phone fields.
- Added robots.txt, sitemap.xml, canonical and Open Graph tags, structured data, CSP.
- Compressed images and cropped the black screenshot borders.

### Part 2 feedback edits
- Rebuilt `index.html`: fixed broken tags (`<Iink>`, `</Iink>`, stray `</div class=...>`), the `hero-contant` class that stopped the hero styling, the `services-card` class mismatch, invalid icon sizes (`fa-3*`), the `auther` meta name, and spelling errors ("professtional", "Qoute", "mordern", "sysytems").
- Fixed the script path mismatch (`scripts.js` file vs `js/script.js` reference) and the CSS/image folder paths.
- Made the contact phone number and footer consistent on every page.
- Added `aria-label`s, skip link, visible focus styles and `aria-hidden` on decorative icons.

### Part 1
- Initial five-page site: Home, About, Services, Quote, Contact.

## Deployment
1. Create a repository on GitHub and push these files to the `main` branch.
2. Go to **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
3. Update the URL in `sitemap.xml`, `robots.txt`, the canonical/`og:` tags and this README.
4. Submit `sitemap.xml` to Google Search Console.
5. The first enquiry submission sends FormSubmit an activation email to `info@advancetech.co.za`; confirm it once to start receiving requests.

## References
- MDN Web Docs. HTML, CSS, JavaScript, `fetch`, `IntersectionObserver` and ARIA references. https://developer.mozilla.org
- Leaflet. JavaScript library for interactive maps (v1.9.4). https://leafletjs.com
- OpenStreetMap contributors. Map tiles and data. https://www.openstreetmap.org/copyright
- Font Awesome Free 6.7.1. Icons. https://fontawesome.com
- Google Fonts. Poppins typeface. https://fonts.google.com/specimen/Poppins
- FormSubmit. Form-to-email service. https://formsubmit.co
- Google Search Central. SEO starter guide, robots.txt and sitemap documentation. https://developers.google.com/search/docs
- Schema.org. `LocalBusiness` type. https://schema.org/LocalBusiness
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/
- Images: add the source and licence for each photo in `images/` here (see note about `networking.jpg` and `team.jpg`).

