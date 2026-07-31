"use client";

import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import styles from "./Carousel.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLessThan, faGreaterThan } from "@fortawesome/free-solid-svg-icons";

type CarouselProps = {
  children: ReactNode;
  options?: Parameters<typeof useEmblaCarousel>[0];
  dotsPosition?: "bottom" | "left";
  showArrows?: boolean;
  autoPlayDelay?: number;
};

const Carousel: FC<CarouselProps> = ({
  children,
  options,
  dotsPosition = "bottom",
  showArrows = true,
  autoPlayDelay = 4000,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({
      delay: autoPlayDelay,
      stopOnInteraction: false,
    }),
  ]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    handleSelect();

    emblaApi.on("select", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
    };
  }, [emblaApi]);

  return (
    <div className={styles.emblaWrapper}>
      <div className={styles.embla} ref={emblaRef}>
        <div className={styles.emblaContainer}>{children}</div>
      </div>

      {showArrows && (
        <>
          <button className={styles.prevButton} onClick={scrollPrev}>
            <FontAwesomeIcon icon={faLessThan} />
          </button>

          <button className={styles.nextButton} onClick={scrollNext}>
            <FontAwesomeIcon icon={faGreaterThan} />
          </button>
        </>
      )}

      <div
        className={`${styles.dotsContainer} ${
          dotsPosition === "left"
            ? styles.dotsContainerLeft
            : styles.dotsContainerBottom
        }`}
      >
        {Array.from({
          length: emblaApi?.scrollSnapList().length || 0,
        }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${
              index === selectedIndex ? styles.activeDot : ""
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
