import { Suspense } from "react";
import PanelSkeleton from "@/components/PanelSkeleton";
import SlowPanel from "@/components/SlowPanel";
import UserCount from "@/components/UserCount";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <h1 className="text-3xl font-semibold">Profile</h1>
      <Suspense fallback={<PanelSkeleton />}>
        <UserCount />
      </Suspense>
      <Suspense fallback={<PanelSkeleton />}>
        <SlowPanel title="Live conditions" delay={1200} />
      </Suspense>
    </main>
  );
}
