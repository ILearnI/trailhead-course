import { trailParams } from "@/lib/trails";
import Modal from "@/components/Modal";
import PhotoContent from "@/components/PhotoContent";

export function generateStaticParams() {
  return trailParams();
}

export default async function PhotoModal({ params }) {
  const { slug } = await params;

  return (
    <Modal>
      <PhotoContent slug={slug} />
    </Modal>
  );
}
