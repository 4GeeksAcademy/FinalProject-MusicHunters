import React from "react";

export const ScrollNavigateToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <button
      className="btn button-to-scroll d-flex ms-auto"
      type="button"
      onClick={scrollToTop}
    >
      Go to Top
    </button>
  );
};
