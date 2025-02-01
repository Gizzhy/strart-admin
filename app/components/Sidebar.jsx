import React from "react";
import styles from "./sidebar.module.scss";
import Image from "next/image";
import logo from "../../assets/strart2.png";
import { RiLogoutBoxFill } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";

const Sidebar = ({ setSelectedPage, selectedPage }) => {
  const getActiveClass = (page) => (selectedPage === page ? styles.active : "");

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHead}>
          <Image src={logo} alt="strart" className={styles.logo} />
          {/* <span className={styles.dej}>Dejyle Venture</span> */}
        </div>
        <hr className={styles.line} />
        <div className={styles.sidebarLinks}>
          <div
            className={`${styles.view} ${getActiveClass("View")}`}
            onClick={() => setSelectedPage("View")}
          >
            <GoHomeFill className={styles.sidebarIcons} />
            <span className={styles.sidebarNav}>View products</span>
          </div>
          <div
            className={`${styles.upload} ${getActiveClass("Upload")}`}
            onClick={() => setSelectedPage("Upload")}
          >
            <FaFileUpload className={styles.sidebarIcons} />
            <span className={styles.sidebarNav}>Upload products</span>
          </div>
          <div
            className={`${styles.logout} ${getActiveClass("Logout")}`}
            onClick={() => setSelectedPage("Logout")}
          >
            <RiLogoutBoxFill className={styles.sidebarIcons} />
            <span className={styles.sidebarLogout}>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
