/* =====================================================
   ADVANCE TECH SOLUTIONS - Main JavaScript (Part 3)
   Features: nav highlight, scroll reveal, dynamic
   testimonials, open/closed badge, service search/filter/
   sort, modal, accordion, gallery lightbox, Leaflet map,
   contact form (mailto), enquiry form (validation + AJAX
   + cost estimate).
   ===================================================== */
(function () {
    "use strict";

    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    var CONFIG = {
        email: "info@advancetech.co.za",
        ajaxUrl: "https://formsubmit.co/ajax/info@advancetech.co.za",
        mapLat: -25.4753,
        mapLng: 30.9694
    };

    /* Indicative price ranges (ZAR). Edit these to match your real prices. */
    var ESTIMATES = {
        "computer-repair": { label: "Computer Repairs", min: 350, max: 1500, time: "1-2 business days" },
        "networking": { label: "Network Installation", min: 1200, max: 6000, time: "site visit within 3 business days" },
        "cctv": { label: "CCTV Installation", min: 3500, max: 15000, time: "site visit within 3-5 business days" },
        "software": { label: "Software Installation", min: 250, max: 800, time: "same day or next business day" },
        "printer": { label: "Printer Support", min: 300, max: 900, time: "1-2 business days" },
        "security": { label: "IT Security", min: 300, max: 1200, time: "1-2 business days" }
    };

    var BUDGETS = {
        "under1000": [0, 1000],
        "1000-3000": [1000, 3000],
        "3000-5000": [3000, 5000],
        "5000+": [5000, Infinity]
    };

    var TESTIMONIALS = [
        { text: "The team repaired my laptop within one day. Excellent service!", name: "Sarah M." },
        { text: "Professional networking installation for our office. Highly recommended.", name: "David K." },
        { text: "Our CCTV cameras were installed neatly and explained clearly. Very happy.", name: "Thabo N." },
        { text: "Fair price and fast response when our printer stopped working.", name: "Lindiwe S." }
    ];

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function formatRand(n) {
        return "R" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /* ---------- Active navigation link ---------- */
    function initNav() {
        var page = window.location.pathname.split("/").pop() || "index.html";
        $$("nav a").forEach(function (a) {
            if (a.getAttribute("href") === page) {
                a.classList.add("active");
                a.setAttribute("aria-current", "page");
            }
        });
    }

    /* ---------- Current year ---------- */
    function initYear() {
        $$(".current-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    }

    /* ---------- Scroll reveal (one subtle animation) ---------- */
    function initReveal() {
        var items = $$("[data-reveal]");
        if (!items.length || reduceMotion || !("IntersectionObserver" in window)) { return; }
        items.forEach(function (el) { el.classList.add("reveal"); });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
            });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
    }

    /* ---------- Dynamic testimonials (DOM creation) ---------- */
    function initTestimonials() {
        var box = $("#testimonialList");
        if (!box) { return; }
        var start = 0;
        function render() {
            box.textContent = "";
            for (var i = 0; i < 2; i++) {
                var t = TESTIMONIALS[(start + i) % TESTIMONIALS.length];
                var fig = document.createElement("blockquote");
                fig.className = "testimonial";
                var p = document.createElement("p");
                p.textContent = "\u201C" + t.text + "\u201D";
                var h = document.createElement("h4");
                h.textContent = "\u2014 " + t.name;
                fig.appendChild(p);
                fig.appendChild(h);
                box.appendChild(fig);
            }
        }
        render();
        var next = $("#nextTestimonials");
        if (next) {
            next.addEventListener("click", function () {
                start = (start + 2) % TESTIMONIALS.length;
                render();
            });
        }
    }

    /* ---------- Open / closed badge ---------- */
    function initOpenStatus() {
        var badge = $("#openStatus");
        if (!badge) { return; }
        var now = new Date();
        var day = now.getDay();
        var mins = now.getHours() * 60 + now.getMinutes();
        var open = false;
        if (day >= 1 && day <= 5) { open = mins >= 8 * 60 && mins < 17 * 60; }
        if (day === 6) { open = mins >= 9 * 60 && mins < 13 * 60; }
        badge.textContent = open ? "We are open now" : "We are currently closed";
        badge.classList.toggle("is-open", open);
        badge.classList.toggle("is-closed", !open);
    }

    /* ---------- Modal (service details) ---------- */
    var modalOpener = null;
    function openModal(title, body, ctaHref) {
        var modal = $("#modal");
        if (!modal) { return; }
        modalOpener = document.activeElement;
        $("#modalTitle").textContent = title;
        $("#modalBody").textContent = body;
        $("#modalCta").setAttribute("href", ctaHref);
        modal.hidden = false;
        document.body.classList.add("no-scroll");
        $(".modal-close", modal).focus();
    }
    function closeModal() {
        var modal = $("#modal");
        if (!modal || modal.hidden) { return; }
        modal.hidden = true;
        document.body.classList.remove("no-scroll");
        if (modalOpener) { modalOpener.focus(); }
    }
    function trapFocus(container, e) {
        var f = $$("button, a[href], input, select, textarea", container).filter(function (el) { return !el.disabled; });
        if (!f.length) { return; }
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    function initModal() {
        var modal = $("#modal");
        if (!modal) { return; }
        modal.addEventListener("click", function (e) {
            if (e.target === modal || e.target.closest(".modal-close")) { closeModal(); }
        });
        modal.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { closeModal(); }
            if (e.key === "Tab") { trapFocus(modal, e); }
        });
    }

    /* ---------- Services: search, filter, sort ---------- */
    function initServices() {
        var grid = $("#serviceGrid");
        if (!grid) { return; }
        var cards = $$(".service-card", grid);
        var search = $("#serviceSearch");
        var cat = $("#serviceCategory");
        var sort = $("#serviceSort");
        var count = $("#serviceCount");
        var none = $("#noResults");

        function apply() {
            var q = search.value.trim().toLowerCase();
            var c = cat.value;
            var visible = [];
            cards.forEach(function (card) {
                var text = (card.dataset.name + " " + card.textContent).toLowerCase();
                var match = (!q || text.indexOf(q) !== -1) && (c === "all" || card.dataset.category === c);
                card.hidden = !match;
                if (match) { visible.push(card); }
            });
            var s = sort.value;
            cards.slice().sort(function (a, b) {
                if (s === "price-asc") { return a.dataset.price - b.dataset.price; }
                if (s === "price-desc") { return b.dataset.price - a.dataset.price; }
                return a.dataset.name.localeCompare(b.dataset.name);
            }).forEach(function (card) { grid.appendChild(card); });
            count.textContent = visible.length + (visible.length === 1 ? " service shown" : " services shown");
            none.hidden = visible.length !== 0;
        }
        search.addEventListener("input", apply);
        cat.addEventListener("change", apply);
        sort.addEventListener("change", apply);
        var reset = $("#resetFilters");
        if (reset) {
            reset.addEventListener("click", function () {
                search.value = ""; cat.value = "all"; sort.value = "name"; apply(); search.focus();
            });
        }

        grid.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-details]");
            if (!btn) { return; }
            var card = btn.closest(".service-card");
            openModal(card.dataset.name, card.dataset.details,
                "enquiry.html?service=" + encodeURIComponent(card.dataset.id));
        });
        apply();
    }

    /* ---------- Accordion ---------- */
    function initAccordion() {
        $$(".acc-trigger").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var open = btn.getAttribute("aria-expanded") === "true";
                btn.setAttribute("aria-expanded", String(!open));
                $("#" + btn.getAttribute("aria-controls")).hidden = open;
            });
        });
    }

    /* ---------- Gallery lightbox ---------- */
    function initLightbox() {
        var items = $$(".gallery-item");
        var box = $("#lightbox");
        if (!items.length || !box) { return; }
        var img = $("#lightboxImg", box);
        var cap = $("#lightboxCaption", box);
        var index = 0, opener = null;

        function show(i) {
            index = (i + items.length) % items.length;
            var src = items[index].querySelector("img");
            img.src = src.currentSrc || src.src;
            img.alt = src.alt;
            cap.textContent = src.alt;
        }
        function open(i) {
            opener = document.activeElement;
            show(i);
            box.hidden = false;
            document.body.classList.add("no-scroll");
            $(".lightbox-close", box).focus();
        }
        function close() {
            box.hidden = true;
            document.body.classList.remove("no-scroll");
            if (opener) { opener.focus(); }
        }
        items.forEach(function (it, i) { it.addEventListener("click", function () { open(i); }); });
        $(".lightbox-prev", box).addEventListener("click", function () { show(index - 1); });
        $(".lightbox-next", box).addEventListener("click", function () { show(index + 1); });
        $(".lightbox-close", box).addEventListener("click", close);
        box.addEventListener("click", function (e) { if (e.target === box) { close(); } });
        box.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { close(); }
            if (e.key === "ArrowLeft") { show(index - 1); }
            if (e.key === "ArrowRight") { show(index + 1); }
            if (e.key === "Tab") { trapFocus(box, e); }
        });
    }

    /* ---------- Interactive map (Leaflet) ---------- */
    function initMap() {
        var el = $("#map");
        if (!el || typeof L === "undefined") { return; }
        var map = L.map(el, { scrollWheelZoom: false }).setView([CONFIG.mapLat, CONFIG.mapLng], 14);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);
        L.marker([CONFIG.mapLat, CONFIG.mapLng]).addTo(map)
            .bindPopup("<strong>Advance Tech Solutions</strong><br>123 Main Street, Mbombela")
            .openPopup();
    }

    /* ---------- Form helpers ---------- */
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^(\+27|0)[1-9][0-9]{8}$/;

    function setError(field, msg) {
        var err = $("#" + field.id + "-error");
        if (err) { err.textContent = msg; }
        field.classList.toggle("invalid", !!msg);
        field.setAttribute("aria-invalid", msg ? "true" : "false");
        return !msg;
    }
    function cleanPhone(v) { return v.replace(/[\s\-()]/g, ""); }

    var RULES = {
        name: function (v) {
            if (!v) { return "Please enter your full name."; }
            if (v.length < 2 || v.length > 60) { return "Name must be 2 to 60 characters."; }
            if (!/^[A-Za-z\u00C0-\u024F' .-]+$/.test(v)) { return "Name can only contain letters, spaces, apostrophes and hyphens."; }
            return "";
        },
        email: function (v) {
            if (!v) { return "Please enter your email address."; }
            return EMAIL_RE.test(v) ? "" : "Enter a valid email, e.g. name@example.com.";
        },
        phoneRequired: function (v) {
            if (!v) { return "Please enter your phone number."; }
            return PHONE_RE.test(cleanPhone(v)) ? "" : "Enter a valid South African number, e.g. 071 234 5678 or +27 71 234 5678.";
        },
        phoneOptional: function (v) {
            if (!v) { return ""; }
            return PHONE_RE.test(cleanPhone(v)) ? "" : "Enter a valid South African number, e.g. 071 234 5678.";
        },
        select: function (v) { return v ? "" : "Please choose an option."; },
        text: function (min, max) {
            return function (v) {
                if (!v) { return "This field is required."; }
                if (v.length < min) { return "Please enter at least " + min + " characters."; }
                if (v.length > max) { return "Please keep this under " + max + " characters."; }
                return "";
            };
        }
    };

    function validateAll(form, map) {
        var ok = true, firstBad = null;
        Object.keys(map).forEach(function (id) {
            var f = $("#" + id, form);
            var good = setError(f, map[id](f.value.trim()));
            if (!good && !firstBad) { firstBad = f; }
            ok = ok && good;
        });
        if (firstBad) { firstBad.focus(); }
        return ok;
    }
    function liveValidate(form, map) {
        Object.keys(map).forEach(function (id) {
            var f = $("#" + id, form);
            f.addEventListener("blur", function () { setError(f, map[id](f.value.trim())); });
            f.addEventListener("input", function () { if (f.classList.contains("invalid")) { setError(f, map[id](f.value.trim())); } });
        });
    }
    function showStatus(el, msg, type) {
        el.textContent = msg;
        el.className = "form-message " + type;
    }

    /* ---------- Contact form: validate then compile an email ---------- */
    function initContactForm() {
        var form = $("#contactForm");
        if (!form) { return; }
        var status = $("#contactMessage");
        var rules = {
            contactName: RULES.name,
            contactEmail: RULES.email,
            contactPhone: RULES.phoneOptional,
            messageType: RULES.select,
            subject: RULES.text(3, 100),
            message: RULES.text(10, 1500)
        };
        liveValidate(form, rules);

        var count = $("#messageCount");
        $("#message").addEventListener("input", function (e) {
            count.textContent = e.target.value.length + " / 1500";
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!validateAll(form, rules)) {
                showStatus(status, "Please fix the highlighted fields.", "error");
                return;
            }
            var v = function (id) { return $("#" + id, form).value.trim(); };
            var body =
                "Name: " + v("contactName") + "\n" +
                "Email: " + v("contactEmail") + "\n" +
                "Phone: " + (v("contactPhone") || "Not provided") + "\n" +
                "Message type: " + v("messageType") + "\n\n" +
                v("message");
            var href = "mailto:" + CONFIG.email +
                "?subject=" + encodeURIComponent("[" + v("messageType") + "] " + v("subject")) +
                "&body=" + encodeURIComponent(body);

            status.textContent = "";
            status.className = "form-message success";
            status.appendChild(document.createTextNode("Thank you, " + v("contactName") + ". Your email app should open with your message ready to send. "));
            var link = document.createElement("a");
            link.href = href;
            link.textContent = "Click here if it did not open.";
            status.appendChild(link);
            window.location.href = href;
        });
    }

    /* ---------- Enquiry form: validate, AJAX submit, show estimate ---------- */
    function buildEstimate(service, budget) {
        var est = ESTIMATES[service];
        var panel = $("#estimate");
        panel.textContent = "";
        var h = document.createElement("h3");
        h.textContent = "Your indicative estimate";
        var range = document.createElement("p");
        range.className = "estimate-range";
        range.textContent = est.label + ": " + formatRand(est.min) + " - " + formatRand(est.max);
        var avail = document.createElement("p");
        avail.textContent = "Availability: " + est.time + ".";
        panel.appendChild(h);
        panel.appendChild(range);
        panel.appendChild(avail);

        if (budget && BUDGETS[budget]) {
            var b = BUDGETS[budget];
            var note = document.createElement("p");
            if (b[1] < est.min) {
                note.textContent = "Your budget is below the usual starting price. We can discuss a reduced scope or a payment plan.";
            } else if (b[0] > est.max) {
                note.textContent = "Your budget is above the usual range, so we can include extra features or a longer warranty.";
            } else {
                note.textContent = "Your budget fits within the usual range for this service.";
            }
            panel.appendChild(note);
        }
        var small = document.createElement("p");
        small.className = "estimate-note";
        small.textContent = "This is a guide only. A final quotation follows after we review your requirements.";
        panel.appendChild(small);
        panel.hidden = false;
        panel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }

    function initEnquiryForm() {
        var form = $("#quoteForm");
        if (!form) { return; }
        var status = $("#quoteMessage");
        var rules = {
            name: RULES.name,
            email: RULES.email,
            phone: RULES.phoneRequired,
            service: RULES.select,
            description: RULES.text(10, 1500)
        };
        liveValidate(form, rules);

        var preset = new URLSearchParams(window.location.search).get("service");
        if (preset && ESTIMATES[preset]) { $("#service", form).value = preset; }

        var count = $("#descriptionCount");
        $("#description").addEventListener("input", function (e) {
            count.textContent = e.target.value.length + " / 1500";
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if ($("#website", form).value) { return; } /* honeypot: bots fill this in */
            if (!validateAll(form, rules)) {
                showStatus(status, "Please fix the highlighted fields.", "error");
                return;
            }
            var v = function (id) { return $("#" + id, form).value.trim(); };
            var payload = {
                _subject: "New quote request: " + ESTIMATES[v("service")].label,
                _template: "table",
                _captcha: "false",
                name: v("name"),
                email: v("email"),
                phone: v("phone"),
                service: ESTIMATES[v("service")].label,
                budget: v("budget") || "Not specified",
                description: v("description")
            };
            var btn = $("button[type=submit]", form);
            btn.disabled = true;
            showStatus(status, "Sending your request...", "info");

            fetch(CONFIG.ajaxUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload)
            }).then(function (res) {
                if (!res.ok) { throw new Error("HTTP " + res.status); }
                return res.json();
            }).then(function () {
                showStatus(status, "Thank you, " + payload.name + ". Your request has been sent and we will contact you soon.", "success");
                buildEstimate(v("service"), v("budget"));
                form.reset();
                count.textContent = "0 / 1500";
            }).catch(function () {
                showStatus(status, "We could not send your request right now. Please email " + CONFIG.email + " or call us. Your estimate is shown below.", "error");
                buildEstimate(v("service"), v("budget"));
            }).then(function () { btn.disabled = false; });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initNav();
        initYear();
        initReveal();
        initTestimonials();
        initOpenStatus();
        initModal();
        initServices();
        initAccordion();
        initLightbox();
        initMap();
        initContactForm();
        initEnquiryForm();
    });
})();
