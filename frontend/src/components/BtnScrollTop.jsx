import { useState, useEffect } from "react";
import { BsArrowUp } from "react-icons/bs";

function BtnScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return visible ? (
    <button
      className="btn-scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
    >
      <BsArrowUp />
    </button>
  ) : null;
}

export default BtnScrollTop;