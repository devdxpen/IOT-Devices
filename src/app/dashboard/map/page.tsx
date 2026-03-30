"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Device } from "@/types/device";

declare global {
  interface Window {
    google: any;
  }
}

const DUMMY_DEVICES: (Device & {
  lat: number;
  lng: number;
  address: string;
  area: string;
})[] = [
  {
    id: "dev-1",
    name: "Refrigerator t34",
    brandName: "Godrej",
    serialNumber: "dev-690345",
    company: "Godrej",
    status: "active",
    model: "T34",
    macAddress: "00:1A:2B:3C:4D:5E",
    industry: "Consumer Electronics",
    category: "Appliances",
    cluster: "North",
    group: "Home",
    lastDataTimestamp: "2025-07-27T10:45:00Z",
    users: 8,
    colorFlag: "green",
    alarms: 1,
    data: { t1: 24, t2: 50, t3: 50 },
    lat: 23.0396,
    lng: 72.566,
    address: "Tapovan Society, Nehrunagar, Ahmedabad, Gujarat",
    assignedUser: { name: "Priya Mehta" },
    isOnline: true,
    area: "Nehrunagar",
  },
  {
    id: "dev-2",
    name: "Refrigerator t34",
    brandName: "Godrej",
    serialNumber: "dev-690346",
    company: "Godrej",
    status: "active",
    model: "T34",
    macAddress: "00:1A:2B:3C:4D:5F",
    industry: "Consumer Electronics",
    category: "Appliances",
    cluster: "North",
    group: "Home",
    lastDataTimestamp: "2025-07-27T10:46:00Z",
    users: 5,
    colorFlag: "green",
    alarms: 0,
    data: { t1: 22, t2: 48, t3: 49 },
    lat: 23.071,
    lng: 72.58,
    address: "Science City Road, Ahmedabad, Gujarat",
    assignedUser: { name: "Priya Mehta" },
    isOnline: true,
    area: "Science City",
  },
  {
    id: "dev-3",
    name: "Refrigerator t34",
    brandName: "Godrej",
    serialNumber: "dev-690347",
    company: "Godrej",
    status: "inactive",
    model: "T34",
    macAddress: "00:1A:2B:3C:4D:60",
    industry: "Consumer Electronics",
    category: "Appliances",
    cluster: "North",
    group: "Home",
    lastDataTimestamp: "2025-07-27T10:47:00Z",
    users: 6,
    colorFlag: "yellow",
    alarms: 3,
    data: { t1: 28, t2: 60, t3: 55 },
    lat: 22.999,
    lng: 72.58,
    address: "Maninagar, Ahmedabad, Gujarat",
    assignedUser: { name: "Priya Mehta" },
    isOnline: false,
    area: "Maninagar",
  },
  {
    id: "dev-4",
    name: "Refrigerator t34",
    brandName: "Godrej",
    serialNumber: "dev-690348",
    company: "Godrej",
    status: "active",
    model: "T34",
    macAddress: "00:1A:2B:3C:4D:61",
    industry: "Consumer Electronics",
    category: "Appliances",
    cluster: "North",
    group: "Home",
    lastDataTimestamp: "2025-07-27T10:48:00Z",
    users: 4,
    colorFlag: "green",
    alarms: 0,
    data: { t1: 23, t2: 52, t3: 51 },
    lat: 23.09,
    lng: 72.51,
    address: "Gandhinagar Highway, Ahmedabad, Gujarat",
    assignedUser: { name: "Priya Mehta" },
    isOnline: true,
    area: "Gandhinagar Highway",
  },
];

