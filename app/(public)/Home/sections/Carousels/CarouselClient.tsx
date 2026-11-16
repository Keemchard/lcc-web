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
      }}
    >
      {slides.map((slide, index) => (
        <div key={slide.id} className={styles.slide}>
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            sizes="100vw"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            className={styles.slideImage}
          />
          <div className={styles.slideOverlay} />
          <div className={styles.slideContent}>
            <h3 className={styles.slideTitle}>{slide.title}</h3>
            <p className={styles.slideDetails}>{slide.details}</p>
            <span className={styles.slideTime}>{slide.time}</span>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselClient;
