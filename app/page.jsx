"use client";

import withAuth from "@/utils/withAuth";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Upload from "./sidebarcomp/Upload/Upload";
import Logout from "./sidebarcomp/Logout/Logout";
import View from "./sidebarcomp/View/View";
import styles from "./home.module.scss";

function Home() {
  const [selectedPage, setSelectedPage] = useState("Upload");
  const renderPage = () => {
    switch (selectedPage) {
      // case "Overview":
      //   return <Body navigateToPage={navigateToPage} />;
      case "Upload":
        return <Upload />;
      case "View":
        return <View />;
      case "Logout":
        return <Logout />;
      default:
        return <View />;
    }
  };
  return (
    <>
      <Sidebar setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
      <main className={styles.mainPage}>{renderPage()}</main>
    </>
  );
}

export default withAuth(Home);

// export const Dashboard = () => {
//   const navigateToPage = (page, tab) => {
//     if (page === "Messages" && tab) {
//       localStorage.setItem("selectedTab", tab); // Store the selected tab
//     }
//     setSelectedPage(page);
//   };
// };
