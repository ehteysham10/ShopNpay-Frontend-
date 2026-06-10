import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Instantly scroll to the top without smooth transitions on page change
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
