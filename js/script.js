/* ============================================================
   script.js — Viola Sanyan Portfolio
   All interactive behaviour in one file.
   ============================================================ */

/* ============================================================
   1. LIGHT / DARK THEME
   Remembers the choice in localStorage. If there is no saved
   choice, it follows the visitor's system setting.
   ============================================================ */
const root        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function getSavedTheme() {
    // localStorage can throw in private windows, so wrap it in try/catch
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
}

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
root.dataset.theme = getSavedTheme() || (prefersLight ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* ignore */ }
    refreshParticleColors(); // the canvas needs the new colours too
});


/* ============================================================
   2. TYPEWRITER
   Cycles through the things Viola works on (after "focused on →").
   ============================================================ */
// The words come from js/i18n.js, so they follow the chosen language
const getRoles = () => window.i18n.t('hero.roles');

let roleIndex  = 0;     // which word we're on
let charIndex  = 0;     // how many characters are typed so far
let isDeleting = false;

const typewriterEl = document.getElementById('typewriter');

function runTypewriter() {
    const roles = getRoles();
    roleIndex %= roles.length;
    const currentRole = roles[roleIndex];

    // Add or remove one character
    charIndex += isDeleting ? -1 : 1;
    typewriterEl.textContent = currentRole.slice(0, charIndex);

    // Finished typing: pause, then start deleting
    if (!isDeleting && charIndex >= currentRole.length) {
        isDeleting = true;
        setTimeout(runTypewriter, 2000);
        return;
    }

    // Finished deleting: move to the next word
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }

    // Typing is slower than deleting (feels more natural)
    setTimeout(runTypewriter, isDeleting ? 45 : 95);
}

setTimeout(runTypewriter, 700);


/* ============================================================
   3. PARTICLE HERO
   Hundreds of small particles fly into a shape. The mouse pushes
   them away, and clicking scatters them into the next shape:
     my portrait in 0s and 1s  ->  capsule (pharmacy)
     ->  </> (code)  ->  "vs" (me)

   How it works:
   - We draw each shape on a hidden canvas.
   - We look at its pixels and keep a grid of points that
     are coloured in. Those points are the particles' "targets".
   - Every frame, each particle is pulled towards its target
     like a spring, and pushed away from the mouse.
   - For the portrait, the particles are drawn as 0s and 1s
     instead of dots, and a few of them flip every frame.
   ============================================================ */
const canvas  = document.getElementById('particles');
const ctx     = canvas.getContext('2d');
const heroArt = document.getElementById('heroArt');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


let size      = 0;          // canvas width/height in CSS pixels (it's square)
let particles = [];         // { x, y, vx, vy, tx, ty, group, r, bit }
let colors    = ['#fff', '#fff'];
let shapeIndex = 0;
let running   = false;
let useDigits = true;       // true while the portrait is showing
let digitSprites = [];      // pre-drawn "0" and "1" images, see makeDigitSprites()
const mouse   = { x: -9999, y: -9999 };

// The sketch is only used as a guide: it is never shown on the page.
// It comes from js/portrait-data.js (the sketch stored as text), so its
// pixels can be read even when index.html is opened straight from the disk.
const portrait = new Image();
portrait.src = PORTRAIT_SRC;

// Draw the sketch onto a hidden square canvas and return its pixels.
function portraitPixels() {
    const off = document.createElement('canvas');
    off.width = off.height = size;
    const offCtx = off.getContext('2d');

    // Fit the picture inside the square, centred, a little smaller
    // so it doesn't touch the hint text underneath
    const h = size * 0.94;
    const w = h * (portrait.width / portrait.height);
    offCtx.fillStyle = '#fff';
    offCtx.fillRect(0, 0, size, size);
    offCtx.drawImage(portrait, (size - w) / 2, 0, w, h);

    const data = offCtx.getImageData(0, 0, size, size).data;
    // Keep only the brightness of each pixel, from 0 (black) to 1 (white)
    const light = new Float32Array(size * size);
    for (let i = 0; i < light.length; i++) {
        light[i] = (data[i * 4] * 0.3 + data[i * 4 + 1] * 0.59 + data[i * 4 + 2] * 0.11) / 255;
    }
    return { light, height: h, left: (size - w) / 2, scale: h / portrait.height };
}

