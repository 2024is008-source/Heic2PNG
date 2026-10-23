# Structured data audit and implementation

23 October 2026. Source and all 19 generated HTML documents inspected. Changes are implemented locally. Nothing was deployed or changed on the VPS.

## Audit findings and corrections

- The existing template already emitted one JSON-LD script per HTML document. It did not need another block or a second schema plugin.
- Existing graphs lacked explicit page identities and stable site/publisher entity IDs. Added a single WebPage per indexable URL and linked the page, site, publisher and article entities.
- The homepage had a one-item BreadcrumbList, which does not meet Google's minimum breadcrumb length. Removed it.
- Article trails previously jumped from Home directly to the article. Replaced them with Home → Blog → Article, using canonical URLs. Category chips link to the same archive rather than a separate canonical category page, so they are not invented as additional parent pages.
- Other pages have no visible breadcrumb trail. Their old generic breadcrumbs were removed rather than introducing navigation or marking up unsupported UI.
- The existing homepage FAQPage block was removed. All ten visible FAQ questions, answers and toggle controls remain unchanged.
- Replaced generic Article with the more specific BlogPosting for ten published blog posts.
- Removed the three existing SoftwareApplication entities. They describe real browser software, but the site has no genuine rating/review evidence needed for Google's software-app feature. Converters are represented as WebPage instead. No review, rating, offer or currency is fabricated to make them qualify.
- Removed structured data from the noindex custom error document. Missing URLs still return the existing 404 page.
- The old blog archive CollectionPage is represented as WebPage within the same common page model; it makes no unsupported rich-result claim.

## Schema types and why they are appropriate

- **WebSite:** describes HEIC2PNG using its existing site name, homepage URL and English content. The homepage includes the data Google uses for site-name preference.
- **Organization:** identifies the existing HEIC2PNG publisher brand with its homepage and supplied logo. This does not assert incorporation, legal identity, an address, founder, staff count, credentials or company history.
- **WebPage:** describes each real indexable page with its actual title, description, language and canonical URL; links it to the shared site and publisher.
- **BlogPosting:** describes a published blog article, with its visible headline, existing collective author byline, existing publication/update days and canonical page. A separate inline Organization value preserves the visible “HEIC2PNG Editorial Team” byline; no Person or author profile is invented.
- **BreadcrumbList:** appears only on the ten article pages, where the existing breadcrumb navigation supports a genuine Home/Blog/article hierarchy.
- **SoftwareApplication:** evaluated but omitted because Google's app rich-result rating/review requirement cannot currently be satisfied honestly. This omission does not affect the converter software or its free availability.

The Organization and WebSite definitions repeat consistently across separate documents. Inside each document, they are defined once and referenced by stable @id values. This is shared identity, not competing duplicate schema blocks.

## Page-by-page implemented types

| Page/canonical URL | Before | Implemented top-level graph types | Reason |
| --- | --- | --- | --- |
| https://heic2png.site/ | WebSite, BreadcrumbList, SoftwareApplication, FAQPage | Organization, WebSite, WebPage | A page containing the working converter; site/publisher identity is shared. |
| 404.html and missing-route fallback | WebSite, BreadcrumbList | None | Noindex error response; no content or breadcrumb entity. |
| https://heic2png.site/about/ | WebSite, BreadcrumbList | Organization, WebSite, WebPage | Existing informational, policy or support page. |
| https://heic2png.site/blog/ | WebSite, BreadcrumbList, CollectionPage | Organization, WebSite, WebPage | Archive page listing the published guides. |
| https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic/ | WebSite, BreadcrumbList, Article | Organization, WebSite, WebPage, BlogPosting, BreadcrumbList | Published guide with a visible byline/date and a Home → Blog → Article path. |
| https://heic2png.site/contact/ | WebSite, BreadcrumbList | Organization, WebSite, WebPage | Existing informational, policy or support page. |
| https://heic2png.site/heic-to-avif/ | WebSite, BreadcrumbList, SoftwareApplication | Organization, WebSite, WebPage | A page containing the working converter; site/publisher identity is shared. |
| https://heic2png.site/heic-to-jpg/ | WebSite, BreadcrumbList, SoftwareApplication | Organization, WebSite, WebPage | A page containing the working converter; site/publisher identity is shared. |
| https://heic2png.site/privacy/ | WebSite, BreadcrumbList | Organization, WebSite, WebPage | Existing informational, policy or support page. |
| https://heic2png.site/terms/ | WebSite, BreadcrumbList | Organization, WebSite, WebPage | Existing informational, policy or support page. |

No schema is emitted for unpublished drafts or missing-route fallbacks. There are **18 indexable graphs**, one per page, and no JSON-LD block in the error document.

## URL identity and factual scope

Stable site-level IDs:

- https://heic2png.site/#organization
- https://heic2png.site/#website

Per-page WebPage IDs use the exact canonical followed by #webpage. Article and breadcrumb IDs use #article and #breadcrumb. Fragment IDs identify entities inside JSON-LD; they do not create new routes. WebPage.url, BlogPosting.url, mainEntityOfPage and breadcrumb item URLs use the same HTTPS, non-www, trailing-slash canonical helper as the page head and sitemap. The homepage URL on site/publisher entities correctly remains the homepage even on article pages.

