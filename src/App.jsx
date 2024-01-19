import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { sendDataPlaces,fetchUserPlaces } from "../src/components/http.js";
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectError, setSelectError] = useState();

  useEffect( ()=>{
    async function fetchPlaces(){
      setIsLoading(true)
      try{

        const places =  await fetchUserPlaces();
        console.log(places)
        setUserPlaces(places)
      } catch(err){
        console.log(err.message)
        setError({message:err.message|| 'Failed  to fatch Data'});
      }
      setIsLoading(false)
    }
    fetchPlaces()
  },[])


  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }

      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await sendDataPlaces([selectedPlace, ...userPlaces]);
    } catch (err) {
      // console.log(err);
      setUserPlaces(userPlaces);
      setSelectError({ messege: err.messege || "Failed to Send Data" });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );
      try {
        await sendDataPlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id)
        );
      } catch (err) {
        setUserPlaces(userPlaces);
        setSelectError({ message: err.message || "Failed to Delete Place" });
        <Error
          title={"An Error Occured"}
          message={"Failed to Delete place..."}
          onConfirm={errorHandler}
        />;
      }

      setModalIsOpen(false);
    },
    [userPlaces]
  );
  function errorHandler() {
    setSelectError(null);
  }

//  const loadData = async function loadData(){
//   try{
//       await receiveData
//   }catch(err){

//   }
//  }



  return (
    <>
      <Modal open={selectError} onClose={errorHandler}>
        <Error
          title={"an error occured!"}
          message={"Failed to send data"}
          onConfirm={errorHandler}
        />
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
      {error && <Error title={'an error occured'}/>}
       {!error &&
       <Places
       title="I'd like to visit ..."
       fallbackText="Select the places you would like to visit below."
       isLoading={isLoading}
       places={userPlaces}
       loadingText={"Failed To fetch user places.....   "}
       onSelectPlace={handleStartRemovePlace}
     />
       } 

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
