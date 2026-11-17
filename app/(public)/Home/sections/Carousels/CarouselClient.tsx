"use client";

import { FC } from "react";
import Image from "next/image";
import Carousel from "@/components/Carousel/Carousel";
import styles from "./Carousels.module.scss";
import type { SerializedCarouselSlide } from "@/types";

type Props = {
  slides: SerializedCarouselSlide[];
};

const CarouselClient: FC<Props> = ({ slides }) => {
  return (
    <Carousel
      options={{
        loop: true,
        dragFree: false,
        align: "start",
        slidesToScroll: 1,
      }}
      showArrows={slides.length > 3}
    >
      {slides.map((slide, index) => (
        <div key={slide.id} className={styles.card}>
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            sizes="(max-width: 639px) 85vw, (max-width: 1023px) 45vw, 30vw"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className={styles.cardImage}
          />
          <div className={styles.cardOverlay} />
          <div className={styles.cardContent}>
            <span className={styles.cardTime}>{slide.time}</span>
            <h3 className={styles.cardTitle}>{slide.title}</h3>
            <p className={styles.cardDetails}>{slide.details}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselClient;
