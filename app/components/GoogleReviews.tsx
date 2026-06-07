"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MagneticButton } from "./MagneticButton";

type GoogleReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  quote: string;
  service?: string;
  profileUrl?: string;
  photoUrl?: string;
};

type GoogleReviewsPayload = {
  source: "business-profile" | "places" | "unconfigured";
  configured: boolean;
  reviewUrl: string;
  averageRating: number;
  totalReviewCount: number;
  reviews: GoogleReview[];
  nextPageToken?: string;
  message?: string;
};

type GoogleReviewsProps = {
  reviewUrl: string;
};

const sampleReviews: GoogleReview[] = [
  {
    id: "sample-1",
    name: "Sarah M.",
    date: "March 2025",
    rating: 5,
    quote: "My car looks better than it did when I first bought it. They showed up right on time and got every inch spotless. Truly impressive.",
    service: "Full Detail",
  },
  {
    id: "sample-2",
    name: "James T.",
    date: "February 2025",
    rating: 5,
    quote: "So convenient having them come to my office. I walked out to a spotless car at the end of the day. Will book again without hesitation.",
    service: "Exterior Detail",
  },
  {
    id: "sample-3",
    name: "Priya K.",
    date: "January 2025",
    rating: 5,
    quote: "The interior was a mess after a road trip with the kids. Back to showroom condition. Easy booking, great results, zero hassle.",
    service: "Interior Detail",
  },
];

const initialVisibleReviews = 3;
const reviewsPerStep = 3;

