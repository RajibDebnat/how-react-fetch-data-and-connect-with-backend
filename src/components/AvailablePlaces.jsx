import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import fetchDataPlaces from "./http.js";
export default function AvailablePlaces({ onSelectPlace }) {
  const [AvailablePlaces, setAvailabelPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        // because of every async function return Promise there for to get this data i should use await 
        const places = await fetchDataPlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          // console.log(position.coords.latitude)
          setAvailabelPlaces(sortedPlaces);
          setIsLoading(false);
        });
        //  .then((res) => res.json())
        // if (responseData.places) {
        // }
        //  .then((data) => setAvailabelPlaces(data.places));
      } catch (err) {
        setError({ message: err.message || "Failed to Fetch data" });
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <Error title={"An error occured"} message={error.message} />;
  }
  return (
    <Places
      title="Available Places"
      places={AvailablePlaces}
      isLoading={isLoading}
      isLoadingText={`Data is Fetching....`}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
