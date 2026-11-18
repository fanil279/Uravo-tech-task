'use strict';

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const mobileViewport = window.matchMedia('(max-width: 768px)');

function syncHeaderScrollState() {
	siteHeader.classList.toggle('is-scrolled', window.scrollY > 780);
}

window.addEventListener('scroll', syncHeaderScrollState, { passive: true });
window.addEventListener('pageshow', syncHeaderScrollState);
syncHeaderScrollState();

function setMenuOpen(open, returnFocus = false) {
	menuToggle.setAttribute('aria-expanded', String(open));
	menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');

	navigation.classList.toggle('is-open', open);
	document.body.classList.toggle('menu-open', open);

	if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
	setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.querySelectorAll('.submenu-toggle').forEach((button) => {
	button.addEventListener('click', () => {
		const expanded = button.getAttribute('aria-expanded') !== 'true';

		button.setAttribute('aria-expanded', String(expanded));
		button.textContent = expanded ? '−' : '+';
		button.setAttribute(
			'aria-label',
			button.getAttribute('aria-label').replace(
				expanded ? '開く' : '閉じる',
				expanded ? '閉じる' : '開く'
			)
		);

		document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
	});
});

navigation.addEventListener('click', (event) => {
	if (event.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
	if (menuToggle.getAttribute('aria-expanded') !== 'true') return;
	if (event.key === 'Escape') setMenuOpen(false, true);
	if (event.key !== 'Tab') return;

	const items = [menuToggle, ...navigation.querySelectorAll('a, button')].filter(
		(item) => item.getClientRects().length
	);
	const first = items[0];
	const last = items[items.length - 1];

	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
});

mobileViewport.addEventListener('change', () => setMenuOpen(false));

const logoTrack = document.querySelector('.logo-slider-track');
if (logoTrack) {
	logoTrack.append(logoTrack.firstElementChild.cloneNode(true));
	logoTrack.classList.add('is-looping');
}
