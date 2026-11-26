"use client";

import { useActionState, useEffect, useOptimistic } from "react";
import { addReview } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import { useToast } from "@/components/ToastProvider";

const initialState = { errors: {}, values: {} };

export default function ReviewBoard({ slug, reviews }) {
  const toast = useToast();
  const [state, formAction] = useActionState(addReview, initialState);
  const [shown, addShown] = useOptimistic(reviews, (list, review) => [...list, review]);

  function submit(formData) {
    addShown({
      name: formData.get("name"),
      rating: Number(formData.get("rating")),
      text: formData.get("text"),
      sending: true,
    });
    return formAction(formData);
  }

  useEffect(() => {
    if (state.ok) toast("Review added");
    if (state.failed) toast("Could not save your review", "error");
  }, [state, toast]);

  return (
    <div>
      <ul className="mt-4 space-y-2">
        {shown.map((review, index) => (
          <li key={index} className={review.sending ? "opacity-60" : ""}>
            {`${review.name}: ${review.rating}/5, ${review.text}`}
          </li>
        ))}
      </ul>
      <form action={submit} id="review-form" className="mt-6 space-y-2">
        <input
          name="name"
          defaultValue={state.values?.name}
          placeholder="Your name"
          className="block rounded-lg border bg-surface px-3 py-2"
        />
        {state.errors.name && (
          <p className="text-sm text-red-600">{state.errors.name[0]}</p>
        )}
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          defaultValue={state.values?.rating}
          placeholder="Rating, 1 to 5"
          className="block rounded-lg border bg-surface px-3 py-2"
        />
        {state.errors.rating && (
          <p className="text-sm text-red-600">{state.errors.rating[0]}</p>
        )}
        <textarea
          name="text"
          defaultValue={state.values?.text}
          placeholder="Your review"
          className="block w-full rounded-lg border bg-surface px-3 py-2"
        />
        {state.errors.text && (
          <p className="text-sm text-red-600">{state.errors.text[0]}</p>
        )}
        <input type="hidden" name="trail" value={slug} />
        <SubmitButton>Add review</SubmitButton>
      </form>
    </div>
  );
}