// Blur the brightness values ourselves (a box blur run twice ≈ a soft blur).
// We don't use the canvas `filter = 'blur()'` setting because iPhone Safari
// ignores it, and then the portrait came out empty on iPhones.
function blurLight(light, radius) {
    let src = light;
    for (let pass = 0; pass < 2; pass++) {
        src = boxBlur(src, radius, true);    // left ↔ right
        src = boxBlur(src, radius, false);   // up ↕ down
    }
    return src;
}

// Average every value with its neighbours within `radius`, along one direction.
// A running sum keeps it fast: add the value entering the window, drop the one leaving it.
function boxBlur(src, radius, horizontal) {
    const out = new Float32Array(src.length);
    const width = radius * 2 + 1;
    for (let line = 0; line < size; line++) {
        const at = i => horizontal ? line * size + i : i * size + line;
        let sum = 0;
        // Start with the window around position 0 (edges repeat the border value)
        for (let i = -radius; i <= radius; i++) sum += src[at(Math.min(size - 1, Math.max(0, i)))];
        for (let i = 0; i < size; i++) {
            out[at(i)] = sum / width;
            sum += src[at(Math.min(size - 1, i + radius + 1))] - src[at(Math.max(0, i - radius))];
        }
    }
    return out;
}

// Two areas of the sketch get special treatment, measured in pixels
// of the half-size sketch in portrait-data.js, 533x640
// (centre x/y and half-width/half-height).
const NOSE  = { x: 227.5, y: 236, rx: 26, ry: 15 };   // made smaller
const SMILE = { x: 247.5, y: 261, rx: 44, ry: 21 };   // made softer

// Is the point (sx, sy) inside this oval area?
function inArea(area, sx, sy) {
    const dx = (sx - area.x) / area.rx;
    const dy = (sy - area.y) / area.ry;
    return dx * dx + dy * dy < 1;
}

// Turn the sketch into target points, like a pencil OUTLINE:
// a pixel counts as a line when it is darker than the area around it
// (sharp pixel vs. blurred copy). That picks up the glasses, eyes,
// smile and the curls, without filling the dark hair with a solid block.
function samplePortrait() {
    const sharp   = portraitPixels();
    const blurred = { light: blurLight(sharp.light, 3) };
    const gap     = Math.max(4, Math.round(size / 125));  // distance between digits
    const points  = [];

    for (let y = 0; y < sharp.height - gap * 2; y += gap) {
        for (let x = 0; x < size - gap; x += gap) {
            // Find the strongest line anywhere inside this little square,
            // so thin lines between grid points aren't missed
            let line = 0;
            for (let j = 0; j < gap; j++) {
                for (let i = 0; i < gap; i++) {
                    const k = (y + j) * size + (x + i);
                    line = Math.max(line, blurred.light[k] - sharp.light[k]);
                }
            }

            if (line > 0.10 + Math.random() * 0.08) {
                // Lines on light skin (face) = accent colour, lines in the hair = second colour
                const onSkin = blurred.light[y * size + x] > 0.55;
                const point  = { x, y, group: onSkin ? 0 : 1 };

                // Where is this point on the original sketch?
                const sx = (x - sharp.left) / sharp.scale;
                const sy = y / sharp.scale;

                // Nose: keep fewer digits and pull them towards the centre (smaller nose).
                // Only skin lines, so the glasses next to it stay untouched.
                if (onSkin && inArea(NOSE, sx, sy)) {
                    if (Math.random() < 0.4) continue;
                    const cx = NOSE.x * sharp.scale + sharp.left;
                    const cy = NOSE.y * sharp.scale;
                    point.x = cx + (x - cx) * 0.7;
                    point.y = cy + (y - cy) * 0.7;
                }

                // Smile: keep only a few digits, drawn faded
                if (inArea(SMILE, sx, sy)) {
                    if (Math.random() < 0.6) continue;
                    point.faint = true;
                }

                points.push(point);
            }
        }
    }
    return points;
}

