document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP/ScrollTrigger not loaded, scroll interactions disabled');
        return;
    }

    initParallaxEffects();
    initProgressAnimations();
});

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;

        gsap.to(element, {
            y: () => -(element.offsetHeight * speed),
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        gsap.to('.hero__container', {
            y: 100,
            opacity: 0.8,
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
}

function initProgressAnimations() {
    const progressBars = document.querySelectorAll('[data-progress]');

    progressBars.forEach(bar => {
        const progress = parseFloat(bar.dataset.progress) || 100;

        gsap.to(bar, {
            scaleX: progress / 100,
            transformOrigin: 'left center',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.counter);

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
                    }
                });
            },
            once: true
        });
    });
}
