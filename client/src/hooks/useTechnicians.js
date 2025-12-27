import { useEffect, useState } from "react";
import { getTechnicians } from "../api/users.api";

export default function useTechnicians() {
  const [techs, setTechs] = useState([]); // always array

  useEffect(() => {
    let mounted = true;

    getTechnicians()
      .then((res) => {
        const list = res?.data?.data; // backend shape: { data: [...] }
        if (mounted) setTechs(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (mounted) setTechs([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return techs;
}