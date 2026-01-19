class Lenis {
    constructor(options = {}) {
        this.options = {
            duration: options.duration || 1.2,
            easing: options.easing || (t => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
            smooth: options.smooth !== false,
            ...options
        };

        this.animationFrame = null;
        this.isScrolling = false;
        this.isStopped = false;
        this.targetScroll = 0;
        this.currentScroll = window.scrollY;

        if (this.options.smooth) {
            this.initSmoothScroll();
        }
    }

    initSmoothScroll() {
        this.update = this.update.bind(this);
        this.animationFrame = requestAnimationFrame(this.update);

        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        window.addEventListener('scroll', this.onScroll.bind(this));
    }

    onWheel(e) {
        if (this.isStopped) return;

        this.targetScroll += e.deltaY;
        this.targetScroll = Math.max(0, Math.min(this.targetScroll, document.documentElement.scrollHeight - window.innerHeight));

        this.isScrolling = true;
    }

    onScroll() {
        if (!this.isScrolling) {
            this.currentScroll = window.scrollY;
            this.targetScroll = window.scrollY;
        }
    }

    update() {
        if (!this.isStopped) {
            const delta = this.targetScroll - this.currentScroll;
            this.currentScroll += delta * 0.1;

            if (Math.abs(delta) > 0.5) {
                window.scrollTo(0, this.currentScroll);
            } else {
                this.isScrolling = false;
            }
        }

        this.animationFrame = requestAnimationFrame(this.update);
    }

    scrollTo(target, options = {}) {
        if (this.isStopped) return;

        let targetY = 0;

        if (typeof target === 'number') {
            targetY = target;
        } else if (typeof target === 'string') {
            const element = document.querySelector(target);
            if (element) {
                targetY = element.offsetTop;
            }
        } else if (target instanceof Element) {
            targetY = target.offsetTop;
        }

        if (options.offset) {
            targetY += options.offset;
        }

        this.targetScroll = targetY;
        this.isScrolling = true;
    }

    stop() {
        this.isStopped = true;
    }

    start() {
        this.isStopped = false;
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.lenis = new Lenis({
        duration: 1.2,
        smooth: true
    });

    if (typeof gsap !== 'undefined' && gsap.ticker) {
        gsap.ticker.add((time) => {
            if (window.lenis && !window.lenis.isStopped) {
                window.lenis.update();
            }
        });

        gsap.ticker.lagSmoothing(0);
    }
});
