"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Map from "./Map";
import { Marker } from "../types/mapMarker";

const CENTER_LAT = 37.5358994;
const CENTER_LNG = 126.8969627;

const MapContainer = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(["CAFE", "FOOD", "MART", "PHARMACY"])
  );

  const icons = {
    CAFE: "/pin-cafe.svg",
    FOOD: "/pin-food.svg",
    MART: "/pin-mart.svg",
    PHARMACY: "/pin-pharmacy.svg",
    MAIN: "/pin-main.svg",
  };

  useEffect(() => {
    const initMap = () => {
      if (window.naver && window.naver.maps) {
        const mapOptions = {
          center: new naver.maps.LatLng(CENTER_LAT, CENTER_LNG),
          zoom: 17,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
          },
        };
        const mapInstance = new naver.maps.Map("map", mapOptions);
        setMap(mapInstance);

        new naver.maps.Circle({
          map: mapInstance,
          center: new naver.maps.LatLng(CENTER_LAT, CENTER_LNG),
          radius: 300,
          fillColor: "#000000",
          fillOpacity: 0.2,
          strokeWeight: 0,
        });

        new naver.maps.Marker({
          position: new naver.maps.LatLng(CENTER_LAT, CENTER_LNG),
          map: mapInstance,
          icon: {
            url: icons.MAIN,
            size: new naver.maps.Size(50, 50),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(20, 40),
          },
        });
      }
    };

    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const intervalId = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(intervalId);
          initMap();
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get<Marker[]>(
          `${process.env.NEXT_PUBLIC_API}`
        );
        const data = response.data;

        if (map && data.length > 0) {
          const newMarkers = data.map((item: Marker) => {
            const marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(
                parseFloat(item.lat),
                parseFloat(item.lng)
              ),
              map: map,
              title: item.type,
              icon: {
                url: icons[item.type as keyof typeof icons],
                size: new naver.maps.Size(32, 32),
                origin: new naver.maps.Point(0, 0),
              },
            });

            return marker;
          });

          setMarkers(newMarkers);
        }
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };

    if (map) {
      fetchMarkers();
    }
  }, [map]);

  useEffect(() => {
    markers.forEach((marker) => {
      marker.setVisible(selectedTypes.has(marker.getTitle()));
    });
  }, [selectedTypes, markers]);

  const toggleType = (type: string) => {
    setSelectedTypes((prevTypes) => {
      const newTypes = new Set(prevTypes);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return newTypes;
    });
  };

  return (
    <Map selectedTypes={selectedTypes} toggleType={toggleType} icons={icons} />
  );
};

export default MapContainer;
