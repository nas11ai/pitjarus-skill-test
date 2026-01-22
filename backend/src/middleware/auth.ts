import type { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase.ts";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await auth.verifyIdToken(token);

    const name =
      typeof decodedToken["name"] === "string"
        ? decodedToken["name"]
        : undefined;

    req.user = {
      uid: decodedToken.uid,
      ...(decodedToken.email && { email: decodedToken.email }),
      ...(name && { name }),
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
