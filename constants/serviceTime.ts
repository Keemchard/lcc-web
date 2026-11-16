import { CardProps } from "@/components/Card/Card";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";

const serviceTime: CardProps[] = [
  {
    img: "/images/sunday-service.jpg",
    title: "Morning Devotion",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "Sunday, 7:40 AM",
      },
      {
        icon: faLocationDot,
        label: "LCC Worship Hall",
      },
      {
        icon: faMicrophone,
        label: "Rev. Raffy Salvador",
      },
    ],
  },
  {
    img: "/images/sunday-service.jpg",
    title: "Sunday Service",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "Sunday, 8:00 AM",
      },
      {
        icon: faLocationDot,
        label: "LCC Worship Hall",
      },
      {
        icon: faMicrophone,
        label: "Rev. Raffy Salvador",
      },
    ],
  },
  {
    img: "/images/sunday-service.jpg",
    title: "Sunday School",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "Sunday, 10:30 AM",
      },
      {
        icon: faLocationDot,
        label: "LCC Worship Hall",
      },
      {
        icon: faMicrophone,
        label: "Church Leaders",
      },
    ],
  },
  {
    img: "/images/virtual-prayer-meeting.jpg",
    title: "Prayer Meeting",
    cta: {
      label: "Join Online",
    },
    list: [
      {
        icon: faClock,
        label: "Wednesday, 7:30 PM",
      },
      {
        icon: faLocationDot,
        label: "Online / Face to Face",
      },
      {
        icon: faMicrophone,
        label: "Rev. Robert De Guzman",
      },
    ],
  },
  {
    img: "/images/sunday-service.jpg",
    title: "Outreach Bible Study",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "Thu–Sat, 2:00–6:00 PM",
      },
      {
        icon: faLocationDot,
        label: "Various Locations",
      },
      {
        icon: faMicrophone,
        label: "Church Pastors",
      },
    ],
  },
  {
    img: "/images/dawn-watch.jpg",
    title: "Dawn Watch",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "Saturday, 4:00 AM",
      },
      {
        icon: faLocationDot,
        label: "LCC Worship Hall",
      },
      {
        icon: faMicrophone,
        label: "Rev. Robert De Guzman",
      },
    ],
  },
];

export default serviceTime;
