"use client";
import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 mt-20 border border-red-200">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-4">{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
