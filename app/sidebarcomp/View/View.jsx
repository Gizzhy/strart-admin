import React, {useState} from "react";
import styles from "./styles/view.module.scss";
import Male from "./viewcomponents/Male";
import Female from "./viewcomponents/Female";
import Kids from "./viewcomponents/Kids";

const View = () => {
  const [activeSection, setActiveSection] = useState("Male");
  const renderContent = () => {
    switch (activeSection) {
      case "Male":
        return <Male />;
      case "Female":
        return <Female />;
      case "Kids":
        return <Kids />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className={styles.view}>
        <div>
          <div className={styles.navbar}>
            <div
              onClick={() => setActiveSection("Male")}
              className={`${styles.navItem} ${
                activeSection === "Male" ? styles.active : ""
              }`}
            >
              MALE
            </div>
            <div
              onClick={() => setActiveSection("Female")}
              className={`${styles.navItem} ${
                activeSection === "Female" ? styles.active : ""
              }`}
            >
              FEMALE
            </div>
            <div
              onClick={() => setActiveSection("Kids")}
              className={`${styles.navItem} ${
                activeSection === "Kids" ? styles.active : ""
              }`}
            >
              KIDS
            </div>
          </div>

          <div className={styles.content}>{renderContent()}</div>
        </div>
      </div>
    </>
  );
};

export default View;
