import { FC } from "react";
import styles from "./Carousels.module.scss";
import Carousel from "@/components/Carousel/Carousel";

const Carousels: FC = () => {
  const slides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const themeMessage =
    "Rooted in God's Word, Growing and Going by God's Grace, Bearing fruit for God's Glory!";
  return (
    <section className={styles.container}>
      <div>{themeMessage.toUpperCase()}</div>
      <Carousel
        options={{
          loop: true,
          dragFree: false,
          align: "start",
        }}
      >
        {slides.map((slide) => (
          <div key={slide} className={styles.slide}>
            Slide {slide}
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Carousels;
