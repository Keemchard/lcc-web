import type { Metadata } from "next";
import WhoWeAre from "./WhoWeAre";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Learn about Livingwater Community Church — our story, mission, vision, core values, beliefs, and leadership team in Tanza, Cavite.",
  alternates: {
    canonical: "/about",
  },
};

export default function WhoWeArePage() {
  return <WhoWeAre />;
}
