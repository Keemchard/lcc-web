import { FC } from "react";
import styles from "./Carousels.module.scss";
import CarouselClient from "./CarouselClient";
import { getCarouselSlides } from "@/lib/firestore/carousels";

const Carousels: FC = async () => {
  const slides = await getCarouselSlides();

  const themeMessage =
    "Rooted in God's Word, Growing and Going by God's Grace, Bearing fruit for God's Glory!";

  return (
    <section className={styles.container}>
      <div className={styles.themeMessage}>{themeMessage.toUpperCase()}</div>
      {slides.length > 0 ? (
        <CarouselClient slides={slides} />
      ) : (
        <div className={styles.emptyState}>
          <p>No slides available yet.</p>
        </div>
      )}
    </section>
  );
};

export default Carousels;
