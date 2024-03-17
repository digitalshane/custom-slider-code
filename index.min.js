import { gsap } from 'https://cdn.skypack.dev/gsap';

const TRANSITION_DURATION = 0.8; // slide transition time in seconds
const PARALLAX_AMOUNT = 35; // percentage parallax overlap

class Slideshow {
  constructor(slider) {
    // Initialize DOM elements
    this.slider = slider;
    this.slides = Array.from(this.slider.querySelectorAll('.slide'));
    this.slidesInner = this.slides.map((item) => item.querySelector('img'));

    this.current = 0;
    this.slidesTotal = this.slides.length;
    this.isAnimating = false;

    // Set initial states
    this.slides[this.current].classList.add('is-current');
  }

  navigate(direction) {
    // Exit is an animation is already in progress
    if (this.isAnimating) return false;

    this.isAnimating = true;

    // Save current slide index
    const previous = this.current;

    // Update the current slide index based on direction
    if (direction === 1) {
      if (this.current < this.slidesTotal - 1) {
        this.current += 1;
      } else {
        // If the last slide, wrap around to the first slide
        this.current = 0;
      }
    } else {
      if (this.current > 0) {
        this.current -= 1;
      } else {
        // If the first slide, wrap around to the last slide
        this.current = this.slidesTotal - 1;
      }
    }

    this.animate(previous, this.current, direction);
  }

  animate(current, upcoming, direction) {
    const currentSlide = this.slides[current];
    const currentInner = this.slidesInner[current];
    const upcomingSlide = this.slides[upcoming];

    gsap
      .timeline({
        defaults: {
          duration: TRANSITION_DURATION,
          ease: 'power4.inOut',
        },
        onStart: () => {
          upcomingSlide.classList.add('is-current');
          gsap.set(upcomingSlide, { zIndex: 1 });
        },
        onComplete: () => {
          currentSlide.classList.remove('is-current');
          gsap.set(currentSlide, { xPercent: 0 });
          gsap.set(currentInner, { xPercent: 0 });
          gsap.set(upcomingSlide, { zIndex: 'auto' });
          this.isAnimating = false;
        },
      })
      .to(currentSlide, {
        xPercent: -direction * 100,
      })
      .to(
        currentInner,
        {
          xPercent: direction * PARALLAX_AMOUNT,
        },
        '<'
      )
      .fromTo(
        upcomingSlide,
        {
          xPercent: direction * 100,
        },
        {
          xPercent: 0,
        },
        '<'
      );
  }
}

const slider = document.querySelector('.slider');
const slideshow = new Slideshow(slider);

document.querySelector('.is-prev').addEventListener('click', () => slideshow.navigate(-1));
document.querySelector('.is-next').addEventListener('click', () => slideshow.navigate(1));