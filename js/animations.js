if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, animations disabled');
        makeContentVisible();
        return;
    }

    initThemeSwitcher();
    initHeaderTransition();
    initPageIntro();
    initStaggerAnimations();
    initHoverAnimations();
    initSectionReveals();
    initAboutAnimation();
});

function makeContentVisible() {
    const elements = document.querySelectorAll('.service-card, .skill-card, .project-card, .certificate-card, .timeline-item');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

function initThemeSwitcher() {
    const hero = document.querySelector('.hero');
    const header = document.querySelector('.header');
    if (!hero) return;

    // Start with light header
    if (header) header.classList.add('light-header');

    // ScrollTrigger for header theme ONLY (body is always dark)
    ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top+=24',
        end: '+=1',
        onEnter: () => {
            // Only toggle header, body stays dark
            if (header) header.classList.remove('light-header');
        },
        onLeaveBack: () => {
            // Only toggle header, body stays dark
            if (header) header.classList.add('light-header');
        }
    });
}

function initHeaderTransition() {
    // Header transition now handled by initThemeSwitcher for synchronization
    // This function kept for backwards compatibility but does nothing
}

function initPageIntro() {
    const tl = gsap.timeline();

    tl.from('.header', {
        y: -12,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
    })
        .from('.hero__tag', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.hero__heading-line', {
            y: 100,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.2')
        .from('.hero__description', {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4')
        .fromTo('.hero__cta',
            {
                y: 20,
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                clearProps: 'opacity,transform'
            }, '-=0.3');
}


function initStaggerAnimations() {
    const staggerSections = [
        { selector: '.service-card', stagger: 0.1 },
        { selector: '.skill-card', stagger: 0.08 },
        { selector: '.project-card', stagger: 0.15 },
        { selector: '.certificate-card', stagger: 0.1 },
        { selector: '.timeline-item', stagger: 0.12 }
    ];

    staggerSections.forEach(({ selector, stagger }) => {
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) return;

        gsap.set(elements, { opacity: 0, y: 60 });

        ScrollTrigger.create({
            trigger: elements[0].closest('section') || elements[0].parentElement,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                gsap.to(elements, {
                    y: 0,
                    opacity: 1,
                    stagger: stagger,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }
        });
    });
}

function initHoverAnimations() {
    const cards = document.querySelectorAll('.service-card, .project-card, .certificate-card, .skill-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

function initSectionReveals() {
    const sections = document.querySelectorAll('section:not(.hero)');

    sections.forEach(section => {
        const heading = section.querySelector('.section-heading');
        const tag = section.querySelector('.section-tag');

        if (heading) gsap.set(heading, { opacity: 0, y: 40 });
        if (tag) gsap.set(tag, { opacity: 0, x: -32 });

        ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();

                if (tag) {
                    tl.to(tag, {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }

                if (heading) {
                    tl.to(heading, {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'power3.out'
                    }, '-=0.4');
                }
            }
        });
    });
}

function initAboutAnimation() {
    const aboutHeading = document.querySelector('.about__heading');
    const aboutText = document.querySelector('.about__text');

    if (!aboutHeading && !aboutText) return;

    // Set initial states
    if (aboutHeading) gsap.set(aboutHeading, { opacity: 0, x: -40 });
    if (aboutText) gsap.set(aboutText, { opacity: 0, x: 40 });

    ScrollTrigger.create({
        trigger: '.about',
        start: 'top 80%',
        once: true,
        onEnter: () => {
            const tl = gsap.timeline();

            if (aboutHeading) {
                tl.to(aboutHeading, {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }

            if (aboutText) {
                tl.to(aboutText, {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                }, '-=0.6');
            }
        }
    });
}
