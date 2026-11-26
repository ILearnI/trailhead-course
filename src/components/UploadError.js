const MESSAGES = {
  missing: "Choose a photo.",
  type: "Use a JPEG, PNG or WebP image.",
  size: "The photo must be under 2 MB.",
};

export default async function UploadError({ searchParams }) {
  const { error } = await searchParams;
  if (!error) return null;

  return <p role="alert" className="mt-4 text-sm text-red-600">{MESSAGES[error]}</p>;
}
