"use client";

import { FC } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChurch,
  faCross,
  faHandsHolding,
  faHeart,
  faLightbulb,
  faPeopleGroup,
  faStar,
  faShieldHalved,
  faHandHoldingHeart,
  faEye,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./WhoWeAre.module.scss";
import Footer from "@/components/Footer/Footer";

const coreValues = [
  {
    id: 1,
    icon: faCross,
    title: "Faith",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    icon: faHeart,
    title: "Love",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: 3,
    icon: faPeopleGroup,
    title: "Community",
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: 4,
    icon: faStar,
    title: "Excellence",
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 5,
    icon: faShieldHalved,
    title: "Integrity",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
  },
  {
    id: 6,
    icon: faHandHoldingHeart,
    title: "Service",
    body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.",
  },
];

const beliefs = [
  {
    id: 1,
    title: "The Holy Scriptures",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. We believe the Bible is the inspired and infallible Word of God.",
  },
  {
    id: 2,
    title: "The Trinity",
    body: "We believe in one God eternally existing in three persons — Father, Son, and Holy Spirit — equal in power and glory.",
  },
  {
    id: 3,
    title: "Salvation by Grace",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Salvation is a gift of God's grace through faith in Jesus Christ alone.",
  },
  {
    id: 4,
    title: "The Church",
    body: "We believe the Church is the body of Christ, called to worship, grow, and bear witness to His kingdom in the world.",
  },
  {
    id: 5,
    title: "The Holy Spirit",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. The Holy Spirit indwells every believer and empowers them for life and ministry.",
  },
  {
    id: 6,
    title: "The Return of Christ",
    body: "We believe in the personal, visible, and bodily return of the Lord Jesus Christ to establish His eternal kingdom.",
  },
];

const leaders = [
  {
    id: 1,
    initials: "RS",
    name: "Rev. Raffy Salvador",
    role: "Senior Pastor",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.",
  },
  {
    id: 2,
    initials: "RD",
    name: "Rev. Robert De Guzman",
    role: "Associate Pastor",
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
  },
  {
    id: 3,
    initials: "JL",
    name: "Elder John Lim",
    role: "Elder / Worship",
    bio: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
  },
];

