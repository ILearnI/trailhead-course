import Team from "./team";
import Callout from "@/components/Callout";
import Button from "@/components/Button";
import TrailStats from "@/components/TrailStats";
import StatCard from "@/components/StatCard";
import Pill from "@/components/Pill";
import Forecast from "@/components/Forecast";
import SiteName from "@/components/SiteName";
import ServerInfo from "@/components/ServerInfo";

export const metadata = {
  title: "About",
  description:
    "Who we are, and why we build Trailhead: a free trail guide, written by hikers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">About Trailhead</h1>
      <p className="mt-4 text-zinc-600">
        A trail guide and community for people who love the outdoors.
      </p>
      <h2 className="mt-8 text-xl font-semibold">Who we are</h2>
      <Team />
      <Callout>Every trail guide on Trailhead is free to read.</Callout>
      <Pill>Free to read</Pill>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="6" label="trails" highlight />
        <StatCard value="48" label="km" />
        <StatCard value="120" label="reviews" />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button>Browse trails</Button>
        <Button variant="outline">Read reviews</Button>
        <Button variant="ghost" size="sm" className="ml-auto">Hide</Button>
        <Button disabled>Coming soon</Button>
      </div>
      <TrailStats />
      <Forecast />
      <SiteName />
      <ServerInfo />
    </main>
  );
}
