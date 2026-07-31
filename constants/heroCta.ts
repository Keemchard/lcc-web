import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChurch,
  faClock,
  faLocationDot,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

type HeroCta = {
  id: number;
  label: string;
  icon: IconDefinition;
  href?: string;
  redirectUrl?: string;
  sectionId?: string;
};

export const heroCta: HeroCta[] = [
  {
    id: 1,
    label: "WHO WE ARE",
    icon: faChurch,
  },
  {
    id: 2,
    label: "SERVICE TIMES",
    icon: faClock,
    sectionId: "#service-times",
  },
  {
    id: 3,
    label: "LOCATION",
    icon: faLocationDot,
    sectionId: "#contact",
  },
  {
    id: 4,
    label: "JOIN LIVE",
    icon: faVideo,
  },
];
