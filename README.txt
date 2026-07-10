THIBAULT VERRUE - PORTFOLIO
===========================

Plain HTML + CSS + a little JS, plus tsParticles for the animated
neural-network background (loaded from CDN, no build step).
Open index.html in a browser, or host on GitHub Pages / Netlify.

FILES
-----
index.html                    Homepage (hero, featured projects, skills, contact)
projects.html                 All projects grid + contact
project-detail-template.html  Blank template for a new project page
project-*.html                Filled-in project pages
about.html                    Experience timeline, education, languages, CV link
styles.css                    All styling (colors/fonts at the top in :root)
main.js                       Theme toggle, tsParticles config, scroll progress,
                              mobile menu, scroll animations, rail scroller

WHAT TO DROP IN
---------------
media/                          Screenshots, portrait, videos. Paths already
                              wired up in the pages:
                                media/portrait.jpeg          (index.html)
                                media/cluma_project.png      (RAG assistant thumbnail)
                                media/auto-recycler-demo.mp4 (Auto Recycler demo video)

media/cv.pdf                  Your CV. The "Download CV" buttons across the
                              site link to this path.

FEATURES
--------
- Dark / light theme with a header toggle (persists in localStorage,
  respects prefers-color-scheme on first visit)
- Animated neural-network particle background (tsParticles slim from CDN)
- Scroll progress bar at the very top of the viewport
- SVG favicon shaped like the site's detection-frame corners
- Open Graph + Twitter Card meta tags on every page for nice link previews
- Fade hints on both edges of the project rails when scrolled
- Reveal-on-scroll animations (respects prefers-reduced-motion)

ADD A NEW PROJECT (2 steps)
---------------------------
1. Duplicate project-detail-template.html, rename it (e.g. project-mycoolapp.html)
   and fill in the numbered comments (title, meta grid, write-up, images).
2. In projects.html, copy the block between <!-- CARD START --> and <!-- CARD END -->,
   paste it, and update the link, label, title, description and tags.
   Optionally add the same card to the "Featured projects" section on index.html.

ADD IMAGES / VIDEO
------------------
Drop new files into media/. In cards, replace the placeholder comment inside .thumb with:
  <img src="media/your-image.jpg" alt="Short description">
On project pages, replace <div class="ph mono">...</div> inside .figure with either
an <img> or, for a demo clip:
  <video controls preload="metadata" playsinline>
    <source src="media/your-clip.mp4" type="video/mp4" />
  </video>

CHANGE THE LOOK
---------------
All colors and fonts are CSS variables at the top of styles.css (:root).
Dark theme overrides live in :root[data-theme="dark"].
Change --accent to recolor every bounding box, label, link AND the particle
network in one line (the JS reads it back at runtime).

TWEAK THE PARTICLE BACKGROUND
-----------------------------
Open main.js, find the initParticles() block. Notable knobs:
  particles.number.value    how many nodes on screen (currently 55)
  particles.move.speed      drift speed (currently 0.6)
  particles.links.distance  max distance to draw a connection line
  interactivity.modes.grab  hover behavior

If you don't want particles at all, delete the two tsParticles-related
elements from each page (the CDN <script> and the <div id="tsparticles">).
