import { Navbar } from "@/components/navbar";
import { Gallery } from "@/features/gallery/components/gallery";
import { currentUser } from "@/lib/auth";

export default async function GalleryPage() {
  const user = await currentUser();

  return (
    <div>
      <Navbar />
      <Gallery userId={user.id} />
    </div>
  );
}
