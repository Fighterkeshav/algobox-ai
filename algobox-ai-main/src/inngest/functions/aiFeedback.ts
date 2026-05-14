// AI Feedback function - server-side only via API
// This module defines the event shape for frontend use

export interface AiFeedbackEvent {
  name: "user.completed.lab";
  data: {
    userId: string;
    labId: string;
    score: number;
    submissionId: string;
  };
}

export async function sendAiFeedbackEvent(data: AiFeedbackEvent["data"]) {
  const response = await fetch("/api/inngest-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "user.completed.lab", data }),
  });
  if (!response.ok) throw new Error("Failed to send AI feedback event");
  return response.json();
}