// Drawing text is slow, so we draw "0" and "1" once per colour
// into small canvases, then copy those (drawImage is fast).
function makeDigitSprites() {
    const fontSize = Math.max(6, Math.round(size / 85));
    const dpr = window.devicePixelRatio || 1;

    digitSprites = colors.map(color => ['0', '1'].map(digit => {
        const c = document.createElement('canvas');
        c.width  = Math.ceil(fontSize * 0.7 * dpr);
        c.height = Math.ceil(fontSize * dpr);
        const cctx = c.getContext('2d');
        cctx.scale(dpr, dpr);
        cctx.font = `500 ${fontSize}px "JetBrains Mono", monospace`;
        cctx.fillStyle = color;
        cctx.textAlign = 'center';
        cctx.textBaseline = 'middle';
        cctx.fillText(digit, fontSize * 0.35, fontSize * 0.5);
        return { canvas: c, w: c.width / dpr, h: c.height / dpr };
    }));
}

// Each shape function draws on the hidden canvas.
// Red pixels become group 0 (accent colour), blue pixels group 1 (second colour).
// The portrait is special: it has its own sampler (samplePortrait above).
const shapes = [
    'portrait',
    // A capsule pill, tilted
    function capsule(c, s) {
        c.save();
        c.translate(s / 2, s / 2);
        c.rotate(-Math.PI / 5);
        const w = s * 0.78, h = s * 0.32;
        c.beginPath();
        c.roundRect(-w / 2, -h / 2, w, h, h / 2);
        c.clip();
        c.fillStyle = '#f00'; c.fillRect(-w / 2, -h / 2, w / 2, h);
        c.fillStyle = '#00f'; c.fillRect(0, -h / 2, w / 2, h);
        c.restore();
    },
    // Code brackets
    function code(c, s) {
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = `800 ${s * 0.42}px "Bricolage Grotesque", sans-serif`;
        c.fillStyle = '#00f'; c.fillText('<', s * 0.2, s * 0.5);
        c.fillStyle = '#f00'; c.fillText('/', s * 0.5, s * 0.5);
        c.fillStyle = '#00f'; c.fillText('>', s * 0.8, s * 0.5);
    },
    // Initials
    function initials(c, s) {
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = `800 ${s * 0.55}px "Bricolage Grotesque", sans-serif`;
        c.fillStyle = '#f00'; c.fillText('vs', s * 0.47, s * 0.44);
        c.fillStyle = '#00f'; c.fillText('.', s * 0.8, s * 0.44);
    },
];

// Turn a shape into a list of target points
function sampleShape(drawFn) {
    const off = document.createElement('canvas');
    off.width = off.height = size;
    const offCtx = off.getContext('2d');
    drawFn(offCtx, size);

    const data = offCtx.getImageData(0, 0, size, size).data;
    const gap  = Math.max(5, Math.round(size / 75));  // distance between dots
    const points = [];

    for (let y = 0; y < size; y += gap) {
        for (let x = 0; x < size; x += gap) {
            const i = (y * size + x) * 4;          // each pixel = 4 numbers (r, g, b, alpha)
            if (data[i + 3] > 128) {
                points.push({ x, y, group: data[i] > 128 ? 0 : 1 });
            }
        }
    }
    return points;
}

// Give every particle a new target. Add or reuse particles if the count changes.
function setShape(index) {
    useDigits = shapes[index] === 'portrait';
    let points;
    try {
        points = useDigits ? samplePortrait() : sampleShape(shapes[index]);
    } catch (e) {
        // Safety net: if the sketch's pixels can't be read for any reason,
        // skip the portrait and show the other shapes.
        shapes.shift();
        return setShape(shapeIndex = 0);
    }

    // Shuffle so dots travel in a nice mixed-up way
    points.sort(() => Math.random() - 0.5);

    while (particles.length < points.length) {
        particles.push({
            x: Math.random() * size, y: Math.random() * size,
            vx: 0, vy: 0, r: 1 + Math.random() * 1.6,
            bit: Math.random() < 0.5 ? 0 : 1,
        });
    }

    particles.forEach((p, i) => {
        // If there are more particles than points, extra ones share a point
        const pt = points[i % points.length];
        p.tx = pt.x + (Math.random() - 0.5) * 3;
        p.ty = pt.y + (Math.random() - 0.5) * 3;
        p.group = pt.group;
        p.faint = pt.faint || false;
    });
}

