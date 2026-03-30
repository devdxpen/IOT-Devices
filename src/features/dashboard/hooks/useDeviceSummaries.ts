import { useEffect, useState } from "react";
import { Device } from "@/types";
import { getDeviceSummaries } from "../api/deviceApi";

export function useDeviceSummaries() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = () => {
    setIsLoading(true);
    let isMounted = true;
    getDeviceSummaries()
      .then((result) => {
        if (isMounted) {
          setDevices(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDevices([]);
          setIsLoading(false);
        }
      });

    // Return cleanup function to allow using this inside useEffect easily if needed,
    // though for manual refetching returning nothing is also fine.
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    const cleanup = fetchDevices();
    return cleanup;
  }, []);

  return { data: devices, isLoading, refetch: fetchDevices };
}
