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
  faBookBible,
  faPeopleGroup,
  faHandHoldingHeart,
  faEye,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./WhoWeAre.module.scss";
import Footer from "@/components/Footer/Footer";

const coreValues = [
  {
    id: 1,
    letter: "L",
    icon: faHeart,
    title: "Love for God and people",
    body: "We are called to love the Lord our God with all our heart, soul, and mind, and to love our neighbors as ourselves.",
    verse: "Matthew 22:37–39",
  },
  {
    id: 2,
    letter: "C",
    icon: faBookBible,
    title: "Commitment to the Word of God",
    body: "We are devoted to studying, teaching, and living out the Scriptures, rightly handling the word of truth in every aspect of life and ministry.",
    verse: "2 Timothy 2:15",
  },
  {
    id: 3,
    letter: "C",
    icon: faPeopleGroup,
    title: "Called and commissioned to make disciples",
    body: "We are sent to go and make disciples of all nations, baptizing them and teaching them to obey everything Christ has commanded.",
    verse: "Matthew 28:19–20",
  },
];

const beliefs = [
  {
    id: 1,
    title: "The Holy Scriptures",
    body: "We believe the Bible is the inspired and infallible Word of God, the ultimate authority for faith and life.",
  },
  {
    id: 2,
    title: "The Trinity",
    body: "We believe in one God eternally existing in three persons — Father, Son, and Holy Spirit — equal in power and glory.",
  },
  {
    id: 3,
    title: "Salvation by Grace",
    body: "Salvation is a gift of God's grace through faith in Jesus Christ alone. No one can earn it by works, but it is received through repentance and belief.",
  },
  {
    id: 4,
    title: "The Church",
    body: "We believe the Church is the body of Christ, called to worship, grow, and bear witness to His kingdom in the world.",
  },
  {
    id: 5,
    title: "The Holy Spirit",
    body: "The Holy Spirit indwells every believer, empowering them for life, ministry, and bearing fruit that glorifies God.",
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
    bio: "Leading LCC in worship, teaching, and pastoral care as the church continues to grow and serve the community of Tanza, Cavite.",
  },
  {
    id: 2,
    initials: "RD",
    name: "Rev. Robert De Guzman",
    role: "Associate Pastor",
    bio: "Shepherding the congregation through prayer meetings, Dawn Watch, and outreach Bible studies across the neighborhoods of Tanza.",
  },
];

