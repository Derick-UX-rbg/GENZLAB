import { ChargeTool } from "@/components/ChargeTool";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "What Should I Charge? · GENZLAB 🇳🇬",
  description:
    "Service, experience, client, and scope → a realistic pricing range, negotiation tips, and a ready message. Estimate only.",
  path: "/tools/what-should-i-charge",
});

export default function Page() {
  return <ChargeTool />;
}
