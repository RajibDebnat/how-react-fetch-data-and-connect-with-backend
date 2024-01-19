export default async function fetchDataPlaces (){
    const response = await fetch("http://localhost:3000/places");
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch data ");
        }
        return responseData.places;
}
export  async function fetchUserPlaces (){
    const response = await fetch("http://localhost:3000/user-places");
        const responseData = await response.json();
        console.log(responseData.places)
        if (!response.ok) {
          throw new Error("Failed to fetch  user places ");
        }
        return responseData.places;
}

export  async function sendDataPlaces(places){

const response = await fetch('http://localhost:3000/user-places',{
    method:"PUT",
    body: JSON.stringify({places}) ,
    headers:{
        "Content-Type": "application/json",

    }
})

const responseData = await response.json();
console.log(responseData)
 if(!response.ok){
    throw new Error ('Failed to Update new Data..... ');
 }
 return responseData.message 
}

// export async function receiveData(){
//     try{

//         const response = await fetch('http://http://localhost:3000/user-places');
//         const responseData = await response.json();
//         console.log(responseData)
//         return responseData;
//     }
//     catch(err){
//         console.log(er.messager)
//     }
// }
// receiveData();