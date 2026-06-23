import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the outer circle
  const springX = useSpring(mouseX, { stiffness: 300, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    // Check if device supports touch (disable cursor if true)
    const checkTouch = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      // Elements that should trigger the expand effect
      const target = e.target.closest(
        "a, button, input, select, textarea, .cursor-pointer, [role='button']"
      );
      if (target) setIsHovering(true);
      else setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Circle (Spring physics) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-[#8B6914] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
          opacity: isHovering ? 0.3 : 0.6,
          backgroundColor: isHovering ? "#8B6914" : "transparent",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      {/* Inner Dot (Instant) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-[#8B6914] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          width: 6,
          height: 6,
          opacity: isHovering ? 0 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
