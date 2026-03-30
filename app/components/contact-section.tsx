"use client";

import { FormEvent, useState } from "react";

type ContactStatus =
  | { type: "idle"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const INITIAL_STATUS: ContactStatus = {
  type: "idle",
  message: "",
};

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(INITIAL_STATUS);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setStatus({
        type: "error",
        message: "Please add your name so we know who this is from.",
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus({
        type: "error",
        message: "Please enter a valid reply email.",
      });
      return;
    }

    if (trimmedMessage.length < 12) {
      setStatus({
        type: "error",
        message: "Please add a little more detail so we can help.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus(INITIAL_STATUS);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setStatus({
          type: "error",
          message:
            data?.error || "Could not send your message right now. Please try again.",
        });
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setStatus({
        type: "success",
        message: "Message sent. We will read it soon.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Could not send your message right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/45">
        Contact Us
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-white">
        Questions, bugs, or ideas for making StyleScore better
      </h3>
      <p className="mt-3 max-w-xl leading-7 text-white/68">
        Send us what you ran into, what felt unclear, or what you want the product
        to do next. We read this feedback and use it to improve the experience.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/72">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-black/30"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white/72">
              Reply email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-black/30"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-white/72">
            Message
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-300/50 focus:bg-black/30"
            placeholder="Tell us what you noticed, what felt broken, or what would help."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-orange-400 px-6 py-3 font-semibold text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </button>

          <p
            aria-live="polite"
            className={`text-sm ${
              status.type === "error"
                ? "text-red-300"
                : status.type === "success"
                  ? "text-emerald-300"
                  : "text-white/45"
            }`}
          >
            {status.message || "We will only use this to respond and improve the product."}
          </p>
        </div>
      </form>
    </div>
  );
}
