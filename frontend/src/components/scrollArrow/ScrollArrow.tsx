// import React from 'react'
import styles from "./scrollArrow.module.scss";
import React, { useState } from "react";
import arrowImg from "@/assets/images/btmtop.png";

export default function ScrollArrow() {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 300) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 300) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  return (
    <div>
      <img
        src={arrowImg}
        alt="toTop"
        className={styles.scrollTop}
        onClick={scrollTop}
        style={{ height: 40, display: showScroll ? "flex" : "none" }}
      />
    </div>
  );
}