const WhoWeAre: FC = () => {
  const router = useRouter();

  return (
    <div className={styles.page}>
      {/* ── Page Hero ─────────────────────────────────── */}
      <section className={styles.pageHero}>
        <Image
          src="/images/hero-bg.jpg"
          alt="Livingwater Community Church"
          fill
          priority
          className={styles.pageHeroBg}
        />
        <div className={styles.pageHeroOverlay} />
        <div className={styles.pageHeroContent}>
          <span className={styles.pageHeroEyebrow}>
            Livingwater Community Church
          </span>
          <h1 className={styles.pageHeroTitle}>Who We Are</h1>
          <p className={styles.pageHeroSubtitle}>
            A Christ-centered community rooted in love, united in purpose, and
            sent to make disciples.
          </p>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────── */}
      <section className={`${styles.section} ${styles.storySection}`}>
        <div className={styles.inner}>
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <Image
                src="/images/sunday-service.jpg"
                alt="Our Story"
                fill
                className={styles.pageHeroBg}
              />
            </div>

            <div className={styles.storyText}>
              <span className={styles.eyebrow}>Our Story</span>
              <h2 className={styles.storyTitleLeft}>
                A Church Born out of Worship &amp; Prayer
              </h2>
              <div className={styles.divider} style={{ marginInline: 0 }} />
              <p className={styles.storyBody}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className={styles.storyBody}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Livingwater Community Church has
                been a beacon of hope in Tanza, Cavite since its founding.
              </p>
              <p className={styles.storyBody}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium totam rem aperiam eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────── */}
      <section className={`${styles.section} ${styles.mvSection}`}>
        <div className={styles.inner}>
          <div style={{ textAlign: "center" }}>
            <span className={styles.eyebrow} style={{ color: "#9dbde0" }}>
              Our Direction
            </span>
            <h2 className={`${styles.sectionTitle} ${styles.light}`}>
              Mission &amp; Vision
            </h2>
            <div className={styles.divider} />
          </div>

          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <FontAwesomeIcon icon={faBullseye} className={styles.mvIcon} />
              <span className={styles.mvLabel}>Our Mission</span>
              <h3 className={styles.mvTitle}>
                Love God. Love People. Make Disciples.
              </h3>
              <p className={styles.mvBody}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat.
              </p>
            </div>

            <div className={styles.mvCard}>
              <FontAwesomeIcon icon={faEye} className={styles.mvIcon} />
              <span className={styles.mvLabel}>Our Vision</span>
              <h3 className={styles.mvTitle}>
                A Vibrant Community Transforming Lives for God&apos;s Glory
              </h3>
              <p className={styles.mvBody}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium
                totam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────── */}
      <section className={`${styles.section} ${styles.valuesSection}`}>
        <div className={styles.inner}>
          <div className={styles.valuesHeader}>
            <span className={styles.eyebrow}>What Guides Us</span>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
            <div className={styles.divider} />
            <p className={styles.sectionDesc}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. These
              values shape our culture, decisions, and the way we love one
              another and our community.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {coreValues.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <FontAwesomeIcon
                  icon={value.icon}
                  className={styles.valueIcon}
                />
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueBody}>{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Believe ───────────────────────────── */}
      <section className={`${styles.section} ${styles.believeSection}`}>
        <div className={styles.inner}>
          <div className={styles.believeHeader}>
            <span className={styles.eyebrow}>Our Foundation</span>
            <h2 className={styles.sectionTitle}>What We Believe</h2>
            <div className={styles.divider} />
            <p className={styles.sectionDesc}>
              We hold to the historic Christian faith as expressed in the
              Scriptures. Here are the core convictions that anchor our
              community.
            </p>
          </div>

          <div className={styles.believeGrid}>
            {beliefs.map((belief) => (
              <div key={belief.id} className={styles.believeItem}>
                <span className={styles.believeNum}>{belief.id}</span>
                <div className={styles.believeContent}>
                  <h4 className={styles.believeTitle}>{belief.title}</h4>
                  <p className={styles.believeBody}>{belief.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ────────────────────────────────── */}
      <section className={`${styles.section} ${styles.leaderSection}`}>
        <div className={styles.inner}>
          <div className={styles.leaderHeader}>
            <span className={styles.eyebrow} style={{ color: "#9dbde0" }}>
              The Team
            </span>
            <h2 className={`${styles.sectionTitle} ${styles.light}`}>
              Our Leadership
            </h2>
            <div className={styles.divider} />
            <p className={`${styles.sectionDesc} ${styles.light}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our
              pastors and elders are committed to serving, shepherding, and
              equipping the church.
            </p>
          </div>

          <div className={styles.leaderGrid}>
            {leaders.map((leader) => (
              <div key={leader.id} className={styles.leaderCard}>
                <div className={styles.leaderPhoto}>
                  <span className={styles.leaderInitials}>
                    {leader.initials}
                  </span>
                </div>
                <div className={styles.leaderInfo}>
                  <h3 className={styles.leaderName}>{leader.name}</h3>
                  <span className={styles.leaderRole}>{leader.role}</span>
                  <p className={styles.leaderBio}>{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ──────────────────────────────────── */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className={styles.inner}>
          <h2 className={styles.ctaTitle}>Come &amp; See for Yourself</h2>
          <p className={styles.ctaBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. We would
            love to have you join us this Sunday. No matter where you are in
            your faith journey, there is a place for you here.
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => router.push("/#service-times")}
          >
            View Service Times
          </button>
        </div>
      </section>

      <div style={{ background: "#061521" }}>
        <Footer />
      </div>
    </div>
  );
};

export default WhoWeAre;
