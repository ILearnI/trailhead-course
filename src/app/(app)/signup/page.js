import SignUpForm from "@/components/SignUpForm";

export const metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-md p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <SignUpForm />
    </main>
  );
}
