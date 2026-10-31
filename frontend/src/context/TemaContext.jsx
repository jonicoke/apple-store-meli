import { createContext, useContext, useState, useEffect } from "react";

const TemaContext = createContext();

export function TemaProvider({ children }) {
  const [oscuro, setOscuro] = useState(() => {
    return localStorage.getItem("tema") === "oscuro";
  });

  useEffect(() => {
    document.body.classList.toggle("tema-oscuro", oscuro);
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
  }, [oscuro]);

  return (
    <TemaContext.Provider value={{ oscuro, setOscuro }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}