The publisher logo is the existing https://heic2png.site/brand/heic2png-logo.png asset. Tests confirm the local PNG exists and both dimensions exceed Google's 112-pixel minimum. No logo was substituted as an article image.

Current articles use inline HTML illustrations and have no configured standalone article image URL. Their image property remains omitted. Author profile URL/sameAs is also omitted because no distinct real author profile is supplied. No review, rating, interaction/download count, company details, price or user statistic was added.

## Publication and modification dates

All article source files, bylines and visible dates are unchanged in this task. The collection records calendar days, not verified clock times. Schema now preserves that precision as YYYY-MM-DD rather than manufacturing a midnight publication time.

| Published article | datePublished | dateModified | Existing author retained |
| --- | --- | --- | --- |
| https://heic2png.site/blog/heic-to-jpg-vs-png-which-format-should-you-choose/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/heic-vs-png-quality-file-size-compatibility/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-convert-heic-images-for-website-uploads/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-on-iphone/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-convert-heic-to-jpg-without-losing-quality/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-mac/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-convert-heic-to-png-on-windows-11/ | 2026-10-14 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-fix-heic-files-that-wont-open/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/how-to-open-heic-files-on-windows-and-mac/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |
| https://heic2png.site/blog/why-does-my-iphone-save-photos-as-heic/ | 2026-10-23 | 2026-10-23 | HEIC2PNG Editorial Team |

The builder rejects invalid dates and an update that precedes publication. Local tests check schema dates against the source frontmatter. These checks preserve the project's recorded publication history; they do not independently reconstruct first-publication dates from external archives.

## Google-supported feature eligibility review

| Feature | Assessment against current official documentation |
| --- | --- |
| Site-name preference | Homepage WebSite includes name and canonical home URL. Consistent with existing branding; selection remains Google's decision. |
| Organization identity/logo | Existing publisher name, URL and actual logo are supplied. No merchant/local-business fields or knowledge-panel promise. |
| Article | BlogPosting is a supported Article subtype. Actual headline, author and dates are included. Google lists no required Article properties; representative image and a distinct author URL remain useful recommendations that cannot be fabricated here. |
| Breadcrumbs | Article lists have three named ListItems, consecutive positions and absolute canonical item URLs, exceeding the documented two-item minimum. |
| Software app | Not currently eligible: genuine review or aggregateRating is absent. SoftwareApplication was removed rather than adding false evidence. |
| FAQ | Google's current documentation says FAQ rich results stopped appearing on May 7, 2026. Existing FAQ markup was removed; the visible FAQ remains. |
| Generic WebPage | Accurate page description, not a dedicated guaranteed Google rich-result feature. |
| Error/draft pages | Noindex/404; not candidates for rich results and no schema is emitted. |

References used for this assessment:

- [Google site-name guidance](https://developers.google.com/search/docs/appearance/site-names)
- [Google Organization and logo guidance](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google supported Article types and recommendations](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google breadcrumb requirements](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google software-app rating/review requirement](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google FAQ rich-result deprecation updates](https://developers.google.com/search/updates)
- [Google publication-date guidance: time is optional](https://developers.google.com/search/docs/appearance/publication-dates)
- [Schema.org datePublished accepts Date or DateTime](https://schema.org/datePublished)

## Verification performed

- npm run check: passed.
- npm run build: passed; 19 static HTML documents and sitemap.xml.
- Focused Playwright run: **12 passed (9.4 seconds)**, including structured-data, article content/dates, canonical aliases, navigation and FAQ toggle behavior.
- Parsed every generated JSON-LD block with JSON.parse. Exactly one block on each of 18 indexable pages; none on the error document.
- Checked unique root entity IDs, resolved references, one WebPage per canonical, matching titles/descriptions, canonical URL forms, the source logo and article date/byline values.
- Verified that unsupported review/rating/statistic/price/company fields and FAQPage/SoftwareApplication/Offer/Person nodes are absent.
- Checked structured-data serialization escapes less-than signs so content cannot terminate its script element.
- All **19 body HTML hashes** match the pre-change build. Titles, descriptions and canonical URLs are also unchanged.
- Stylesheets, converter client/worker/encoder code, assets and article sources are unchanged from the start of this task. Build-only article anchor whitespace was restored to the exact pre-task source snapshots.
- git diff --check passed, with Git line-ending notices only.

Google eligibility was checked at the type/property level against the official documentation above. The hosted Google Rich Results Test and Search Console were **not** run, and no Googlebot crawl/indexing result is claimed. To check the new local output in the [Rich Results Test](https://search.google.com/test/rich-results), use its code mode with generated HTML; testing the live URL before deployment would inspect the older release. Deployment and later URL Inspection remain separate actions.

## Files changed in this task

- src/lib/structured-data.mjs: shared graph builder, factual date handling and safe serializer.
- src/pages/[...path].astro: replace old schema construction with one graph; skip noindex error schema.
- tests/structured-data.spec.ts: generated graphs, references, facts, error exclusions and serializer validation.
- tests/blog.spec.ts: expect BlogPosting and calendar-day publication/update precision.
- tests/converter-content.spec.ts: verify visible FAQ behavior while asserting absence of FAQ rich-result markup.
- STRUCTURED_DATA_REPORT.md: this audit, per-page types and eligibility assessment.

No UI, article wording, converter behavior, route, sitemap, server configuration or deployment was changed by this task. Earlier workspace changes were preserved.

