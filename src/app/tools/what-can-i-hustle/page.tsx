import { HustleTool } from "@/components/HustleTool";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "What Can I Hustle? · GENZLAB 🇳🇬",
  description:
    "5 realistic Nigerian income experiments tailored to your location, money, skills, and hours. No scams.",
  path: "/tools/what-can-i-hustle",
});

export default function Page() {
  return <HustleTool />;
}
