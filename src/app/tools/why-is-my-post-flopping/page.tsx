import { FlopTool } from "@/components/FlopTool";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Why Is My Post Flopping? · GENZLAB 🇳🇬",
  description:
    "Honest diagnosis, 3 rewritten captions, and 3 concrete fixes for your next IG/TikTok/X/LinkedIn post.",
  path: "/tools/why-is-my-post-flopping",
});

export default function Page() {
  return <FlopTool />;
}
