"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faImages,
  faClock,
  faClockRotateLeft,
  faUsers,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AdminSidebar.module.scss";
import type { AdminUser } from "@/types";

type Props = {
  user: AdminUser;
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: faGauge },
  { label: "Carousel Slides", href: "/admin/carousels", icon: faImages },
  { label: "Service Times", href: "/admin/service-times", icon: faClock },
  { label: "Change History", href: "/admin/history", icon: faClockRotateLeft },
];

const AdminSidebar: FC<Props> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const allItems =
    user.role === "supreme_admin"
      ? [...navItems, { label: "Users", href: "/admin/users", icon: faUsers }]
      : navItems;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image
          src="/images/lcc-logo.png"
          alt="LCC"
          width={140}
          height={42}
          priority
        />
      </div>

      <nav className={styles.nav}>
        {allItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <p className={styles.userEmail}>{user.email}</p>
          <p className={styles.userRole}>{user.role.replace("_", " ")}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
