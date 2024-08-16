"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const CENTER_LAT = 37.5358994;
const CENTER_LNG = 126.8969627;

const Home = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "CAFE",
    "FOOD",
    "MART",
    "PHARMACY",
  ]);

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
          zoom: 15,
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
    }
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API}`);
        const data = response.data;

        if (map && data.length > 0) {
          const newMarkers = data.map((item: any) => {
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
      marker.setVisible(selectedTypes.includes(marker.getTitle()!));
    });
  }, [selectedTypes, markers]);

  const toggleType = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  return (
    <div className="w-full px-4">
      <h1 className="text-xl font-bold text-center my-5">YOURPICK MAP</h1>
      <div id="map" className="w-full h-[500px] rounded-lg" />
      <div className="flex justify-center space-x-4 p-4 mt-4">
        <button
          className={`flex flex-col items-center ${
            selectedTypes.includes("CAFE") ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => toggleType("CAFE")}
        >
          <img src="/pin-cafe.svg" width={50} height={50} alt="카페" />
          <span>카페</span>
        </button>
        <button
          className={`flex flex-col items-center ${
            selectedTypes.includes("FOOD") ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => toggleType("FOOD")}
        >
          <img src="/pin-food.svg" width={50} height={50} alt="음식점" />
          <span>음식점</span>
        </button>
        <button
          className={`flex flex-col items-center ${
            selectedTypes.includes("MART") ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => toggleType("MART")}
        >
          <img src="/pin-mart.svg" width={50} height={50} alt="편의점" />
          <span>편의점</span>
        </button>
        <button
          className={`flex flex-col items-center ${
            selectedTypes.includes("PHARMACY") ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => toggleType("PHARMACY")}
        >
          <img src="/pin-pharmacy.svg" width={50} height={50} alt="약국" />
          <span>약국</span>
        </button>
      </div>
      <footer className="text-center text-sm text-gray-400 mt-6">
        <a target="_blank" href="https://github.com/hi-rachel/map-challenge">
          @hi-rachel
        </a>
      </footer>
    </div>
  );
};

export default Home;
