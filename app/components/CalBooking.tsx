"use client";

import { getCalApi } from "@calcom/embed-react";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useEffect } from "react";
import { MagneticButton } from "./MagneticButton";
import type { MagneticButtonSize, MagneticButtonVariant } from "./MagneticButton";

const calNamespace = "shiny-beak-booking";
const modalFallbackDelay = 1800;
const calConfig = {
  layout: "month_view",
  theme: "dark",
} as const;
const calUiConfig = {
  theme: "dark",
  layout: "month_view",
  styles: {
    branding: {
      brandColor: "#c8ccd4",
    },
  },
  cssVarsPerTheme: {
    light: {
      "cal-brand": "#c8ccd4",
      "cal-brand-emphasis": "#5b6470",
      "cal-border-radius": "8px",
    },
    dark: {
      "cal-brand": "#c8ccd4",
      "cal-brand-emphasis": "#5b6470",
      "cal-border-radius": "8px",
    },
  },
} as const;
type CalApi = Awaited<ReturnType<typeof getCalApi>>;

let calReadyPromise: Promise<CalApi> | null = null;
let isCalUiConfigured = false;

type CalBookingLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

type CalBookingButtonProps = CalBookingLinkProps & {
  size?: MagneticButtonSize;
  variant?: MagneticButtonVariant;
};

export function CalBookingEmbed() {
  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const idleHandle = idleWindow.requestIdleCallback(() => {
        preloadCalEmbed();
      }, { timeout: 1200 });

      return () => {
        idleWindow.cancelIdleCallback?.(idleHandle);
      };
    }

    const timeoutHandle = window.setTimeout(preloadCalEmbed, 500);

    return () => {
      window.clearTimeout(timeoutHandle);
    };
  }, []);

  return null;
}

export function CalBookingButton({
  href,
  children,
  size = "hero",
  variant = "gold",
  onClick,
  onFocus,
  onMouseEnter,
  onPointerDown,
  onTouchStart,
  ...anchorProps
}: CalBookingButtonProps) {
  return (
    <MagneticButton
      {...anchorProps}
      href={href}
      size={size}
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        openCalModal(event, href);
      }}
      onFocus={(event) => {
        preloadCalEmbed(href);
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        preloadCalEmbed(href);
        onMouseEnter?.(event);
      }}
      onPointerDown={(event) => {
        preloadCalEmbed(href);
        onPointerDown?.(event);
      }}
      onTouchStart={(event) => {
        preloadCalEmbed(href);
        onTouchStart?.(event);
      }}
      data-cal-namespace={calNamespace}
      data-cal-link={toCalLink(href)}
      data-cal-config={JSON.stringify(calConfig)}
    >
      {children}
    </MagneticButton>
  );
}

export function CalBookingLink({
  href,
  children,
  onClick,
  onFocus,
  onMouseEnter,
  onPointerDown,
  onTouchStart,
  ...anchorProps
}: CalBookingLinkProps) {
  return (
    <a
      {...anchorProps}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        openCalModal(event, href);
      }}
      onFocus={(event) => {
        preloadCalEmbed(href);
        onFocus?.(event);
      }}
      onMouseEnter={(event) => {
        preloadCalEmbed(href);
        onMouseEnter?.(event);
      }}
      onPointerDown={(event) => {
        preloadCalEmbed(href);
        onPointerDown?.(event);
      }}
      onTouchStart={(event) => {
        preloadCalEmbed(href);
        onTouchStart?.(event);
      }}
      data-cal-namespace={calNamespace}
      data-cal-link={toCalLink(href)}
      data-cal-config={JSON.stringify(calConfig)}
    >
      {children}
    </a>
  );
}

function openCalModal(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const target = (event.currentTarget as HTMLAnchorElement).target;
  const calLink = toCalLink(href);

  event.preventDefault();

  const fallbackTimer = window.setTimeout(() => {
    window.clearInterval(modalWatcher);

    if (!document.querySelector("cal-modal-box")) {
      openBookingPage(href, target);
    }
  }, modalFallbackDelay);
  const modalWatcher = window.setInterval(() => {
    if (document.querySelector("cal-modal-box")) {
      window.clearTimeout(fallbackTimer);
      window.clearInterval(modalWatcher);
    }
  }, 100);

  void getReadyCal()
    .then((cal) => {
      cal("modal", {
        calLink,
        config: calConfig,
      });
    })
    .catch(() => {
      window.clearTimeout(fallbackTimer);
      openBookingPage(href, target);
    });
}

function preloadCalEmbed(href = "https://cal.com/shiny-beak-detailing-gzedbc") {
  const calLink = toCalLink(href);

  void getReadyCal().then((cal) => {
    cal("preload", {
      calLink,
      type: "modal",
    });
  });
}

function getReadyCal() {
  if (!calReadyPromise) {
    calReadyPromise = getCalApi({ namespace: calNamespace }).then((cal) => {
      if (!isCalUiConfigured) {
        cal("ui", calUiConfig);
        isCalUiConfigured = true;
      }

      return cal;
    });
  }

  return calReadyPromise;
}

function openBookingPage(href: string, target?: string) {
  if (target === "_blank") {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = href;
}

function toCalLink(href: string) {
  return href.replace(/^https?:\/\/(?:www\.)?cal\.com\//, "").replace(/^\/|\/$/g, "");
}
