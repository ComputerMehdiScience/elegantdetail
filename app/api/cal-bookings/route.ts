type BookingRequest = {
  service?: string;
  start?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  locationType?: "mobile" | "business";
  timeZone?: string;
};

type CalBookingResponse = {
  data?: unknown;
  error?: {
    message?: string;
  };
  message?: string;
};

const eventTypeIds: Record<string, number> = {
  fbd: 5540109,
  "full-exterior-detail": 5589678,
  "full-interior-detail": 5589707,
};

const fixedServiceAddresses: Record<string, string> = {
  fbd: "695 Morewood Crescent",
  "full-exterior-detail": "695 Morewood Crescent",
  "full-interior-detail": "695 Morewood Crescent",
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as BookingRequest;
  const eventTypeId = body.service ? eventTypeIds[body.service] : undefined;
  const isBusinessLocation = body.locationType === "business";
  const locationAddress = isBusinessLocation && body.service ? fixedServiceAddresses[body.service] : body.address;

  if (!eventTypeId || !body.start || !body.name || !body.email || !locationAddress) {
    return Response.json({ message: "Please complete the booking details." }, { status: 400 });
  }

  const phoneNumber = normalizeNorthAmericanPhone(body.phone);
  const calLocation = isBusinessLocation
    ? {
        type: "address",
        address: locationAddress,
        public: true,
      }
    : {
        type: "attendeeAddress",
        address: locationAddress,
      };

  const response = await fetch("https://api.cal.com/v2/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cal-api-version": "2026-02-25",
      ...(process.env.CAL_API_KEY ? { Authorization: `Bearer ${process.env.CAL_API_KEY}` } : {}),
    },
    body: JSON.stringify({
      start: new Date(body.start).toISOString(),
      eventTypeId,
      attendee: {
        name: body.name,
        email: body.email,
        phoneNumber,
        timeZone: body.timeZone || "America/Toronto",
        language: "en",
      },
      bookingFieldsResponses: {
        attendeePhoneNumber: phoneNumber || "",
        location: locationAddress,
      },
      location: calLocation,
      metadata: {
        source: "shiny-beak-custom-site",
      },
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as CalBookingResponse;

  if (!response.ok) {
    return Response.json(
      { message: data.error?.message || data.message || "Cal.com could not complete this booking." },
      { status: response.status },
    );
  }

  return Response.json({ booking: data.data || data });
}

function normalizeNorthAmericanPhone(value?: string) {
  if (!value) {
    return undefined;
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return value.startsWith("+") ? value : `+${digits}`;
}