function refreshParticleColors() {
    const styles = getComputedStyle(root);
    colors = [
        styles.getPropertyValue('--accent').trim(),
        styles.getPropertyValue('--accent-2').trim(),
    ];
    if (size) makeDigitSprites();
    if (reduceMotion) drawParticles();
}

// Match the canvas to its box (and to retina screens)
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    size = Math.round(heroArt.clientWidth);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeDigitSprites();
    setShape(shapeIndex);
}

function updateParticles() {
    const radius = size * 0.14;  // how far the mouse "pushes"

    particles.forEach(p => {
        // Spring towards the target
        p.vx += (p.tx - p.x) * 0.012;
        p.vy += (p.ty - p.y) * 0.012;

        // Push away from the mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius && dist > 0) {
            const force = (radius - dist) / radius;
            p.vx += (dx / dist) * force * 2.8;
            p.vy += (dy / dist) * force * 2.8;
        }

        // Friction, so they settle down
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x  += p.vx;
        p.y  += p.vy;
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, size, size);

    // Portrait: draw each particle as a 0 or a 1
    if (useDigits) {
        particles.forEach(p => {
            // Now and then a digit flips, so the picture looks like it's "computing"
            if (Math.random() < 0.004) p.bit = 1 - p.bit;
            const sprite = digitSprites[p.group][p.bit];
            ctx.globalAlpha = p.faint ? 0.35 : 1;   // faded digits for the smile
            ctx.drawImage(sprite.canvas, p.x - sprite.w / 2, p.y - sprite.h / 2, sprite.w, sprite.h);
        });
        ctx.globalAlpha = 1;
        return;
    }

    // Other shapes: draw one colour group at a time (faster than switching colour per dot)
    [0, 1].forEach(group => {
        ctx.fillStyle = colors[group];
        ctx.beginPath();
        particles.forEach(p => {
            if (p.group !== group) return;
            ctx.moveTo(p.x + p.r, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        });
        ctx.fill();
    });
}

function loop() {
    if (!running) return;
    updateParticles();
    drawParticles();
    requestAnimationFrame(loop);
}

// Mouse / touch position relative to the canvas
canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

// Click: explode, then form the next shape
canvas.addEventListener('click', () => {
    particles.forEach(p => {
        p.vx += (Math.random() - 0.5) * 40;
        p.vy += (Math.random() - 0.5) * 40;
    });
    shapeIndex = (shapeIndex + 1) % shapes.length;
    setTimeout(() => setShape(shapeIndex), 350);
    if (reduceMotion) { setShape(shapeIndex); snapToTargets(); }
});

function snapToTargets() {
    particles.forEach(p => { p.x = p.tx; p.y = p.ty; });
    drawParticles();
}

// Only animate while the hero is on screen (saves battery)
const heroObserver = new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting;
    if (visible && !running && !reduceMotion) { running = true; loop(); }
    if (!visible) running = false;
});

// Wait for the fonts (otherwise the text shapes are drawn in a fallback font)
// and for the sketch to load. If the sketch is missing, skip the portrait.
const portraitReady = new Promise(resolve => {
    portrait.onload  = resolve;
    portrait.onerror = () => { shapes.shift(); resolve(); };
    if (portrait.complete && portrait.naturalWidth) resolve();
});

Promise.all([document.fonts.ready, portraitReady]).then(() => {
    refreshParticleColors();
    resizeCanvas();
    if (reduceMotion) snapToTargets();
    heroObserver.observe(heroArt);
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeCanvas(); if (reduceMotion) snapToTargets(); }, 200);
});


/* ============================================================
   4. MOBILE NAVIGATION
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close the menu when a link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});


/* ============================================================
   5. NAVBAR ON SCROLL
   - Background appears after scrolling a little.
   - The link for the section you're looking at is highlighted.
   ============================================================ */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const allLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    const scrollPos = window.scrollY + 140;
    sections.forEach(section => {
        if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            allLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
            });
        }
    });
});


