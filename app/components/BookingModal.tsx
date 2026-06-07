"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CalSlot = {
  start: string;
};

type SlotsPayload = {
  slots: Record<string, CalSlot[]>;
  message?: string;
};

const PACKAGES = [
  {
    key: "full-exterior-detail",
    title: "Exterior Detail",
    tagline: "Full body wash, wax, wheel washing, and exhaust polish",
    price: "$99+",
    duration: "1h",
    fixedAddress: "14079 66A Ave, Surrey, BC",
  },
  {
    key: "full-interior-detail",
    title: "Interior Detail",
    tagline: "Deep vacuum, seat shampoo, steam clean, and panel care",
    price: "$129+",
    duration: "3h",
    fixedAddress: "14079 66A Ave, Surrey, BC",
  },
  {
    key: "fbd",
    title: "Full Detail",
    tagline: "A complete reset inside and out in one appointment",
    price: "$199+",
    duration: "4h",
    fixedAddress: "14079 66A Ave, Surrey, BC",
  },
];

const timeZone = "America/Vancouver";
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const shortWeekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone,
});

export function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedService, setSelectedService] = useState<string>();
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));
  const [slots, setSlots] = useState<Record<string, CalSlot[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedStart, setSelectedStart] = useState<string>();
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [blockedStarts, setBlockedStarts] = useState<Set<string>>(() => new Set());
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    locationType: "mobile" as "mobile" | "business",
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const selectedPackage = PACKAGES.find((pkg) => pkg.key === selectedService);
  const visibleDays = useMemo(() => getCalendarDays(monthCursor), [monthCursor]);
  const currentMonthLabel = monthFormatter.format(monthCursor);
  const availableDates = useMemo(() => new Set(Object.keys(slots).filter((date) => slots[date]?.length > 0)), [slots]);
  const selectedSlots = selectedDate ? slots[selectedDate] || [] : [];
  const visibleSelectedSlots = selectedSlots.filter((slot) => !blockedStarts.has(slot.start));

  useEffect(() => {
    function handleOpen(event: Event) {
      const detail = (event as CustomEvent<{ service?: string }>).detail;

      setSelectedService(detail?.service);
      setMonthCursor(startOfMonth(new Date()));
      setBookingComplete(false);
      setBookingMessage("");
      setBlockedStarts(new Set());
      setIsOpen(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    }

    window.addEventListener("open-booking-modal", handleOpen);
    return () => {
      window.removeEventListener("open-booking-modal", handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !selectedService) {
      return;
    }

    const controller = new AbortController();

    async function loadSlots() {
      setIsLoadingSlots(true);
      setSlotsMessage("");
      setSelectedDate(undefined);
      setSelectedStart(undefined);

      try {
        const start = toDateInput(monthCursor);
        const end = toDateInput(addMonths(monthCursor, 3));
        const params = new URLSearchParams({
          service: selectedService || "",
          start,
          end,
          timeZone,
        });
        const response = await fetch(`/api/cal-slots?${params.toString()}`, { signal: controller.signal });
        const data = (await response.json()) as SlotsPayload;

        if (!response.ok) {
          throw new Error(data.message || "Unable to load availability.");
        }

        setSlots(data.slots || {});
        const firstAvailableDate = getCalendarDays(monthCursor)
          .map((day) => day.date)
          .find((date) => data.slots?.[date]?.some((slot) => !blockedStarts.has(slot.start)));

        if (firstAvailableDate) {
          setSelectedDate(firstAvailableDate);
          setSelectedStart(data.slots[firstAvailableDate].find((slot) => !blockedStarts.has(slot.start))?.start);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSlots({});
          setSlotsMessage(error instanceof Error ? error.message : "Unable to load availability.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSlots(false);
        }
      }
    }

    void loadSlots();

    return () => {
      controller.abort();
    };
  }, [blockedStarts, isOpen, selectedService, monthCursor]);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleClose() {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
      setSelectedService(undefined);
      setBookingComplete(false);
      setBookingMessage("");
    }, 220);
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  }

  function selectPackage(service: string) {
    setSelectedService(service);
    setBookingComplete(false);
    setBookingMessage("");
    setBlockedStarts(new Set());
  }

  function selectDate(date: string) {
    const daySlots = slots[date] || [];

    setSelectedDate(date);
    setSelectedStart(daySlots.find((slot) => !blockedStarts.has(slot.start))?.start);
    setBookingComplete(false);
    setBookingMessage("");
  }

  async function refreshSlots() {
    if (!selectedService) {
      return;
    }

    const params = new URLSearchParams({
      service: selectedService,
      start: toDateInput(monthCursor),
      end: toDateInput(addMonths(monthCursor, 3)),
      timeZone,
    });
    const response = await fetch(`/api/cal-slots?${params.toString()}`, { cache: "no-store" });
    const data = (await response.json()) as SlotsPayload;

    if (response.ok) {
      setSlots(data.slots || {});
    }
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedService || !selectedStart) {
      setBookingMessage("Choose an available date and time.");
      return;
    }

    setIsBooking(true);
    setBookingMessage("");

    try {
      const response = await fetch("/api/cal-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: selectedService,
          start: selectedStart,
          timeZone,
          ...bookingDetails,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Unable to book this appointment.");
      }

      setBookingComplete(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to book this appointment.";

      if (selectedStart && /already|available|taken|conflict|slot/i.test(message)) {
        setBlockedStarts((current) => new Set([...current, selectedStart]));
        setSelectedStart(undefined);
        void refreshSlots();
      }

      setBookingMessage(message);
    } finally {
      setIsBooking(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/62 p-3 backdrop-blur-md transition-opacity duration-200 ease-out sm:p-4 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={modalRef}
        className={`relative max-h-[92vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111514]/96 text-white shadow-[0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-200 ease-out ${
          isAnimating ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        } ${selectedPackage ? "max-w-7xl" : "max-w-[460px]"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5 sm:px-8">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-[0.1em] text-[#c8ccd4]">Book Your Detail</h3>
            <p className="mt-0.5 text-xs text-white/45">Select a service to get started</p>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg text-white/60 transition hover:bg-white/12 hover:text-white"
            aria-label="Close booking modal"
          >
            &times;
          </button>
        </div>

        <div className={`grid max-h-[78vh] overflow-y-auto ${selectedPackage ? "lg:grid-cols-[320px_minmax(0,1fr)]" : ""}`}>
          {/* Service list */}
          <div className={`flex flex-col gap-2 p-6 sm:p-7 ${selectedPackage ? "border-r border-white/8" : ""}`}>
            {!selectedPackage && (
              <div className="mb-4 text-center">
                <img src="/Microyescars/logo.png" alt="Elegant Auto Detailing" className="mx-auto h-24 w-auto object-contain drop-shadow-[0_8px_22px_rgba(0,0,0,0.5)]" />
                <p className="mt-4 text-sm text-white/50">Professional mobile detailing at your door.<br />Pick a package below to book your slot.</p>
              </div>
            )}
            <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/35">Choose a service</p>
            {PACKAGES.map((pkg) => {
              const isSelected = selectedService === pkg.key;

              return (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => selectPackage(pkg.key)}
                  className={`group flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition-all duration-200 hover:border-[#c8ccd4]/60 hover:bg-[#c8ccd4]/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8ccd4] ${
                    isSelected ? "border-[#c8ccd4]/70 bg-[#c8ccd4]/10" : "border-white/8 bg-white/[0.03]"
                  }`}
                >
                  <div className="pr-3">
                    <h4 className="text-sm font-bold text-white transition duration-200 group-hover:text-[#c8ccd4]">{pkg.title}</h4>
                    <p className="mt-1 text-xs leading-normal text-white/45">{pkg.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-[0.6rem] uppercase tracking-wider text-[#5b6470]">From</span>
                    <span className="text-base font-extrabold text-[#c8ccd4]">{pkg.price}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPackage ? (
            <div className="bg-[#0e1210] p-6 sm:p-8">
              {bookingComplete ? (
                <div className="flex min-h-72 flex-col items-center justify-center text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c8ccd4]">Booked</p>
                  <h4 className="mt-3 text-3xl font-bold text-white">{selectedPackage.title}</h4>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                    Your appointment is booked for {selectedDate ? formatDisplayDate(selectedDate) : "your selected date"} at{" "}
                    {selectedStart ? formatTime(selectedStart) : "your selected time"}.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/58">An email confirmation will be sent shortly.</p>
                  <button
                    type="button"
                    onClick={() => setBookingComplete(false)}
                    className="mt-6 rounded-none border border-[#c8ccd4]/70 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#c8ccd4] transition hover:bg-[#c8ccd4] hover:text-[#07100f]"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <div className="grid gap-8 xl:grid-cols-[0.68fr_1.32fr]">
                  <div className="border-b border-white/8 pb-6 xl:border-b-0 xl:border-r xl:pb-0 xl:pr-7">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#c8ccd4]">Elegant Auto Detailing</p>
                    <h4 className="mt-4 text-2xl font-bold text-white">{selectedPackage.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-white/60">{selectedPackage.tagline}</p>
                    <div className="mt-6 space-y-2.5 text-sm text-white/65">
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0 text-white/35"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2 1.5"/></svg>
                        {selectedPackage.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0 text-white/35"><path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="8" cy="6" r="1.5"/></svg>
                        {bookingDetails.locationType === "business" ? selectedPackage.fixedAddress : "Mobile Service"}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0 text-white/35"><circle cx="8" cy="8" r="6"/><path d="M5 8h6M8 5v6"/></svg>
                        America/Vancouver
                      </div>
                    </div>
                  </div>

                  <form onSubmit={submitBooking} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setMonthCursor(addMonths(monthCursor, -1))}
                          className="h-10 w-10 rounded-none border border-white/10 text-xl text-white/70 transition hover:border-[#c8ccd4] hover:text-[#c8ccd4]"
                          aria-label="Previous month"
                        >
                          &lsaquo;
                        </button>
                        <h4 className="text-lg font-bold text-white">{currentMonthLabel}</h4>
                        <button
                          type="button"
                          onClick={() => setMonthCursor(addMonths(monthCursor, 1))}
                          className="h-10 w-10 rounded-none border border-white/10 text-xl text-white/70 transition hover:border-[#c8ccd4] hover:text-[#c8ccd4]"
                          aria-label="Next month"
                        >
                          &rsaquo;
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.66rem] font-bold uppercase tracking-[0.08em] text-white/50">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-7 gap-1.5">
                        {visibleDays.map((day) => {
                          const isAvailable = availableDates.has(day.date);
                          const isSelected = selectedDate === day.date;

                          return (
                            <button
                              key={day.date}
                              type="button"
                              disabled={!day.inMonth || !isAvailable || isLoadingSlots}
                              onClick={() => selectDate(day.date)}
                              className={`min-h-12 rounded-none border text-sm font-bold transition ${
                                isSelected
                                  ? "border-[#c8ccd4] bg-[#c8ccd4] text-[#07100f]"
                                  : isAvailable && day.inMonth
                                    ? "border-white/14 bg-white/[0.05] text-white hover:border-[#c8ccd4]"
                                    : "border-white/5 bg-transparent text-white/20"
                              } disabled:cursor-not-allowed`}
                            >
                              {day.day}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c8ccd4]">Available Times</p>
                          {isLoadingSlots ? <span className="text-xs text-white/48">Loading</span> : null}
                        </div>
                        {slotsMessage ? <p className="mt-3 text-sm text-[#c8ccd4]">{slotsMessage}</p> : null}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {visibleSelectedSlots.length > 0 ? (
                            visibleSelectedSlots.map((slot) => {
                              const isSelected = selectedStart === slot.start;

                              return (
                                <button
                                  key={slot.start}
                                  type="button"
                                  onClick={() => setSelectedStart(slot.start)}
                                  className={`rounded-none border px-4 py-3 text-sm font-bold transition hover:border-[#c8ccd4] ${
                                    isSelected ? "border-[#c8ccd4] bg-[#c8ccd4] text-[#07100f]" : "border-white/10 bg-white/[0.04] text-white"
                                  }`}
                                >
                                  {formatTime(slot.start)}
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-sm text-white/52">No available times left for this date.</p>
                          )}
                          {selectedSlots
                            .filter((slot) => blockedStarts.has(slot.start))
                            .map((slot) => (
                              <button
                                key={`blocked-${slot.start}`}
                                type="button"
                                disabled
                                className="rounded-none border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-bold text-white/24 line-through"
                              >
                                {formatTime(slot.start)}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid content-start gap-4">
                      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
                        Name
                        <input
                          required
                          value={bookingDetails.name}
                          onChange={(event) => setBookingDetails((current) => ({ ...current, name: event.target.value }))}
                          className="rounded-none border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#c8ccd4]"
                        />
                      </label>
                      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
                        Email
                        <input
                          required
                          type="email"
                          value={bookingDetails.email}
                          onChange={(event) => setBookingDetails((current) => ({ ...current, email: event.target.value }))}
                          className="rounded-none border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#c8ccd4]"
                        />
                      </label>
                      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
                        Phone
                        <input
                          value={bookingDetails.phone}
                          onChange={(event) => setBookingDetails((current) => ({ ...current, phone: event.target.value }))}
                          className="rounded-none border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#c8ccd4]"
                        />
                      </label>
                      <div className="grid gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/58">Service Location</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setBookingDetails((current) => ({ ...current, locationType: "mobile" }))}
                            className={`rounded-none border px-3 py-3 text-left text-sm font-bold transition hover:border-[#c8ccd4] ${
                              bookingDetails.locationType === "mobile" ? "border-[#c8ccd4] bg-[#c8ccd4] text-[#07100f]" : "border-white/10 bg-white/[0.04] text-white"
                            }`}
                          >
                            <span className="block">Mobile Service</span>
                            <span className="mt-1 block text-xs font-normal opacity-70">We come to you</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingDetails((current) => ({ ...current, address: "", locationType: "business" }))}
                            className={`rounded-none border px-3 py-3 text-left text-sm font-bold transition hover:border-[#c8ccd4] ${
                              bookingDetails.locationType === "business" ? "border-[#c8ccd4] bg-[#c8ccd4] text-[#07100f]" : "border-white/10 bg-white/[0.04] text-white"
                            }`}
                          >
                            <span className="block">Business Location</span>
                            <span className="mt-1 block text-xs font-normal opacity-70">{selectedPackage.fixedAddress}</span>
                          </button>
                        </div>
                      </div>
                      {bookingDetails.locationType === "mobile" ? (
                        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
                          Mobile Service Address
                          <textarea
                            required
                            value={bookingDetails.address}
                            onChange={(event) => setBookingDetails((current) => ({ ...current, address: event.target.value }))}
                            className="min-h-20 rounded-none border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal normal-case tracking-normal text-white outline-none transition focus:border-[#c8ccd4]"
                          />
                        </label>
                      ) : null}
                      {bookingMessage ? <p className="text-sm text-[#c8ccd4]">{bookingMessage}</p> : null}
                      <button
                        type="submit"
                        disabled={isBooking || !selectedStart}
                        className="mt-1 flex min-h-12 w-full items-center justify-center rounded-none border border-[#c8ccd4]/80 bg-[#c8ccd4] px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.14em] text-[#07100f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isBooking ? "Booking" : "Book Appointment"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalendarDays(month: Date) {
  const firstDay = startOfMonth(month);
  const startOffset = firstDay.getDay();
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    return {
      date: toDateInput(date),
      day: date.getDate(),
      weekday: shortWeekdayFormatter.format(date),
      inMonth: date.getMonth() === month.getMonth(),
    };
  });
}

function formatDisplayDate(dateValue: string) {
  const date = new Date(`${dateValue}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value)).replace(" ", "");
}
