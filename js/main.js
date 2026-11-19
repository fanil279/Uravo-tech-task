'use strict';

const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const submenuToggles = navigation.querySelectorAll('.submenu-toggle');
const mobileViewport = window.matchMedia('(max-width: 768px)');
const wideTabletViewport = window.matchMedia('(768px < width < 1280px)');
const hero = document.querySelector('.hero');

function syncHeaderScrollState() {
	const pastHero = wideTabletViewport.matches
		? hero.getBoundingClientRect().bottom <= siteHeader.offsetHeight
		: window.scrollY > 780;
	siteHeader.classList.toggle('is-scrolled', pastHero);
}

window.addEventListener('scroll', syncHeaderScrollState, { passive: true });
window.addEventListener('resize', syncHeaderScrollState);
window.addEventListener('pageshow', syncHeaderScrollState);
syncHeaderScrollState();

function setMenuOpen(open, returnFocus = false) {
	menuToggle.setAttribute('aria-expanded', String(open));
	menuToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');

	navigation.classList.toggle('is-open', open);
	document.body.classList.toggle('menu-open', open);

	if (!open) {
		submenuToggles.forEach((button) => setSubmenuOpen(button, false));
	}

	if (returnFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
	setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

function setSubmenuOpen(button, open) {
	button.setAttribute('aria-expanded', String(open));
	button.textContent = open ? '−' : '+';
	button.setAttribute(
		'aria-label',
		button.getAttribute('aria-label').replace(/(?:開く|閉じる)$/, open ? '閉じる' : '開く')
	);
	document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
}

submenuToggles.forEach((button) => {
	button.addEventListener('click', () => {
		setSubmenuOpen(button, button.getAttribute('aria-expanded') !== 'true');
	});
});

siteHeader.addEventListener('click', (event) => {
	if (event.target.closest('a') && menuToggle.getAttribute('aria-expanded') === 'true') {
		setMenuOpen(false);
	}
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

document.querySelectorAll('.footer-toggle').forEach((button) => {
	button.addEventListener('click', () => {
		const expanded = button.getAttribute('aria-expanded') === 'true';
		button.setAttribute('aria-expanded', String(!expanded));
	});
	button.hidden = false;
});

const logoTrack = document.querySelector('.logo-slider-track');
if (logoTrack) {
	logoTrack.append(logoTrack.firstElementChild.cloneNode(true));
	logoTrack.classList.add('is-looping');
}

const memberSlider = document.querySelector('.member-slider');
if (memberSlider) {
	const track = memberSlider.querySelector('.member-track');
	const viewport = memberSlider.querySelector('.member-viewport');
	const previous = memberSlider.querySelector('.member-prev');
	const next = memberSlider.querySelector('.member-next');
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	let pending = Promise.resolve();
	let animation;
	let swipe;

	track.prepend(track.lastElementChild);
	track.classList.add('is-looping');

	function move(direction) {
		pending = pending.then(async () => {
			if (!reducedMotion.matches) {
				animation = track.animate(
					[
						{ transform: 'translateX(0)' },
						{ transform: `translateX(calc(${-direction} * var(--member-step)))` }
					],
					{ duration: 300, easing: 'ease-out', fill: 'forwards' }
				);
				await animation.finished;
			}

			if (direction > 0) {
				track.append(track.firstElementChild);
			} else {
				track.prepend(track.lastElementChild);
			}
			animation?.cancel();
			animation = undefined;
		});
	}

	reducedMotion.addEventListener('change', () => {
		if (reducedMotion.matches) animation?.finish();
	});

	previous.addEventListener('click', () => move(-1));
	next.addEventListener('click', () => move(1));

	memberSlider.addEventListener('keydown', (event) => {
		if (event.target !== previous && event.target !== next) return;
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		move(event.key === 'ArrowLeft' ? -1 : 1);
	});

    viewport.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary) return;

        const isTouch = event.pointerType === 'touch';
        const isMouseDrag =
            event.pointerType === 'mouse' && event.button === 0 && mobileViewport.matches;
        if (!isTouch && !isMouseDrag) return;

        swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
        viewport.setPointerCapture(event.pointerId);
    });

	viewport.addEventListener('pointerup', (event) => {
		if (event.pointerId !== swipe?.id) return;
		const x = event.clientX - swipe.x;
		const y = event.clientY - swipe.y;
		swipe = undefined;
		if (Math.abs(x) >= 35 && Math.abs(x) > Math.abs(y)) move(x < 0 ? 1 : -1);
	});

	viewport.addEventListener('pointercancel', (event) => {
		if (event.pointerId === swipe?.id) swipe = undefined;
	});
}
