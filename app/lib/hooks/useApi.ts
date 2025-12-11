import { useEffect, useState } from "react";
import { API_URL } from "../utils/api";

export function useApi(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}${path}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        console.error("API Error:", err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [path]);

  return { data, loading };
}