export function GoogleReviews({ reviewUrl }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviewCount, setTotalReviewCount] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialVisibleReviews);
  const reviewListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void loadReviews();
  }, []);

  const visibleReviews = useMemo(() => reviews.slice(0, visibleCount), [reviews, visibleCount]);
  const hasHiddenReviews = visibleCount < reviews.length;
  const canLoadMore = Boolean(nextPageToken);
  const hasMoreReviews = hasHiddenReviews || canLoadMore;

  const isUsingFallback = !isLoading && reviews.length === 0;
  const displayedReviews = isUsingFallback ? sampleReviews : visibleReviews;
  const displayRating = isLoading ? "..." : isUsingFallback ? "5.0" : averageRating > 0 ? averageRating.toFixed(1) : "—";
  const reviewCountLabel = isLoading
    ? "Loading reviews"
    : isUsingFallback
    ? "Sample reviews"
    : totalReviewCount > 0
    ? `${totalReviewCount} Google review${totalReviewCount === 1 ? "" : "s"}`
    : "No reviews yet";
  const ratingForStars = isUsingFallback ? 5 : averageRating;

  async function loadReviews(pageToken?: string) {
    if (pageToken) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = new URLSearchParams({ pageSize: "9" });

      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const response = await fetch(`/api/google-reviews?${params.toString()}`);
      const data = (await response.json()) as GoogleReviewsPayload;

      if (!response.ok) {
        throw new Error(data.message || "Unable to load Google reviews.");
      }

      setAverageRating(data.averageRating);
      setTotalReviewCount(data.totalReviewCount);
      setNextPageToken(data.nextPageToken);

      setReviews((current) => {
        const incoming = pageToken ? [...current, ...data.reviews] : data.reviews;
        const uniqueReviews = new Map<string, GoogleReview>();

        incoming.forEach((review) => {
          uniqueReviews.set(review.id, review);
        });

        return Array.from(uniqueReviews.values());
      });
    } catch {
      setAverageRating(0);
      setTotalReviewCount(0);
      setNextPageToken(undefined);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }

  async function viewMoreReviews() {
    if (hasHiddenReviews) {
      setVisibleCount((current) => Math.min(current + reviewsPerStep, reviews.length));
      scrollReviewList();
      return;
    }

    if (nextPageToken) {
      const previousLength = reviews.length;

      await loadReviews(nextPageToken);
      setVisibleCount(Math.min(previousLength + reviewsPerStep, previousLength + 9));
      scrollReviewList();
    }
  }

  function scrollReviewList() {
    window.setTimeout(() => {
      reviewListRef.current?.scrollTo({
        top: reviewListRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 80);
  }

  return (
    <div className="mt-8 space-y-5 sm:mt-10">
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-none border border-black/10 bg-white p-5 shadow-xl shadow-black/8 sm:p-6" data-reveal="apple-card">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-none border border-black/10 bg-[#c8ccd4] text-2xl font-bold text-[#07100f] shadow-lg shadow-black/5">
              G
            </span>
            <div>
              <h3 className="mt-1 text-2xl font-bold leading-tight text-[#111]">
                Google Reviews
              </h3>
            </div>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <span className="text-6xl font-bold leading-none text-[#111]">{displayRating}</span>
            <span className="pb-2 text-sm font-normal uppercase tracking-[0.16em] text-black/48">{reviewCountLabel}</span>
          </div>
          <StarRating rating={ratingForStars} muted={!isUsingFallback && averageRating === 0} />
          <MagneticButton href={reviewUrl} target="_blank" rel="noopener noreferrer" size="card" className="mt-6">
            Review On Google
          </MagneticButton>
        </div>

        <div ref={reviewListRef} className="-m-4 max-h-[712px] overflow-y-auto p-4">
          <div className="grid items-stretch gap-4 sm:gap-5 md:auto-rows-fr md:grid-cols-3">
            {displayedReviews.map((item, index) => (
              <ReviewCard
                key={item.id}
                review={item}
                index={index}
                linkable={Boolean(item.profileUrl)}
              />
            ))}
          </div>
        </div>
      </div>

      {!isUsingFallback && reviews.length > 0 && hasMoreReviews ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-none border border-black/10 bg-[#c8ccd4] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#111] shadow-lg shadow-black/5 transition hover:-translate-y-0.5 hover:border-[#5b6470] hover:bg-[#ffe36b] disabled:cursor-wait disabled:opacity-60"
            disabled={isLoadingMore}
            onClick={viewMoreReviews}
          >
            {isLoadingMore ? "Loading Reviews" : "View More Reviews"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ReviewCard({ review, index, linkable }: { review: GoogleReview; index: number; linkable: boolean }) {
  const initials = review.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article
      className="flex h-full flex-col rounded-none border border-black/10 bg-white p-5 shadow-xl shadow-black/8 sm:p-6"
      data-reveal="apple-card"
      data-reveal-delay={index * 130}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {review.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={review.photoUrl}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-[#c8ccd4]/60 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c8ccd4]/15 text-[0.65rem] font-bold text-[#111]">
              {initials}
            </span>
          )}
          <div>
            {linkable ? (
              <a href={review.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-[0.12em] text-[#111] transition hover:text-[#5b6470]">
                {review.name}
              </a>
            ) : (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111]">{review.name}</p>
            )}
            <p className="mt-0.5 text-[0.65rem] text-black/40">{review.date}</p>
          </div>
        </div>
        {review.service && (
          <span className="shrink-0 border border-black/10 bg-[#f8f7f5] px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-black/50">
            {review.service}
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-black/72">
        {review.quote ? <>&ldquo;{review.quote}&rdquo;</> : <>Rated {review.rating} out of 5 on Google.</>}
      </p>

      <div className="mt-4 border-t border-black/8 pt-4">
        <StarRating rating={review.rating} />
      </div>
    </article>
  );
}

function StarRating({ rating, muted = false }: { rating: number; muted?: boolean }) {
  const filledStars = Math.round(rating);

  return (
    <div className="mt-2 grid w-full grid-cols-5 gap-1.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`h-2.5 w-full rounded-none ${!muted && index < filledStars ? "bg-[#c8ccd4]" : "bg-black/10"}`}
        />
      ))}
    </div>
  );
}
