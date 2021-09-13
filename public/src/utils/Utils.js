import {getContactsOfUser} from "../crudManager";

export async function showOwnContacts([context, setContext]) {
    let userLoggedIn = context.userLoggedIn;
    let userContactList;

    if (userLoggedIn.isAdmin) {
        userContactList = await getContactsOfUser("self");
    } else {
        userContactList = await getContactsOfUser("normalo");
    }
    setContext({...context, contactList: userContactList});
}

export async function getCoords(contactAddress){
    let url = "https://nominatim.openstreetmap.org/search?q=" + contactAddress + "&format=json&polygon=1&addressdetails=1";
    try {
        let response = await fetch(url, {
            method: "GET", headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        });
        let responseJSON = await response.json();
        console.log("Reponse JSON", responseJSON);
        console.log("Contact Address: ", contactAddress);
        if (responseJSON !== undefined) {
            let latitude = responseJSON[0].lat;
            let longitude = responseJSON[0].lon;

            return {lon: longitude, lat: latitude};
        } else {
            alert("Address doesn't exist!");
            return null;
        }
    } catch (err) {
        console.log(err)
    }
}