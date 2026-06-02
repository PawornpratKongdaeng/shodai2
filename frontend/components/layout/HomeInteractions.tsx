"use client";

import { useEffect } from "react";

/**
 * พอร์ตพฤติกรรมทั้งหมดจาก script.js ของดีไซน์ใหม่ (Shodai EV rebuild)
 * ทำงานล้วนๆ ผ่าน DOM + data-* attributes จึงไม่ชนกับ state ของ React
 * sticky header, mobile drawer, reveal-on-scroll, category/product rail,
 * hero slider, tab underline และ pointer tilt บนการ์ดโชว์เคส
 */
export function HomeInteractions() {
  useEffect(() => {
    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    const scrollTopButton = document.querySelector("[data-scroll-top]");
    const rail = document.querySelector("[data-category-rail]");
    const railPrev = document.querySelector("[data-rail-prev]");
    const railNext = document.querySelector("[data-rail-next]");
    const productRail = document.querySelector("[data-product-rail]");
    const productPrev = document.querySelector("[data-product-prev]");
    const productNext = document.querySelector("[data-product-next]");
    const heroSlides = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
    const heroDots = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-dot]"));
    const tiltCard = document.querySelector<HTMLElement>("[data-tilt-card]");

    const cleanups: Array<() => void> = [];
    const on = (el: Element | null, ev: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      el?.addEventListener(ev, fn, opts);
      cleanups.push(() => el?.removeEventListener(ev, fn, opts));
    };

    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      header?.classList.toggle("is-scrolled", y > 24);
      scrollTopButton?.classList.toggle("is-visible", y > 520);
    }
    function closeMenu() {
      document.body.classList.remove("menu-open");
      menuToggle?.classList.remove("is-active");
      mobileMenu?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }

    on(window as unknown as Element, "scroll", onScroll, { passive: true });
    onScroll();

    on(menuToggle, "click", () => {
      const open = !mobileMenu?.classList.contains("is-open");
      document.body.classList.toggle("menu-open", open);
      menuToggle?.classList.toggle("is-active", open);
      mobileMenu?.classList.toggle("is-open", open);
      menuToggle?.setAttribute("aria-expanded", String(open));
    });
    mobileMenu?.querySelectorAll("a").forEach((link) => on(link, "click", closeMenu));

    on(scrollTopButton, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const scrollRail = (direction: number) => {
      if (!rail) return;
      const step = Math.max(280, Math.round(rail.clientWidth * 0.72));
      rail.scrollBy({ left: direction * step, behavior: "smooth" });
    };
    on(railPrev, "click", () => scrollRail(-1));
    on(railNext, "click", () => scrollRail(1));

    const scrollProducts = (direction: number) => {
      if (!productRail) return;
      const step = Math.max(280, Math.round(productRail.clientWidth * 0.62));
      productRail.scrollBy({ left: direction * step, behavior: "smooth" });
    };
    on(productPrev, "click", () => scrollProducts(-1));
    on(productNext, "click", () => scrollProducts(1));

    document.querySelectorAll(".item-tabs button").forEach((button) => {
      on(button, "click", () => {
        const group = button.closest("[role='tablist']");
        group?.querySelectorAll("button").forEach((item) => {
          item.classList.remove("is-active");
          item.setAttribute("aria-selected", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-selected", "true");
      });
    });

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
      );
      document.querySelectorAll(".reveal, .reveal-item").forEach((item) => observer?.observe(item));
    } else {
      document.querySelectorAll(".reveal, .reveal-item").forEach((item) => item.classList.add("is-visible"));
    }

    let currentSlide = 0;
    const showHero = (index: number) => {
      if (!heroSlides.length) return;
      currentSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === currentSlide));
      heroDots.forEach((dot, i) => dot.classList.toggle("is-active", i === currentSlide));
    };
    const nextHero = (direction: number) => showHero(currentSlide + direction);
    on(document.querySelector("[data-slide-prev]"), "click", () => nextHero(-1));
    on(document.querySelector("[data-slide-next]"), "click", () => nextHero(1));
    heroDots.forEach((dot, i) => on(dot, "click", () => showHero(i)));
    const heroTimer = window.setInterval(() => nextHero(1), 7200);

    on(tiltCard, "mousemove", (event) => {
      const e = event as MouseEvent;
      const rect = tiltCard!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltCard!.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg)`;
    });
    on(tiltCard, "mouseleave", () => {
      if (tiltCard) tiltCard.style.transform = "";
    });

    return () => {
      cleanups.forEach((fn) => fn());
      observer?.disconnect();
      window.clearInterval(heroTimer);
      document.body.classList.remove("menu-open");
    };
  }, []);

  return null;
}
