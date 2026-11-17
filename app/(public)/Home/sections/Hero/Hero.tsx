"use client";

import { FC } from "react";
import styles from "./Hero.module.scss";
import Image from "next/image";
import Carousel from "@/components/Carousel/Carousel";
import { useScrollSections } from "@/hooks/useScrollSections";
import { navigationItems } from "@/constants/navigation";
import { useRouter } from "next/navigation";

const heroImages = [
  "/images/hero-bg.jpg",
  "/images/hero-bg-2.jpg",
  "/images/hero-bg.jpg",
];

const Hero: FC = () => {
  const { scrollToSection } = useScrollSections({
    sectionIds: navigationItems.map((item) => item.id),
  });
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.carouselContainer}>
        <Carousel
          options={{
            loop: true,
          }}
          dotsPosition="left"
          showArrows={false}
          autoPlayDelay={7000}
        >
          {heroImages?.map((image, index) => (
            <div key={index} className={styles.slide}>
              <Image
                src={image}
                alt="Hero Background"
                fill
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                className={styles.heroBgImage}
              />
            </div>
          ))}
        </Carousel>

        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Welcome to</span>
        <h1 className={styles.title}>
          Livingwater
          <br />
          Community Church
        </h1>
        <p className={styles.subtitle}>
          Love God. Love People. Make Disciples.
        </p>

        <div className={styles.buttonContainer}>
          <button
            className={styles.primaryBtn}
            onClick={() => scrollToSection("service-times")}
          >
            Join us this Sunday
          </button>
          <button
            className={styles.secondaryBtn}
            onClick={() => router.push("/about")}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
