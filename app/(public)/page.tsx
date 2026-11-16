import Home from "./Home/Home";
import { siteUrl } from "@/app/layout";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Livingwater Community Church",
  alternateName: "LCC",
  description:
    "We exist to glorify God, by loving Him and our neighbors, preaching His Word, making disciples, and serving with compassion.",
  url: siteUrl,
  logo: `${siteUrl}/images/lcc-logo.png`,
  image: `${siteUrl}/images/hero-bg.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bukal Rd",
    addressLocality: "Tanza",
    postalCode: "4108",
    addressRegion: "Cavite",
    addressCountry: "PH",
  },
  hasMap: "https://maps.google.com/?q=9VR6%2BVQM+Bukal+Rd+Tanza+Cavite",
  telephone: "+639686646782",
  email: "livingwater@gmail.com",
  sameAs: [
    "https://www.facebook.com/livingwatercommunitychurch",
    "https://www.youtube.com/@LivingwaterCommunityChurch",
    "https://twitter.com/LivingwaterChurch",
    "https://www.instagram.com/livingwatercommunitychurch",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "07:40",
      closes: "08:00",
      description: "Morning Devotion — LCC Worship Hall",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "10:00",
      description: "Sunday Service — LCC Worship Hall",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:30",
      closes: "12:00",
      description: "Sunday School — LCC Worship Hall",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Wednesday",
      opens: "19:30",
      closes: "21:00",
      description: "Prayer Meeting — Online / Face to Face",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Thursday", "Friday", "Saturday"],
      opens: "14:00",
      closes: "18:00",
      description: "Outreach Bible Study — Various Locations",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "04:00",
      closes: "05:30",
      description: "Dawn Watch — LCC Worship Hall",
    },
  ],
};

export default function App() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
}
