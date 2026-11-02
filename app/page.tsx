import Home from "./Home/Home";
import { siteUrl } from "./layout";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Livingwater Community Church",
  alternateName: "LCC",
  description:
    "A Christ-centered church in Tanza, Cavite committed to loving God, loving people, and making disciples.",
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
      opens: "08:00",
      closes: "10:00",
      description: "Sunday Service — LCC Worship Hall",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Wednesday",
      opens: "19:30",
      closes: "21:00",
      description: "Prayer Meeting — Online / Face to Face (last Wednesday)",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Monday",
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
