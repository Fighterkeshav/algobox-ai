// Weekly Report function - server-side only via API
// This module defines the event shape for frontend use

export interface WeeklyReportEvent {
  name: "user.progress.updated";
  data: {
    userId: string;
  };
}

export async function sendWeeklyReportEvent(data: WeeklyReportEvent["data"]) {
  const response = await fetch("/api/inngest-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "user.progress.updated", data }),
  });
  if (!response.ok) throw new Error("Failed to send weekly report event");
  return response.json();
}
