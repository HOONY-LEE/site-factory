import { SiteContent } from "@/types/content";

function esc(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(str: string) {
  return esc(str).replace(/\n/g, "<br>");
}

/* ───── Header ───── */
function renderHeader(h: SiteContent["header"], style: string) {
  const navLinks = h.nav
    .map(
      (n) =>
        `<a href="${esc(n.href)}" class="text-[14px] font-medium ${
          style === "brand"
            ? "text-[#9fa5b0] hover:text-[#272a30]"
            : style === "product"
            ? "text-gray-400 hover:text-white"
            : "text-gray-600 hover:text-gray-900"
        } transition-colors">${esc(n.label)}</a>`
    )
    .join("\n          ");

  const bg =
    style === "product"
      ? "bg-black/80 backdrop-blur-md border-white/10"
      : "bg-white/80 backdrop-blur-md border-gray-200";
  const logo =
    style === "product"
      ? "text-white"
      : style === "brand"
      ? "text-[#272a30]"
      : "text-gray-900";

  return `
  <header class="sticky top-0 z-50 border-b ${bg}">
    <div class="mx-auto flex h-[60px] max-w-[980px] items-center justify-between px-5">
      <span class="text-[18px] font-bold ${logo}">${esc(h.logo)}</span>
      <nav class="hidden md:flex items-center gap-7">
        ${navLinks}
      </nav>
    </div>
  </header>`;
}

/* ───── Hero ───── */
function renderHero(h: SiteContent["hero"], style: string) {
  const bgImg = h.backgroundImage
    ? `style="background-image:url('${h.backgroundImage}');background-size:cover;background-position:center;"`
    : "";

  if (style === "brand") {
    return `
  <section class="bg-white py-24 sm:py-32" ${bgImg}>
    <div class="mx-auto max-w-[980px] px-5">
      <p class="mb-4 text-[15px] font-medium text-[#9fa5b0]">${esc(h.subheadline)}</p>
      <h1 class="max-w-[700px] text-[36px] sm:text-[52px] font-bold leading-[1.15] tracking-[-0.02em] text-[#272a30] whitespace-pre-line">${esc(h.headline)}</h1>
      <div class="mt-8 flex items-center gap-4">
        <a href="${esc(h.primaryCta.href)}" class="rounded-full bg-[#06a96c] px-7 py-3 text-[15px] font-semibold text-white hover:bg-[#058a58]">${esc(h.primaryCta.label)}</a>
        ${h.secondaryCta ? `<a href="${esc(h.secondaryCta.href)}" class="text-[15px] font-medium text-[#9fa5b0] hover:text-[#272a30]">${esc(h.secondaryCta.label)}</a>` : ""}
      </div>
    </div>
  </section>`;
  }

  if (style === "product") {
    return `
  <section class="relative flex min-h-screen items-center justify-center bg-black text-center" ${bgImg}>
    <div class="px-5">
      <h1 class="text-[48px] sm:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-white">${nl2br(h.headline)}</h1>
      <p class="mx-auto mt-6 max-w-[600px] text-[18px] leading-[1.6] text-gray-400">${esc(h.subheadline)}</p>
      <div class="mt-8 flex justify-center gap-4">
        <a href="${esc(h.primaryCta.href)}" class="rounded-full bg-[#2997ff] px-8 py-3 text-[15px] font-semibold text-white">${esc(h.primaryCta.label)}</a>
      </div>
    </div>
  </section>`;
  }

  // corporate / startup
  const isDark = style === "startup";
  return `
  <section class="${isDark ? "bg-gradient-to-br from-gray-900 to-indigo-900 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50"} py-20 sm:py-28" ${bgImg}>
    <div class="mx-auto max-w-[980px] px-5 text-center">
      <h1 class="text-[36px] sm:text-[52px] font-bold leading-[1.15] tracking-[-0.02em] ${isDark ? "text-white" : "text-gray-900"}">${nl2br(h.headline)}</h1>
      <p class="mx-auto mt-6 max-w-[600px] text-[18px] leading-[1.6] ${isDark ? "text-gray-300" : "text-gray-600"}">${esc(h.subheadline)}</p>
      <div class="mt-8 flex justify-center gap-4">
        <a href="${esc(h.primaryCta.href)}" class="rounded-full bg-indigo-600 px-8 py-3 text-[15px] font-semibold text-white">${esc(h.primaryCta.label)}</a>
      </div>
    </div>
  </section>`;
}

/* ───── About / Stats ───── */
function renderAbout(a: SiteContent["about"], style: string) {
  const stats = (a.stats ?? [])
    .map(
      (s) => `
        <div class="text-center p-6">
          <div class="text-[28px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(s.value)}</div>
          <div class="mt-1 text-[14px] ${style === "product" ? "text-gray-400" : "text-gray-500"}">${esc(s.label)}</div>
        </div>`
    )
    .join("");

  if (style === "brand") {
    const paragraphs = a.description.split("\n").filter(Boolean);
    const body = paragraphs
      .map(
        (p, i) =>
          `<p class="text-[15px] leading-[1.8] ${i === paragraphs.length - 1 ? "font-semibold text-[#272a30]" : "text-[#9fa5b0]"}">${esc(p)}</p>`
      )
      .join("\n          ");

    return `
  <section class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <p class="mb-5 text-[15px] font-bold italic text-[#06a96c]">Why We&rsquo;re Here</p>
      <h2 class="max-w-[700px] text-[28px] sm:text-[36px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30]">${esc(a.sectionTitle)}</h2>
      <div class="mt-10 max-w-[700px] space-y-5">${body}</div>
      ${stats ? `<div class="mt-14 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y border rounded-xl">${stats}</div>` : ""}
      <hr class="mt-16 border-gray-200">
    </div>
  </section>`;
  }

  return `
  <section class="${style === "product" ? "bg-black" : "bg-gray-50"} py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <h2 class="text-center text-[28px] sm:text-[36px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(a.sectionTitle)}</h2>
      <p class="mx-auto mt-4 max-w-[600px] text-center text-[16px] leading-[1.7] ${style === "product" ? "text-gray-400" : "text-gray-600"}">${nl2br(a.description)}</p>
      ${stats ? `<div class="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">${stats}</div>` : ""}
    </div>
  </section>`;
}

/* ───── Services ───── */
function renderServices(s: SiteContent["services"], style: string) {
  if (style === "brand") {
    const items = s.items
      .map(
        (item) => `
          <div>
            <h3 class="mb-3 text-[18px] font-bold text-[#272a30]">${esc(item.title)}</h3>
            <p class="text-[15px] leading-[1.8] text-[#9fa5b0]">${esc(item.description)}</p>
          </div>`
      )
      .join("");

    return `
  <section class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <p class="mb-5 text-[15px] font-bold italic text-[#06a96c]">What We Do</p>
      <div class="grid gap-12 sm:grid-cols-2">
        <h2 class="text-[28px] sm:text-[36px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30]">${esc(s.sectionTitle)}</h2>
        <div class="space-y-8">${items}</div>
      </div>
      <hr class="mt-16 border-gray-200">
    </div>
  </section>`;
  }

  const items = s.items
    .map(
      (item) => `
      <div class="${style === "product" ? "bg-gray-900 rounded-2xl p-8" : "bg-white rounded-xl border p-6"}">
        <h3 class="text-[18px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(item.title)}</h3>
        <p class="mt-3 text-[15px] leading-[1.7] ${style === "product" ? "text-gray-400" : "text-gray-600"}">${esc(item.description)}</p>
      </div>`
    )
    .join("");

  return `
  <section class="${style === "product" ? "bg-black" : "bg-white"} py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <h2 class="text-center text-[28px] sm:text-[36px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(s.sectionTitle)}</h2>
      ${s.sectionSubtitle ? `<p class="mx-auto mt-4 max-w-[600px] text-center text-[16px] ${style === "product" ? "text-gray-400" : "text-gray-600"}">${esc(s.sectionSubtitle)}</p>` : ""}
      <div class="mt-12 grid gap-6 sm:grid-cols-2">${items}</div>
    </div>
  </section>`;
}

/* ───── Features ───── */
function renderFeatures(f: SiteContent["features"], style: string) {
  if (style === "brand") {
    const items = f.items
      .map(
        (item) => `
          <div>
            <h3 class="mb-3 text-[18px] font-bold text-[#272a30]">${esc(item.title)}</h3>
            <p class="text-[15px] leading-[1.8] text-[#9fa5b0]">${esc(item.description)}</p>
          </div>`
      )
      .join("");

    return `
  <section class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <p class="mb-5 text-[15px] font-bold italic text-[#06a96c]">Who We Are</p>
      <div class="grid gap-12 sm:grid-cols-2">
        <h2 class="text-[28px] sm:text-[36px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30]">${esc(f.sectionTitle)}</h2>
        <div class="space-y-8">${items}</div>
      </div>
      <hr class="mt-16 border-gray-200">
    </div>
  </section>`;
  }

  const items = f.items
    .map(
      (item) => `
      <div class="${style === "product" ? "bg-gray-900 rounded-2xl p-8" : "bg-white rounded-xl border p-6"} text-center">
        <h3 class="text-[18px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(item.title)}</h3>
        <p class="mt-3 text-[15px] leading-[1.7] ${style === "product" ? "text-gray-400" : "text-gray-600"}">${esc(item.description)}</p>
      </div>`
    )
    .join("");

  return `
  <section class="${style === "product" ? "bg-black" : "bg-gray-50"} py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <h2 class="text-center text-[28px] sm:text-[36px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(f.sectionTitle)}</h2>
      <div class="mt-12 grid gap-6 sm:grid-cols-3">${items}</div>
    </div>
  </section>`;
}

/* ───── Testimonials ───── */
function renderTestimonials(t: SiteContent["testimonials"], style: string) {
  if (style === "brand") {
    const quotes = t.items
      .map(
        (item) =>
          `<p class="text-[15px] leading-[1.8] text-[#9fa5b0]">${esc(item.quote)}</p>`
      )
      .join("\n          ");

    return `
  <section class="bg-white py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5 text-center">
      <p class="mb-5 text-[15px] font-bold italic text-[#06a96c]">Where We Are Going</p>
      <h2 class="mx-auto max-w-[700px] text-[28px] sm:text-[36px] font-bold leading-[1.4] tracking-[-0.01em] text-[#272a30]">${esc(t.sectionTitle)}</h2>
      <div class="mx-auto mt-10 max-w-[700px] space-y-5">${quotes}</div>
    </div>
  </section>`;
  }

  const cards = t.items
    .map(
      (item) => `
      <div class="${style === "product" ? "bg-gray-900 rounded-2xl p-8" : "bg-white rounded-xl border p-6"}">
        <p class="text-[15px] leading-[1.7] ${style === "product" ? "text-gray-300" : "text-gray-600"}">&ldquo;${esc(item.quote)}&rdquo;</p>
        <div class="mt-4">
          <div class="font-semibold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(item.name)}</div>
          <div class="text-[13px] ${style === "product" ? "text-gray-500" : "text-gray-400"}">${esc(item.role)}, ${esc(item.company)}</div>
        </div>
      </div>`
    )
    .join("");

  return `
  <section class="${style === "product" ? "bg-black" : "bg-gray-50"} py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5">
      <h2 class="text-center text-[28px] sm:text-[36px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(t.sectionTitle)}</h2>
      <div class="mt-12 grid gap-6 sm:grid-cols-3">${cards}</div>
    </div>
  </section>`;
}

/* ───── CTA ───── */
function renderCta(c: SiteContent["cta"], style: string) {
  const btnClass =
    style === "brand"
      ? "bg-[#06a96c] hover:bg-[#058a58]"
      : style === "product"
      ? "bg-[#2997ff] hover:bg-[#1a7fdd]"
      : "bg-indigo-600 hover:bg-indigo-700";

  return `
  <section class="${style === "product" ? "bg-black" : "bg-white"} py-20 sm:py-28">
    <div class="mx-auto max-w-[980px] px-5 text-center">
      <h2 class="text-[28px] sm:text-[36px] font-bold ${style === "product" ? "text-white" : "text-gray-900"}">${esc(c.headline)}</h2>
      <p class="mx-auto mt-4 max-w-[500px] text-[16px] leading-[1.7] ${style === "product" ? "text-gray-400" : "text-gray-500"}">${esc(c.description)}</p>
      <a href="${esc(c.buttonHref)}" class="mt-8 inline-block rounded-full ${btnClass} px-8 py-3.5 text-[15px] font-semibold text-white">${esc(c.buttonLabel)}</a>
    </div>
  </section>`;
}

/* ───── Footer ───── */
function renderFooter(f: SiteContent["footer"], style: string) {
  const linkCols = f.links
    .map(
      (group) => `
      <div>
        <h3 class="mb-4 text-[14px] font-bold ${style === "product" ? "text-white" : "text-gray-800"}">${esc(group.title)}</h3>
        <ul class="space-y-2.5">
          ${group.items.map((link) => `<li><a href="${esc(link.href)}" class="text-[14px] ${style === "product" ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700"} transition-colors">${esc(link.label)}</a></li>`).join("\n          ")}
        </ul>
      </div>`
    )
    .join("");

  return `
  <footer class="border-t ${style === "product" ? "border-gray-800 bg-black" : "border-gray-200 bg-white"} py-14">
    <div class="mx-auto max-w-[980px] px-5">
      <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
        ${linkCols}
        <div>
          <h3 class="mb-4 text-[14px] font-bold ${style === "product" ? "text-white" : "text-gray-800"}">${esc(f.companyName)}</h3>
          <ul class="space-y-2.5">
            ${f.contact?.email ? `<li class="text-[14px] ${style === "product" ? "text-gray-500" : "text-gray-400"}">${esc(f.contact.email)}</li>` : ""}
            ${f.contact?.phone ? `<li class="text-[14px] ${style === "product" ? "text-gray-500" : "text-gray-400"}">${esc(f.contact.phone)}</li>` : ""}
          </ul>
        </div>
      </div>
      <div class="mt-12 space-y-1">
        <p class="text-[13px] ${style === "product" ? "text-gray-600" : "text-gray-400"}">${esc(f.copyright)}</p>
        ${f.contact?.address ? `<p class="text-[13px] ${style === "product" ? "text-gray-600" : "text-gray-400"}">${esc(f.contact.address)}</p>` : ""}
      </div>
    </div>
  </footer>`;
}

/* ===== Main export function ===== */
export function generateStaticHtml(
  content: SiteContent,
  templateId: string
): string {
  // 템플릿 스타일 매핑
  const style =
    templateId === "brand"
      ? "brand"
      : templateId === "product"
      ? "product"
      : templateId === "startup"
      ? "startup"
      : "corporate";

  const bgClass = style === "product" ? "bg-black" : "bg-white";

  const sections = [
    renderHeader(content.header, style),
    renderHero(content.hero, style),
    renderAbout(content.about, style),
    renderServices(content.services, style),
    renderFeatures(content.features, style),
    renderTestimonials(content.testimonials, style),
    renderCta(content.cta, style),
    renderFooter(content.footer, style),
  ];

  // brand 템플릿은 순서가 다름: hero → about → services → features → testimonials → cta
  // 위에서 이미 그 순서로 렌더링

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(content.meta?.title || "My Site")}</title>
  <meta name="description" content="${esc(content.meta?.description || "")}">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Pretendard Font -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing: antialiased; }
    .overflow-x-auto::-webkit-scrollbar { display: none; }
    .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body>
<div class="min-h-screen ${bgClass}">
${sections.join("\n")}
</div>
</body>
</html>`;
}
