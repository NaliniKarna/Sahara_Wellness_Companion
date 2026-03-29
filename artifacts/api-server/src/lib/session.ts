import { Request } from "express";

export function getSessionId(req: Request): string {
  const headerSessionId = req.headers["x-session-id"] as string | undefined;
  if (headerSessionId) return headerSessionId;
  
  // Generate a default for requests without session
  return "guest-" + Math.random().toString(36).substring(2, 9);
}
