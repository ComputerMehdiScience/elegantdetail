type CalSlot = {
  start: string;
};

type CalSlotsResponse = {
  data?: Record<string, CalSlot[]>;
  error?: {
    message?: string;
  };
};

const calUsername = "shiny-beak-detailing-gzedbc";
const allowedServices = new Set(["full-exterior-detail", "full-interior-detail", "fbd"]);

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";
  const timeZone = searchParams.get("timeZone") || "America/Toronto";

  if (!allowedServices.has(service) || !start || !end) {
    return Response.json({ message: "Missing booking availability parameters.", slots: {} }, { status: 400 });
  }

  const slotsUrl = new URL("https://api.cal.com/v2/slots");
  slotsUrl.searchParams.set("eventTypeSlug", service);
  slotsUrl.searchParams.set("username", calUsername);
  slotsUrl.searchParams.set("start", start);
  slotsUrl.searchParams.set("end", end);
  slotsUrl.searchParams.set("timeZone", timeZone);

  const response = await fetch(slotsUrl, {
    headers: {
      "cal-api-version": "2024-09-04",
    },
    cache: "no-store",
  });

  const data = (await response.json()) as CalSlotsResponse;

  if (!response.ok) {
    return Response.json(
      { message: data.error?.message || "Cal.com availability is temporarily unavailable.", slots: {} },
      { status: response.status },
    );
  }

  return Response.json({
    slots: data.data || {},
    updatedAt: new Date().toISOString(),
  });
}
