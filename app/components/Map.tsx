const Map = ({
  selectedTypes,
  toggleType,
  icons,
}: {
  selectedTypes: string[];
  toggleType: (type: string) => void;
  icons: { [key: string]: string };
}) => {
  const typeToKorean: { [key: string]: string } = {
    CAFE: "카페",
    FOOD: "음식점",
    MART: "편의점",
    PHARMACY: "약국",
  };

  return (
    <div className="w-full px-4 min-w-96">
      <h1 className="text-xl font-bold text-center my-5">YOURPICK MAP</h1>
      <div id="map" className="w-full h-[500px] rounded-lg" />
      <div className="flex justify-center space-x-4 p-4 mt-4">
        {Object.keys(icons).map(
          (type) =>
            type !== "MAIN" && (
              <button
                key={type}
                className={`flex flex-col items-center ${
                  selectedTypes.includes(type) ? "opacity-100" : "opacity-50"
                }`}
                onClick={() => toggleType(type)}
              >
                <img src={icons[type]} width={50} height={50} alt={type} />
                <span className="break-keep">{typeToKorean[type]}</span>
              </button>
            )
        )}
      </div>
      <footer className="text-center text-sm text-gray-400 mt-6">
        @hi-rachel
      </footer>
    </div>
  );
};

export default Map;
