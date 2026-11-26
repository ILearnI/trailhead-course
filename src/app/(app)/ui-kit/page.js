import { Badge, Button, Card, Input, PageHeader } from "@/components/ui";

export default function UiKitPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <PageHeader title="UI kit" description="The blocks of Trailhead">
        <Button>Primary</Button>
      </PageHeader>
      <section className="flex gap-2">
        <Badge>Neutral</Badge>
        <Badge variant="success">Easy</Badge>
        <Badge variant="warning">Moderate</Badge>
      </section>
      <Card title="A card">
        <p className="text-muted">Any content goes here.</p>
      </Card>
      <Input label="Your name" placeholder="Ada" />
      <Input label="Email" error="Enter a valid email" />
    </main>
  );
}