const ministries = [
  "Couples' Fellowship",
  "Youth Joint Fellowship",
  "Prayer Rally",
  "Daily Vacation Bible School",
  "Libreng Almusal (free breakfast outreach)",
  "Water Baptism",
  "Outreach Bible Study",
  "Food Ministry",
  "Bible Study Ministry",
  "Dawn Watch",
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
          sizes="100vw"
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
            A Christ-centered community in Tanza, Cavite — loving God, loving
            people, and making disciples for over 42 years.
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
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                className={styles.pageHeroBg}
              />
            </div>

            <div className={styles.storyText}>
              <span className={styles.eyebrow}>Our Story</span>
              <h2 className={styles.storyTitleLeft}>
                Over four decades of faithfulness
              </h2>
              <div className={styles.divider} style={{ marginInline: 0 }} />
              <p className={styles.storyBody}>
                Founded in 1984, Livingwater Community Church began as a small
                gathering of believers in Tanza, Cavite with a simple calling:
                to glorify God by loving Him, loving people, and making
                disciples. What started as a humble fellowship has grown into a
                vibrant church family that has been serving the community for
                over 42 years.
              </p>
              <p className={styles.storyBody}>
                Throughout the decades, LCC has remained rooted in God&apos;s
                Word, growing and going by God&apos;s grace, and bearing fruit
                for God&apos;s glory. From Sunday worship services and midweek
                prayer meetings to community outreach programs like Libreng
                Almusal and neighborhood Bible studies, the church continues to
                reach out beyond its walls.
              </p>
              <p className={styles.storyBody}>
                Today, LCC is a place where families, youth, and individuals
                come together to worship, grow in faith, and serve one another.
                Whether it&apos;s through Couples&apos; Fellowship, Youth Joint
                Fellowship, Dawn Watch, or our Food Ministry, every member is
                encouraged to use their gifts to build up the body of Christ and
                impact the community for God&apos;s glory.
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
                Glorifying God through love, the Word, and discipleship
              </h3>
              <p className={styles.mvBody}>
                We exist to glorify God, by loving Him and our neighbors,
                preaching His Word, making disciples, and serving with
                compassion.
              </p>
            </div>

            <div className={styles.mvCard}>
              <FontAwesomeIcon icon={faEye} className={styles.mvIcon} />
              <span className={styles.mvLabel}>Our Vision</span>
              <h3 className={styles.mvTitle}>
                Equipping every member for evangelism and discipleship
              </h3>
              <p className={styles.mvBody}>
                A Christ-centered church where every member is equipped to
                evangelize and make disciples to impact the community and beyond
                for God&apos;s glory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values (L-C-C) ──────────────────────── */}
      <section className={`${styles.section} ${styles.valuesSection}`}>
        <div className={styles.inner}>
          <div className={styles.valuesHeader}>
            <span className={styles.eyebrow}>What guides us</span>
            <h2 className={styles.sectionTitle}>
              Our core values: L–C–C
            </h2>
            <div className={styles.divider} />
            <p className={styles.sectionDesc}>
              Our values spell out who we are — Livingwater Community Church.
              They are grounded in Scripture and shape everything we do.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {coreValues.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <div className={styles.valueLetter}>{value.letter}</div>
                <FontAwesomeIcon
                  icon={value.icon}
                  className={styles.valueIcon}
                />
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueBody}>{value.body}</p>
                <span className={styles.valueVerse}>{value.verse}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Believe ───────────────────────────── */}
      <section className={`${styles.section} ${styles.believeSection}`}>
        <div className={styles.inner}>
          <div className={styles.believeHeader}>
            <span className={styles.eyebrow}>Our foundation</span>
            <h2 className={styles.sectionTitle}>What we believe</h2>
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

      {/* ── Ministries ───────────────────────────────── */}
      <section className={`${styles.section} ${styles.valuesSection}`}>
        <div className={styles.inner}>
          <div className={styles.valuesHeader}>
            <span className={styles.eyebrow}>Get involved</span>
            <h2 className={styles.sectionTitle}>Our ministries</h2>
            <div className={styles.divider} />
            <p className={styles.sectionDesc}>
              There is a place for everyone at LCC. Whether you want to serve,
              learn, or fellowship, we have ministries that will help you grow
              and make a difference.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {ministries.map((ministry, index) => (
              <div key={index} className={styles.valueCard}>
                <FontAwesomeIcon
                  icon={
                    [
                      faHandsHolding,
                      faPeopleGroup,
                      faCross,
                      faBookBible,
                      faHandHoldingHeart,
                      faChurch,
                      faBookBible,
                      faHandHoldingHeart,
                      faBookBible,
                      faCross,
                    ][index]
                  }
                  className={styles.valueIcon}
                />
                <h3 className={styles.valueTitle}>{ministry}</h3>
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
              The team
            </span>
            <h2 className={`${styles.sectionTitle} ${styles.light}`}>
              Our leadership
            </h2>
            <div className={styles.divider} />
            <p className={`${styles.sectionDesc} ${styles.light}`}>
              Our pastors are committed to serving, shepherding, and equipping
              the church for every good work.
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
          <h2 className={styles.ctaTitle}>Come and see for yourself</h2>
          <p className={styles.ctaBody}>
            We would love to have you join us this Sunday. No matter where you
            are in your faith journey, there is a place for you here at
            Livingwater Community Church. Come and experience the warmth of our
            church family.
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => router.push("/#service-times")}
          >
            View service times
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
