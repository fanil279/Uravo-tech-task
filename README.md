# Uラボ

Landing page built from the Figma design, using plain HTML, CSS and JavaScript. No build step, no dependencies. Just open `index.html` in a browser.

The font (Shippori Mincho) loads from Google Fonts. If you're offline it falls back to a system serif, so the text looks a bit different.

## Structure

- `index.html` – the whole page
- `css/` – `base.css` has the colors, fonts and resets, `components.css` has the pieces used in several places (View More button, section titles, tags). Every section has its own file.
- `js/main.js` – header scroll state, mobile menu, logo slider, member slider and footer accordion
- `images/` – everything the page uses

## Things I decided

**Links.** The design only has one page, so every nav link, footer link and View More button scrolls to a section on the page. The privacy policy link is just a placeholder (`#`) because there's no page for it in the design.

**View More buttons** are `<a>` tags styled as buttons, since they navigate somewhere. Real `<button>` elements are only used for things that don't navigate: the hamburger, the accordions and the slider arrows.

**Header.** It's fixed, so the page uses `scroll-padding-top` to keep sections from hiding under it. On mobile the menu closes before the page scrolls, otherwise the scroll lock blocks the jump.

**Sliders.** The logo slider scrolls on its own. The member slider moves with the arrows on desktop and with swipe on mobile, like the design.

**Breakpoints.** The mobile layout is 768px and below, in both the CSS and the JS. There's no tablet design, so the in-between sizes are my own adaptation of the desktop and mobile layouts.

**Motion.** If the browser is set to reduce motion, the logo slider stops and the transitions are skipped.
