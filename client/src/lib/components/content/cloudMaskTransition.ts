/**
 * Custom Splide transition: the incoming slide is revealed through a soft,
 * blurred cluster-of-circles mask (a "cloud") that grows outward from the
 * center, instead of a hard-edged wipe or a plain opacity crossfade.
 * Requires `type: 'fade'` so slides are stacked instead of translated.
 */

const DURATION_MS = 900;

const CLOUD_MASK_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <filter id="cloud-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
    <g filter="url(#cloud-blur)" fill="#fff">
      <circle cx="100" cy="102" r="38" />
      <circle cx="68" cy="112" r="28" />
      <circle cx="132" cy="112" r="30" />
      <circle cx="82" cy="78" r="25" />
      <circle cx="118" cy="78" r="27" />
      <circle cx="100" cy="132" r="26" />
    </g>
  </svg>
`.trim();

const CLOUD_MASK_URL = `url("data:image/svg+xml,${encodeURIComponent(CLOUD_MASK_SVG)}")`;

function applyMaskStyle(element: HTMLElement, size: string): void {
  element.style.maskImage = CLOUD_MASK_URL;
  element.style.webkitMaskImage = CLOUD_MASK_URL;
  element.style.maskRepeat = 'no-repeat';
  element.style.webkitMaskRepeat = 'no-repeat';
  element.style.maskPosition = 'center';
  element.style.webkitMaskPosition = 'center';
  element.style.maskSize = size;
  element.style.webkitMaskSize = size;
}

function resetSlideStyle(element: HTMLElement): void {
  element.style.transition = '';
  element.style.opacity = '';
  element.style.zIndex = '';
  element.style.maskImage = '';
  element.style.webkitMaskImage = '';
  element.style.maskRepeat = '';
  element.style.webkitMaskRepeat = '';
  element.style.maskPosition = '';
  element.style.webkitMaskPosition = '';
  element.style.maskSize = '';
  element.style.webkitMaskSize = '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CloudMaskTransition(Splide: any, Components: any) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let activeNext: HTMLElement | undefined;
  let activePrev: HTMLElement | undefined;

  function mount(): void {
    // Custom transitions opt out of Splide's own slide positioning, so every
    // slide must be explicitly shown/hidden here instead of relying on the
    // built-in fade transform stacking.
    Components.Slides.get().forEach(({ slide, index }: { slide: HTMLElement; index: number }) => {
      const isActive = index === Splide.index;
      slide.style.opacity = isActive ? '1' : '0';
      slide.style.zIndex = isActive ? '1' : '0';
    });
  }

  function cleanup(): void {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (activeNext) resetSlideStyle(activeNext);
    if (activePrev) resetSlideStyle(activePrev);
    activeNext = undefined;
    activePrev = undefined;
  }

  function start(index: number, done: () => void): void {
    cleanup();

    const prevSlide = Components.Slides.getAt(Splide.index);
    const nextSlide = Components.Slides.getAt(index);

    if (!prevSlide || !nextSlide || prevSlide.index === nextSlide.index) {
      done();
      return;
    }

    activePrev = prevSlide.slide;
    activeNext = nextSlide.slide;

    activePrev.style.zIndex = '1';

    activeNext.style.zIndex = '2';
    activeNext.style.opacity = '1';
    activeNext.style.transition = 'none';
    applyMaskStyle(activeNext, '0% 0%');

    // Force a reflow so the 0% mask size is committed before animating.
    activeNext.getBoundingClientRect();

    activeNext.style.transition = `mask-size ${DURATION_MS}ms ease, -webkit-mask-size ${DURATION_MS}ms ease`;

    requestAnimationFrame(() => {
      if (!activeNext) return;
      applyMaskStyle(activeNext, '350% 350%');
    });

    timer = setTimeout(() => {
      cleanup();
      done();
    }, DURATION_MS);
  }

  function cancel(): void {
    cleanup();
  }

  return {
    mount,
    start,
    cancel,
  };
}
