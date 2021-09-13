let urlContacts = "http://localhost:3000/contacts";
let urlUsers = "http://localhost:3000/users";

export async function postContact(contact){
    try {
        let response = await fetch(urlContacts, {method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(contact)});

        let responseJSON = await response.json();
        alert("Successfully posted Contact!");
        return responseJSON;
    } catch (err){
        alert("Something went wrong posting your contact");
        console.log(err)
        return null;
    }
}

export async function deleteContact(id){
    let response = await fetch(urlContacts+ "/" + id, {
        method: "DELETE"
    });

    console.log(await response.text())
    if (response.status === 204){
        alert("Successfully deleted Contact!");
    } else {
        alert("Something went wrong deleting your contact")
    }
}

export async function updateContact(contact) {
    let response = await fetch(urlContacts + "/" + contact._id, {method: "PUT",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(contact)});
    console.log(response.status)
    if (response.status === 204){
        alert("Successfully updated your contact!");
    } else {
        alert("Something went wrong updating your Contact")
    }
}

export async function getContact(id) {
    try {
        let response = await fetch(urlContacts + "/" + id, {method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }});
        let responseJSON = await response.json();
        console.log(responseJSON);
        return responseJSON;
    } catch (err){
        console.log(err);
        return null;
    }
}

export async function getAllContacts(){
    try {
        let response = await fetch(urlContacts, {method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }});
        return await response.json();
    } catch (err){
        return null;
    }
}

export async function getContactsOfUser(userID){
    try {
        let response = await fetch(urlContacts + "?userID=" + userID, {method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }});
        return await response.json();
    } catch (err) {
        return null;
    }
}

export async function logInUser(username, password){
    try {
        let response = await fetch(urlUsers + "?username=" + username + "&password=" + password, {method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }});
        return await response.json();
    } catch (err){
        return null;
    }

}