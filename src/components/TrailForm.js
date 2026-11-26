"use client";

import { useActionState } from "react";
import Image from "next/image";
import { saveTrail } from "@/app/(app)/studio/trails/actions";

const REGIONS = ["alps", "coast", "forest"];
const LEVELS = ["Easy", "Moderate", "Hard"];
const CONTROL = "block w-full rounded-lg border bg-surface px-3 py-2";

// A label, a control, and the message of the field
function Field({ label, name, errors, children }) {
  const message = errors?.[0];
  return (
    <div>
      <label htmlFor={name} className="block text-sm">
        {label}
      </label>
      {children}
      {message && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}

export default function TrailForm({ trail }) {
  const initial = { errors: {}, values: trail ?? {} };
  const [state, action, pending] = useActionState(saveTrail, initial);
  const { errors, values } = state;
  const props = (name) => ({
    id: name,
    name,
    className: CONTROL,
    defaultValue: values[name] ?? "",
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={action} className="mt-6 max-w-md space-y-4">
      {trail && <input type="hidden" name="slug" value={trail.slug} />}
      <Field label="Name" name="name" errors={errors.name}>
        <input {...props("name")} />
      </Field>
      <Field label="Region" name="region" errors={errors.region}>
        <select {...props("region")}>
          <option value="">Choose...</option>
          {REGIONS.map((region) => (
            <option key={region}>{region}</option>
          ))}
        </select>
      </Field>
      <Field label="Level" name="level" errors={errors.level}>
        <select {...props("level")}>
          <option value="">Choose...</option>
          {LEVELS.map((level) => (
            <option key={level}>{level}</option>
          ))}
        </select>
      </Field>
      <Field label="Distance (km)" name="km" errors={errors.km}>
        <input {...props("km")} inputMode="decimal" />
      </Field>
      <Field label="Description" name="description" errors={errors.description}>
        <textarea {...props("description")} rows={4} />
      </Field>
      <Field label="Photo" name="photo" errors={errors.photo}>
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(errors.photo)}
          aria-describedby={errors.photo ? "photo-error" : undefined}
          className={CONTROL}
        />
        {trail?.photo && (
          <Image
            src={`/photos/${trail.photo}`}
            alt="Current photo"
            width={96}
            height={64}
            className="mt-2 rounded"
          />
        )}
      </Field>
      <button type="submit" disabled={pending} className="rounded-lg border px-4 py-2">
        {pending ? "Saving..." : "Save trail"}
      </button>
    </form>
  );
}
