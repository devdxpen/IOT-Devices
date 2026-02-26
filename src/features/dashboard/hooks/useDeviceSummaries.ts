import { useEffect, useState } from "react";
import { DeviceSummary } from "@/types";
import { getDeviceSummaries } from "../api/deviceApi";

export function useDeviceSummaries() {
  const [data, setData] = useState<DeviceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getDeviceSummaries()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setData([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}
