import { SayTool } from "@/components/SayTool";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "What Do I Say? · GENZLAB 🇳🇬",
  description:
    "Paste their message, pick a vibe, get 3 natural Nigerian Gen-Z replies you can actually send — Flirty, Funny, Savage, and more.",
  path: "/tools/what-do-i-say",
  imageAlt: "What Do I Say? — GENZLAB reply coach",
});

export default function Page() {
  return <SayTool />;
}
