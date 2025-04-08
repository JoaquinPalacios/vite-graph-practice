"use client";

import { useMemo } from "react";

import { useWindowSize } from "hamo";

export const useScreenDetector = () => {
  const { width } = useWindowSize();

  const screenSizes = useMemo(() => {
    const xs = 640;
    const sm = 768;
    const md = 1024;
    const lg = 1280;
    const xl = 1400;
    // const xxl = 1536;

    return {
      isMobile: (width ?? 0) > 0 && (width ?? 0) < xs, // 0 - 640
      isLandscapeMobile: (width ?? 0) >= xs && (width ?? 0) < sm, // 640 - 768
      isTablet: (width ?? 0) >= sm && (width ?? 0) < md, // 768 - 1024
      isDesktop: (width ?? 0) >= md && (width ?? 0) < lg, // 1024 - 1280
      isLargeDesktop: (width ?? 0) >= lg && (width ?? 0) < xl, // 1280 - 1400
      isExtraLargeDesktop: (width ?? 0) >= xl, // 1400+
    };
  }, [width]);

  return screenSizes;
};
