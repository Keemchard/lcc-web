"use client";

import { FC } from "react";
import styles from "./Hero.module.scss";
import { heroCta } from "@/constants/heroCta";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Carousel from "@/components/Carousel/Carousel";
import { useScrollSections } from "@/hooks/useScrollSections";
import { navigationItems } from "@/constants/navigation";

const heroImages = [
  "/images/hero-bg.jpg",
  "/images/hero-bg.jpg",
  "/images/hero-bg.jpg",
];

const subtitle = "Love God. Love people. Make disciples.";

const Hero: FC = () => {
  const { scrollToSection } = useScrollSections({
    sectionIds: navigationItems.map((item) => item.id),
  });

  return (
    <div className={styles.container}>
      <div className={styles.carouselContainer}>
        <Carousel
          options={{
            loop: true,
          }}
          dotsPosition="left"
          showArrows={false}
          autoPlayDelay={10000}
        >
          {heroImages?.map((image) => (
            <div key={image} className={styles.slide}>
              <Image
                src={image}
                alt="Hero Background"
                fill
                priority
                className={styles.heroBgImage}
              />
            </div>
          ))}
        </Carousel>

        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>WELCOME TO OUR COMMUNITY</h3>

        <p className={styles.subtitle}>{subtitle.toUpperCase()}</p>

        <div className={styles.buttonContainer}>
          {heroCta.map((cta) => {
            const { id, label, icon, sectionId } = cta;

            return (
              <button
                key={id}
                className={styles.ctaButton}
                onClick={() => {
                  if (sectionId) {
                    scrollToSection(sectionId.slice(1));
                  }
                }}
              >
                <FontAwesomeIcon icon={icon} className={styles.ctaIcon} />

                <p className={styles.ctaLabel}>{label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Hero;
