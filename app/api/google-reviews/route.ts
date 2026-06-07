type ReviewSource = "business-profile" | "places" | "unconfigured";

type NormalizedReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  quote: string;
  service: string;
  profileUrl?: string;
  photoUrl?: string;
};

type ReviewsPayload = {
  source: ReviewSource;
  configured: boolean;
  reviewUrl: string;
  averageRating: number;
  totalReviewCount: number;
  reviews: NormalizedReview[];
  nextPageToken?: string;
  updatedAt: string;
  message?: string;
};

type BusinessProfileReview = {
  name?: string;
  reviewId?: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
  };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
};

type BusinessProfileReviewsResponse = {
  reviews?: BusinessProfileReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
  error?: {
    message?: string;
  };
};

type TokenResponse = {
  access_token?: string;
  error_description?: string;
};

type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  publishTime?: string;
  text?: {
    text?: string;
  };
  originalText?: {
    text?: string;
  };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type PlacesDetailsResponse = {
  displayName?: {
    text?: string;
  };
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  error?: {
    message?: string;
  };
};

const googleReviewUrl = "https://g.page/r/CawnHNMWLzrAEAI/review";
const defaultPageSize = 9;
const maxPageSize = 50;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageSize = getPageSize(searchParams.get("pageSize"));
  const pageToken = searchParams.get("pageToken") || undefined;

  try {
    if (hasBusinessProfileConfig()) {
      const payload = await getBusinessProfileReviews(pageSize, pageToken);
      return reviewsResponse(payload);
    }

    if (hasPlacesConfig()) {
      const payload = await getPlacesReviews();
      return reviewsResponse(payload);
    }

    return reviewsResponse({
      source: "unconfigured",
      configured: false,
      reviewUrl: googleReviewUrl,
      averageRating: 0,
      totalReviewCount: 0,
      reviews: [],
      updatedAt: new Date().toISOString(),
      message: "Google reviews API is ready, but credentials are not configured yet.",
    });
  } catch {
    return reviewsResponse(
      {
        source: "unconfigured",
        configured: false,
        reviewUrl: googleReviewUrl,
        averageRating: 0,
        totalReviewCount: 0,
        reviews: [],
        updatedAt: new Date().toISOString(),
        message: "Google reviews are temporarily unavailable.",
      },
      502,
    );
  }
}

function reviewsResponse(payload: ReviewsPayload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function getPageSize(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return defaultPageSize;
  }

  return Math.min(Math.max(Math.trunc(parsed), 1), maxPageSize);
}

function hasBusinessProfileConfig() {
  return Boolean(
    getBusinessProfileParent() &&
      process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID &&
      process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET &&
      process.env.GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN,
  );
}

function hasPlacesConfig() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_PLACE_ID);
}

function getBusinessProfileParent() {
  if (process.env.GOOGLE_BUSINESS_PROFILE_PARENT) {
    return process.env.GOOGLE_BUSINESS_PROFILE_PARENT.replace(/^\/|\/$/g, "");
  }

  const accountId = process.env.GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID?.replace(/^accounts\//, "");
  const locationId = process.env.GOOGLE_BUSINESS_PROFILE_LOCATION_ID?.replace(/^locations\//, "");

  if (!accountId || !locationId) {
    return "";
  }

  return `accounts/${accountId}/locations/${locationId}`;
}

async function getBusinessProfileReviews(pageSize: number, pageToken?: string): Promise<ReviewsPayload> {
  const accessToken = await getBusinessProfileAccessToken();
  const parent = getBusinessProfileParent();
  const reviewsUrl = new URL(`https://mybusiness.googleapis.com/v4/${parent}/reviews`);

  reviewsUrl.searchParams.set("pageSize", String(pageSize));
  reviewsUrl.searchParams.set("orderBy", "updateTime desc");

  if (pageToken) {
    reviewsUrl.searchParams.set("pageToken", pageToken);
  }

  const response = await fetch(reviewsUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = (await response.json()) as BusinessProfileReviewsResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "Unable to load Google Business Profile reviews.");
  }

  return {
    source: "business-profile",
    configured: true,
    reviewUrl: googleReviewUrl,
    averageRating: safeNumber(data.averageRating),
    totalReviewCount: safeNumber(data.totalReviewCount),
    reviews: (data.reviews || []).map(normalizeBusinessProfileReview).filter(isFiveStarReview),
    nextPageToken: data.nextPageToken,
    updatedAt: new Date().toISOString(),
  };
}

async function getBusinessProfileAccessToken() {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_BUSINESS_PROFILE_CLIENT_SECRET || "",
    refresh_token: process.env.GOOGLE_BUSINESS_PROFILE_REFRESH_TOKEN || "",
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as TokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || "Unable to authorize Google Business Profile.");
  }

  return data.access_token;
}

async function getPlacesReviews(): Promise<ReviewsPayload> {
  const placeId = process.env.GOOGLE_PLACE_ID || "";
  const placeResource = placeId.startsWith("places/") ? placeId : `places/${placeId}`;

  const response = await fetch(`https://places.googleapis.com/v1/${placeResource}`, {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY || "",
      "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
    },
    next: {
      revalidate: 3600,
    },
  });

  const data = (await response.json()) as PlacesDetailsResponse;

  if (!response.ok) {
    throw new Error(data.error?.message || "Unable to load Google Places reviews.");
  }

  return {
    source: "places",
    configured: true,
    reviewUrl: googleReviewUrl,
    averageRating: safeNumber(data.rating),
    totalReviewCount: safeNumber(data.userRatingCount),
    reviews: (data.reviews || []).map(normalizePlacesReview).filter(isFiveStarReview),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeBusinessProfileReview(review: BusinessProfileReview): NormalizedReview {
  const rating = starRatingToNumber(review.starRating);

  return {
    id: review.reviewId || review.name || `${review.reviewer?.displayName || "review"}-${review.updateTime || review.createTime || rating}`,
    name: review.reviewer?.displayName || "Google reviewer",
    date: formatDate(review.updateTime || review.createTime),
    rating,
    quote: stripMarkup(review.comment || ""),
    service: "Google Reviews",
    photoUrl: review.reviewer?.profilePhotoUrl,
  };
}

function normalizePlacesReview(review: PlacesReview): NormalizedReview {
  const rating = safeNumber(review.rating);
  const name = review.authorAttribution?.displayName || "Google reviewer";

  return {
    id: review.name || `${name}-${review.publishTime || review.relativePublishTimeDescription || rating}`,
    name,
    date: review.relativePublishTimeDescription || formatDate(review.publishTime),
    rating,
    quote: review.text?.text || review.originalText?.text || "",
    service: "Google Reviews",
    profileUrl: review.authorAttribution?.uri,
    photoUrl: review.authorAttribution?.photoUri,
  };
}

function isFiveStarReview(review: NormalizedReview) {
  return review.rating === 5;
}

function starRatingToNumber(value?: string) {
  const starMap: Record<string, number> = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };

  return value ? starMap[value] || 0 : 0;
}

function safeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDate(value?: string) {
  if (!value) {
    return "Google review";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Google review";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function stripMarkup(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
