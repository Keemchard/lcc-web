import { IconWithLabel } from "@/components/Card/Card";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons/faFacebookMessenger";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";

export const contactInfo: IconWithLabel[] = [
  { label: "09686646782", icon: faPhone },
  { label: "09305193102", icon: faPhone },
  { label: "livingwater@gmail.com", icon: faEnvelope },
  { label: "Livingwater Community church", icon: faFacebookMessenger },
];

type SocMedAccount = {
  name: string;
  url: string;
  icon: IconWithLabel["icon"];
};

export const socMedAccounts: SocMedAccount[] = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/livingwatercommunitychurch",
    icon: faFacebook,
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/@LivingwaterCommunityChurch",
    icon: faYoutube,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/LivingwaterChurch",
    icon: faTwitter,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/livingwatercommunitychurch",
    icon: faInstagram,
  },
];
