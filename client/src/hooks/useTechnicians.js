import { useEffect, useState } from "react";
import { getTechnicians } from "../api/users.api";

export default function useTechnicians() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    getTechnicians().then(res => {
      setTechs(res.data.data);
    });
  }, []);

  return techs;
}
