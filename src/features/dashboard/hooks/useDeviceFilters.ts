import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type DevicesViewMode = "grid" | "list";

export interface DeviceFilters {
  search: string;
  location: string;
  view: DevicesViewMode;
}

const DEFAULT_VIEW: DevicesViewMode = "grid";
const DEFAULT_LOCATION = "all";

function parseView(value: string | null): DevicesViewMode {
  return value === "list" ? "list" : "grid";
}

function setParamWithDefault(
  params: URLSearchParams,
  key: string,
  value: string | null | undefined,
  defaultValue: string,
) {
  if (!value || value === defaultValue) {
    params.delete(key);
    return;
  }
  params.set(key, value);
}

export function useDeviceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<DeviceFilters>(() => {
    const search = searchParams.get("q") ?? "";
    const location = searchParams.get("location") ?? DEFAULT_LOCATION;
    const view = parseView(searchParams.get("view"));
    return { search, location, view };
  }, [searchParams]);

  const updateParams = (next: Partial<DeviceFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    setParamWithDefault(params, "q", next.search ?? filters.search, "");
    setParamWithDefault(
      params,
      "location",
      next.location ?? filters.location,
      DEFAULT_LOCATION,
    );
    setParamWithDefault(
      params,
      "view",
      next.view ?? filters.view,
      DEFAULT_VIEW,
    );
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return {
    filters,
    setSearch: (value: string) => updateParams({ search: value }),
    setLocation: (value: string) => updateParams({ location: value }),
    setView: (value: DevicesViewMode) => updateParams({ view: value }),
  };
}
