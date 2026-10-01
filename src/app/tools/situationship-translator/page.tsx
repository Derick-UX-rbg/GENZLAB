import { SituationshipTool } from "@/components/SituationshipTool";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Situationship Translator · GENZLAB 🇳🇬",
  description:
    "Paste the confusing chat. Get an honest Nigerian Gen-Z read, red/green flags, and Soft / Direct / Soft-launch replies.",
  path: "/tools/situationship-translator",
  imageAlt: "Situationship Translator — GENZLAB",
});

export default function Page() {
  return <SituationshipTool />;
}