/* ============================================================
   6. JOURNEY TABS
   Clicking a milestone shows its panel.
   ============================================================ */
const journeyTabs   = document.querySelectorAll('.journey-tab');
const journeyPanels = document.querySelectorAll('.journey-panel');

journeyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const step = Number(tab.dataset.step);

        journeyTabs.forEach((t, i) => {
            t.classList.toggle('active', i === step);
            t.setAttribute('aria-selected', i === step);
        });
        journeyPanels.forEach((panel, i) => {
            panel.classList.toggle('active', i === step);
        });
    });
});


/* ============================================================
   7. PROJECT CARD GLOW
   Tells the CSS where the mouse is inside a card, so the
   soft light (.project-card::before) follows it.
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});


/* ============================================================
   8. COPY EMAIL
   ============================================================ */
const copyBtn  = document.getElementById('copyEmail');
const copyHint = document.getElementById('copyHint');

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(copyBtn.dataset.email);
        copyHint.textContent = window.i18n.t('contact.copied');
        copyBtn.classList.add('copied');
    } catch (e) {
        // Clipboard can be blocked (e.g. on http://), so fall back to opening the mail app
        window.location.href = `mailto:${copyBtn.dataset.email}`;
    }
    setTimeout(() => {
        copyHint.textContent = window.i18n.t('contact.copyHint');
        copyBtn.classList.remove('copied');
    }, 2000);
});




/* ============================================================
   10. REVEAL ON SCROLL
   IntersectionObserver tells us when an element comes into
   view; then CSS fades it in. Each one animates only once.
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============================================================
   11. CAPSULE IN THE ABOUT SECTION
   Hover (or tap on phones) opens the capsule and 0s and 1s
   spill out. While it's open, a few digits flip every moment,
   like in the portrait at the top.
   ============================================================ */
const aboutPhoto = document.getElementById('aboutPhoto');
const pillBits   = document.getElementById('pillBits');
const bitColors  = ['var(--accent)', 'var(--accent-2)', 'var(--text)'];
const bits = [];

for (let i = 0; i < 22; i++) {
    const bit = document.createElement('span');
    bit.className = 'pill-bit';
    bit.textContent = Math.random() < 0.5 ? '0' : '1';

    // A random spot in the gap between the two halves (in px, from the
    // centre of the blob). The capsule is tilted 40°, so the gap runs
    // from top-left to bottom-right: "across" follows the gap, "along"
    // spreads the digits a little towards the halves.
    const across = (i / 21 - 0.5) * 250 + (Math.random() - 0.5) * 14; // evenly spaced
    const along  = (Math.random() - 0.5) * 70;
    const tilt   = 40 * Math.PI / 180;
    bit.style.setProperty('--x', `${across * Math.sin(tilt) + along * Math.cos(tilt)}px`);
    bit.style.setProperty('--y', `${across * Math.cos(tilt) - along * Math.sin(tilt)}px`);
    bit.style.setProperty('--o', (0.55 + Math.random() * 0.45).toFixed(2));
    bit.style.fontSize = `${12 + Math.random() * 14}px`;
    bit.style.color = bitColors[i % bitColors.length];
    bit.style.transitionDelay = `${i * 18}ms`; // one after another

    pillBits.append(bit);
    bits.push(bit);
}

let flipTimer = null;

function setPillOpen(open) {
    aboutPhoto.classList.toggle('open', open);
    clearInterval(flipTimer);
    if (open) {
        flipTimer = setInterval(() => {
            const bit = bits[Math.floor(Math.random() * bits.length)];
            bit.textContent = bit.textContent === '0' ? '1' : '0';
        }, 120);
    }
}

// Mouse: open while hovering. Touch: each tap opens / closes it.
aboutPhoto.addEventListener('mouseenter', () => setPillOpen(true));
aboutPhoto.addEventListener('mouseleave', () => setPillOpen(false));
aboutPhoto.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
        setPillOpen(!aboutPhoto.classList.contains('open'));
    }
});
