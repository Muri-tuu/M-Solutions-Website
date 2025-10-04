import type { NextFunction, Request, Response } from "express";

export function requestLogger() {
  return function logger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, url } = req;

    res.on("finish", () => {
      const durationMs = Date.now() - start;
      const status = res.statusCode;
      // Basic concise log line
      console.log(`${method} ${url} -> ${status} ${durationMs}ms`);
    });

    next();
  };
}