function loadGoogleMapsScript(onLoaded: () => void) {
  if (typeof window === "undefined") return;

  if (window.google && window.google.maps) {
    onLoaded();
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-role="google-maps-api"]',
  );
  if (existing) {
    existing.addEventListener("load", onLoaded, { once: true });
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey ?? ""}`;
  script.async = true;
  script.defer = true;
  script.dataset.role = "google-maps-api";
  script.addEventListener("load", onLoaded, { once: true });
  document.head.appendChild(script);
}

export default function DashboardMapPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  const locationOptions = useMemo(() => {
    const unique = Array.from(new Set(DUMMY_DEVICES.map((d) => d.area)));
    return unique;
  }, []);

  const devices = useMemo(() => {
    return DUMMY_DEVICES.filter((d) => {
      const matchesLocation =
        locationFilter === "all" || d.area === locationFilter;
      const s = search.trim().toLowerCase();
      if (!s) return matchesLocation;
      const inText =
        d.name.toLowerCase().includes(s) ||
        (d.brandName?.toLowerCase().includes(s) ?? false) ||
        (d.address?.toLowerCase().includes(s) ?? false);
      return matchesLocation && inText;
    });
  }, [search, locationFilter]);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!mapRef.current || !window.google?.maps) return;

      const center = { lat: 23.0225, lng: 72.5714 }; // Ahmedabad

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 11,
        disableDefaultUI: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      const infoWindow = new window.google.maps.InfoWindow();
      let closeTimeout: number | null = null;

      DUMMY_DEVICES.forEach((device) => {
        const marker = new window.google.maps.Marker({
          position: { lat: device.lat, lng: device.lng },
          map,
          title: device.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: (device.alarms ?? 0) > 0 ? "#ef4444" : "#22c55e",
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });

        // Always-visible small label near marker with device name
        function NameLabel(this: any, options: any) {
          this.position = options.position;
          this.map = options.map;
          this.text = options.text;
          this.div = null;
          // @ts-ignore
          this.setMap(options.map);
        }
        // @ts-ignore
        NameLabel.prototype = new window.google.maps.OverlayView();
        // @ts-ignore
        NameLabel.prototype.onAdd = function () {
          const div = document.createElement("div");
          div.style.position = "absolute";
          div.style.transform = "translate(-50%, 4px)";
          div.style.whiteSpace = "nowrap";
          div.style.padding = "2px 6px";
          div.style.borderRadius = "999px";
          div.style.background = "rgba(15,23,42,0.92)";
          div.style.color = "#e5e7eb";
          div.style.fontSize = "10px";
          div.style.lineHeight = "16px";
          div.style.fontWeight = "500";
          div.style.boxShadow = "0 4px 12px rgba(15,23,42,0.5)";
          div.style.pointerEvents = "none";
          const label =
            device.name.length > 14
              ? `${device.name.slice(0, 12)}…`
              : device.name;
          div.textContent = label;
          this.div = div;
          const panes = this.getPanes();
          panes?.overlayImage.appendChild(div);
        };
        // @ts-ignore
        NameLabel.prototype.draw = function () {
          if (!this.div) return;
          const pos = this.getProjection().fromLatLngToDivPixel(
            new window.google.maps.LatLng(this.position),
          );
          if (pos) {
            this.div.style.left = `${pos.x}px`;
            this.div.style.top = `${pos.y}px`;
          }
        };
        // @ts-ignore
        NameLabel.prototype.onRemove = function () {
          if (this.div) {
            this.div.parentNode?.removeChild(this.div);
            this.div = null;
          }
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const nameLabel = new (NameLabel as any)({
          position: { lat: device.lat, lng: device.lng },
          map,
          text: device.name,
        });

        const content = `
          <div style="
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            box-shadow: 0 15px 40px rgba(15,23,42,0.28);
            border-radius: 12px;
            padding: 14px 16px 12px;
            background: #ffffff;
            min-width: 260px;
          ">
            <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
              <div style="width:42px;height:42px;border-radius:10px;overflow:hidden;background:#f97316;display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:700;font-size:11px;">${device.name
                  .slice(0, 2)
                  .toUpperCase()}</span>
              </div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;color:#0f172a;">${
                  device.name
                }</div>
                <div style="font-size:11px;color:#64748b;">${
                  device.brandName || "Sensor"
                }</div>
              </div>
            </div>

            <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">
              <div><span style="color:#9ca3af;">Company :</span> ${
                device.brandName ?? "Unknown"
              }</div>
              <div><span style="color:#9ca3af;">Owner :</span> ${
                device.assignedUser?.name ?? "Unknown"
              }</div>
              <div><span style="color:#9ca3af;">Alarm :</span> ${
                device.alarms
              }</div>
            </div>

            <div style="display:flex;gap:6px;margin-top:6px;margin-bottom:6px;">
              <div style="flex:1;border-radius:8px;border:1px solid #bfdbfe;background:#eff6ff;padding:4px 6px;font-size:11px;display:flex;justify-content:space-between;">
                <span>T1</span><span>${device.data?.t1 ?? 0}°C</span>
              </div>
              <div style="flex:1;border-radius:8px;border:1px solid #fed7aa;background:#fff7ed;padding:4px 6px;font-size:11px;display:flex;justify-content:space-between;">
                <span>T2</span><span>${device.data?.t2 ?? 0}</span>
              </div>
              <div style="flex:1;border-radius:8px;border:1px solid #bbf7d0;background:#ecfdf3;padding:4px 6px;font-size:11px;display:flex;justify-content:space-between;">
                <span>T3</span><span>${device.data?.t3 ?? 0}</span>
              </div>
            </div>

            <div style="font-size:10px;color:#9ca3af;margin-top:4px;">
              ${device.address ?? ""}
            </div>
          </div>
        `;

        marker.addListener("mouseover", () => {
          if (closeTimeout) {
            window.clearTimeout(closeTimeout);
            closeTimeout = null;
          }
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
          closeTimeout = window.setTimeout(() => {
            infoWindow.close();
          }, 250);
        });
      });
    });
  }, []);

  return (
    <div className="flex bg-white rounded-md shadow-sm border border-neutral-200 h-full overflow-hidden">
      <div ref={mapRef} className="flex-1 h-full min-h-[420px]" />

      <div className="w-[320px] border-l border-neutral-200 bg-neutral-50/60 flex flex-col">
        <div className="px-4 py-3 border-b border-neutral-200 space-y-2">
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              Map View
            </div>
            <div className="text-[11px] text-neutral-500">
              Ahmedabad – dummy devices preview
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              placeholder="Search by name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 h-8 rounded-md border border-neutral-300 bg-white px-2 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="flex-1 h-8 rounded-md border border-neutral-300 bg-white px-2 text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              <option value="all">All locations</option>
              {locationOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {devices.map((device) => (
            <button
              key={device.id}
              type="button"
              className="w-full text-left px-3 py-3 flex items-start gap-3 hover:bg-white/80 border-b border-neutral-200/70"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-semibold">
                  {device.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white bg-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <div className="text-sm font-semibold text-neutral-900 truncate">
                      {device.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate">
                      {device.brandName} • {device.serialNumber}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-neutral-700">
                    {device.alarms}
                  </div>
                </div>
                <div className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {(device as any).address}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
