"use client";

import Link from "next/link";
import { useId, useState } from "react";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-mint font-semibold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      QB
    </span>
  );
}

export function Button({
  children,
  type = "button",
  variant = "primary",
  disabled,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const styles = {
    primary: "bg-mint text-ink hover:brightness-95",
    secondary: "border border-line bg-card text-ink hover:bg-mint-soft",
    ghost: "text-muted hover:text-ink",
    danger: "bg-danger text-white hover:brightness-95",
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

const controlClass =
  "w-full rounded-xl border border-line bg-card px-3 py-2.5 text-base text-ink outline-none ring-mint focus:ring-2 sm:text-sm";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function PasswordInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="block space-y-1.5 text-sm">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          id={id}
          type={visible ? "text" : "password"}
          className={`${controlClass} pr-11 ${props.className ?? ""}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-4.1 4.9" />
      <path d="M6.1 6.1C3.7 7.9 2 12 2 12s3.5 6 10 6c1.6 0 3-.3 4.2-.9" />
    </svg>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${controlClass} min-h-24 ${props.className ?? ""}`}
    />
  );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-card p-4 sm:p-5 ${className}`}>
      {title ? <h2 className="break-words text-base font-semibold">{title}</h2> : null}
      {subtitle ? <p className="mt-1 break-words text-sm leading-6 text-muted">{subtitle}</p> : null}
      {children ? <div className={title || subtitle ? "mt-4" : ""}>{children}</div> : null}
    </section>
  );
}

export function Notice({
  tone = "error",
  children,
}: {
  tone?: "error" | "ok";
  children: React.ReactNode;
}) {
  const color = tone === "ok" ? "border-mint bg-mint-soft text-ink" : "border-danger/30 bg-danger/10 text-danger";
  return <p className={`rounded-xl border px-3 py-2 text-sm ${color}`}>{children}</p>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-8 text-center text-sm leading-6 text-muted">{children}</p>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="break-words text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 break-words text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="w-full sm:w-auto [&_a]:block [&_button]:w-full sm:[&_button]:w-auto">{action}</div> : null}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mb-4 inline-flex text-sm font-medium text-mint">
      {children}
    </Link>
  );
}

export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted">
      {label}
    </div>
  );
}

export function Chip({
  selected,
  children,
  onClick,
  disabled,
}: {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
        selected
          ? "border-mint bg-mint-soft text-ink"
          : "border-line bg-card text-muted"
      }`}
    >
      {children}
    </button>
  );
}
