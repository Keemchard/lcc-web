import { CardProps } from "@/components/Card/Card";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";

const serviceTime: CardProps[] = [
  {
    img: "/images/sunday-service.jpg",
    title: "Sunday Service",
    // subtitle:
    //   "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, eligendi! Lorem ipsum dolor sit amet.",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "8:00 AM",
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
    img: "/images/virtual-prayer-meeting.jpg",
    title: "Prayer Meeting",
    // subtitle:
    //   "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, eligendi! Lorem ipsum dolor sit amet.",
    cta: {
      label: "Join Online",
    },
    list: [
      {
        icon: faClock,
        label: "7:30 PM",
      },
      {
        icon: faLocationDot,
        label: "Online",
      },
      {
        icon: faMicrophone,
        label: "Rev. Robert De Guzman",
      },
    ],
  },
  {
    img: "/images/dawn-watch.jpg",
    title: "Dawn Watch",
    // subtitle:
    //   "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet, eligendi! Lorem ipsum dolor sit amet.",
    cta: {
      label: "Learn More",
    },
    list: [
      {
        icon: faClock,
        label: "4:00 AM",
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
