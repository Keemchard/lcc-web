import type { Metadata } from "next";
import WhoWeAre from "./WhoWeAre";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Founded in 1984, Livingwater Community Church in Tanza, Cavite exists to glorify God by loving Him and our neighbors, preaching His Word, making disciples, and serving with compassion. Learn about our mission, vision, L-C-C core values, and ministries.",
  alternates: {
    canonical: "/about",
  },
};

export default function WhoWeArePage() {
  return <WhoWeAre />;
}
