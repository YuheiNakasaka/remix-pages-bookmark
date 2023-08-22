import { useIsSubmitting } from "remix-validated-form";

export default function SubmitButton({
  text,
  name,
  value,
  color = "blue",
}: {
  text: string;
  name: string;
  value: string;
  color: "blue" | "red";
}) {
  const isSubmitting = useIsSubmitting();

  return (
    <div className="flex w-full flex-col gap-1">
      <button
        type="submit"
        name={name}
        value={value}
        className={`rounded bg-${color}-500 px-4 py-2 text-white hover:bg-${color}-600 focus:bg-${color}-400`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "..." : text}
      </button>
    </div>
  );
}
