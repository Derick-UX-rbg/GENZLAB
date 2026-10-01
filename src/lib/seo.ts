import type { Metadata } from "next";

export const SITE_URL = "https://genzlab.onrender.com";
export const OG_IMAGE_PATH = "/og.png";

const DEFAULT_TITLE = "GENZLAB 🇳🇬 — Tiny AI tools for Nigerian Gen Z";
const DEFAULT_DESCRIPTION =
  "Money. Hustle. Dating. Content. Life. One problem at a time. Lightweight AI utilities for real-life Nigerian problems.";

export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  imageAlt?: string;
}): Metadata {
  const url = opts.path ? `${SITE_URL}${opts.path}` : SITE_URL;
  const imageAlt = opts.imageAlt || "GENZLAB — Tiny AI tools for Nigerian problems";

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: "GENZLAB",
      locale: "en_NG",
      type: "website",
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export const rootMetadata: Metadata = {
  ...buildMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  metadataBase: new URL(SITE_URL),
  applicationName: "GENZLAB",
  keywords: [
    "GENZLAB",
    "Nigeria",
    "Gen Z",
    "AI tools",
    "dating replies",
    "freelance pricing",
    "side hustle",
    "situationship",
    "content tips",
  ],
};
