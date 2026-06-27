"use client";

import { useEffect } from "react";

export default function ShopScrollHandler() {
  useEffect(() => {
    const savedPos = sessionStorage.getItem("shopScrollPos");
    if (savedPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPos, 10));
      }, 100);
    }

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem("shopScrollPos", window.scrollY.toString());
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null;
}
