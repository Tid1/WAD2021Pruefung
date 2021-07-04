let userCurrentlyLoggedIn = null;
let userLoggedIn = false;

if (userLoggedIn === false) {
    document.getElementById('mainScreenID').classList.add("hidden");
    document.getElementById('add_ID').classList.add("hidden");
    document.getElementById('update_delete_ID').classList.add("hidden");
    document.getElementById('logoutDivID').classList.add("hidden");
}

let loginButton = document.getElementById("bntLogin");
loginButton.addEventListener("click", loginButtonClicked);

async function loginButtonClicked(){
    let inputUserName = document.getElementById("uname").value;
    let inputPassword = document.getElementById("psw").value;

    userCurrentlyLoggedIn = await logInUser(inputUserName, inputPassword);
    console.log(userCurrentlyLoggedIn)

    if(userCurrentlyLoggedIn != null){
        document.getElementById("mainScreenID").classList.remove("hidden");
        document.getElementById("logoutDivID").classList.remove("hidden");
        document.getElementById("loginScreenID").classList.add("hidden");

        document.getElementById("uname").value = "";
        document.getElementById("psw").value = "";

        alert("Welcome back " + inputUserName + "!");
        userLoggedIn = true;

        if(userCurrentlyLoggedIn.isAdmin){
            toggleAdminaFromSelected(document.getElementById("add_owner"), false);
            toggleAdminaFromSelected(document.getElementById("delete_owner"), false);
        } else {
            toggleAdminaFromSelected(document.getElementById("add_owner"), true);
            toggleAdminaFromSelected(document.getElementById("delete_owner"), true);
        }
        listOwnContacts();
    } else {
        alert("Illegal action!");
    }
}

function toggleAdminaFromSelected(list, toggle){
    for (let i=0; i<list.length; i++) {
        if (list[i].value.toLowerCase() === "self") {
            list[i].disabled = toggle;
            if (!toggle) {
                list.selectedIndex = "0";
            }
        }  else if (list[i].value.toLowerCase() === "normalo") {
            if (toggle) {
                list.selectedIndex = "1";
            }
        }
    }
}

let listOwnContactsBtn = document.getElementById("btn_showMineID");
listOwnContactsBtn.addEventListener("click", listOwnContacts)

async function listOwnContacts(){
    clearMarkers();
    clearButtons();
    let userContactList;
    if (userCurrentlyLoggedIn.isAdmin){
        userContactList = await getContactsOfUser("self");
    } else {
        userContactList = await getContactsOfUser("normalo");
    }
    console.log(userContactList);
    userContactList.forEach(function (contact) {
        createButton(contact);
        if (contact.lon != null && contact.lat != null){
            createNewMarker(contact.lon, contact.lat);
        }
    });
}

function clearButtons(){
    let contactListWebsite = document.getElementById("contactsID");
    contactListWebsite.innerHTML = "";
}

function createButton(contact) {
    let btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = contact.firstname + " " + contact.lastname;                   // Insert text
    document.getElementById("contactsID").append(btn);
    btn.addEventListener("click", function () {
        contactButtonClicked(contact);
    });
}

async function contactButtonClicked(contact){
    console.log("ContactID:" + contact._id)
    console.log(contact)
    if (contact != null){
        document.getElementById("delete_vorname").value = contact.firstname;
        document.getElementById("delete_name").value = contact.lastname;
        document.getElementById("delete_strasse").value = contact.street;
        document.getElementById("delete_plz").value = contact.plz;
        document.getElementById("delete_stadt").value = contact.city;
        document.getElementById("delete_bundesland").value = contact.state;
        document.getElementById("delete_land").value = contact.country;
        document.getElementById("delete_privat").checked = contact.isPrivate;
        document.getElementById("delete_owner").value = contact.owner;

        document.getElementById("mainScreenID").classList.add("hidden");
        document.getElementById("update_delete_ID").classList.remove("hidden");
    }

    let updateButton = document.getElementById("btn_update");
    updateButton.onclick = function () {
        updateButtonClicked(contact._id);
    };

    let deleteButton = document.getElementById("btn_delete");
    deleteButton.onclick = function () {
        deleteButtonClicked(contact._id);
    };
}

async function updateButtonClicked(contactID){
    let contactToUpdate = {_id: contactID, firstname: document.getElementById("delete_vorname").value, lastname: document.getElementById("delete_name").value,
                            street: document.getElementById("delete_strasse").value, plz: document.getElementById("delete_plz").value,
                            city: document.getElementById("delete_stadt").value, state: document.getElementById("delete_bundesland").value,
                            country: document.getElementById("delete_land").value, isPrivate: document.getElementById("delete_privat").checked,
                            owner: document.getElementById("delete_owner").value};

    if (userCurrentlyLoggedIn.isAdmin || !userCurrentlyLoggedIn.isAdmin && contactToUpdate.owner.toLowerCase() === "normalo") {
        let coords = await getCoords(contactToUpdate.street);
        if (coords != null) {
            contactToUpdate.lon = coords.lon;
            contactToUpdate.lat = coords.lat;
        }
        await updateContact(contactToUpdate)
    } else {
        alert("Insufficient Permission");
    }
    document.getElementById("mainScreenID").classList.remove("hidden");
    document.getElementById("update_delete_ID").classList.add("hidden");
    listOwnContacts();
}

async function deleteButtonClicked(contactID){
    if (userCurrentlyLoggedIn.isAdmin || !userCurrentlyLoggedIn.isAdmin && contactToUpdate.owner.toLowerCase() === "normalo"){
        await deleteContact(contactID);
    } else {
        alert("Insufficient Permission")
    }
    document.getElementById("mainScreenID").classList.remove("hidden");
    document.getElementById("update_delete_ID").classList.add("hidden");
    listOwnContacts();
}

let addButton = document.getElementById("btn_add");
addButton.addEventListener("click", addButtonClicked);

async function addButtonClicked(){
    let contactFirstName= document.getElementById("add_vorname").value;
    let contactLastName = document.getElementById("add_name").value;
    let contactAddress = document.getElementById("add_strasse").value;
    let contactPLZ = document.getElementById("add_plz").value;
    let contactCity = document.getElementById("add_stadt").value;
    let contactState = document.getElementById("add_bundesland").value;
    let contactCountry = document.getElementById("add_land").value;
    let contactPrivate = document.getElementById("add_privat").checked;
    let contactOwner = document.getElementById("add_owner")[document.getElementById("add_owner").selectedIndex];

    let contact = {firstname: contactFirstName, lastname: contactLastName, street: contactAddress, plz: contactPLZ,
                    city: contactCity, state: contactState, country: contactCountry, isPrivate: contactPrivate, owner: contactOwner.value}

    let coords = await getCoords(contactAddress);
    console.log(coords)

    if (coords != null){
        contact.lon = coords.lon;
        contact.lat = coords.lat;
    } else {
        contact.lon = null;
        contact.lat = null;
    }

    console.log(contact);
    contact._id = await postContact(contact);

    if (contact._id != null){
        await listOwnContacts();
        if (contact.lon != null && contact.lat != null){
            createNewMarker(contact.lon, contact.lat);
        }
        alert("Successfully added Contact " + contactFirstName + " " + contactLastName + "!")
    } else {
        alert("Something went wrong adding your contact");
    }

    document.getElementById("add_vorname").value = "";
    document.getElementById("add_name").value = "";
    document.getElementById("add_strasse").value = "";
    document.getElementById("add_plz").value = "";
    document.getElementById("add_stadt").value = "";
    document.getElementById("add_bundesland").value = "";
    document.getElementById("add_land").value = "";
    document.getElementById("add_privat").checked = true;

    document.getElementById("mainScreenID").classList.remove("hidden");
    document.getElementById("add_ID").classList.add("hidden");
}

 /*function addContactToMap (contactAddress) {
    let request = new XMLHttpRequest();
    let url = "https://nominatim.openstreetmap.org/search?q=" + contactAddress + "&format=json&polygon=1&addressdetails=1";
    let coords = null;
    request.open("GET", url, true);

    request.onload = function (e) {
        let responseJSON = JSON.parse(this.response);
        if (responseJSON[0] !== undefined) {
            let lattitude = responseJSON[0].lat;
            let longitude = responseJSON[0].lon;

            coords = {lon: longitude, lat: lattitude};
            //console.log("Lat: " + responseJSON[0].lat + "Long: " + responseJSON[0].lon);
            //createNewMarker(longitude, lattitude);
        } else {
            alert("Address doesn't exist!")
        }
    }
    request.send();
    return coords;
}*/

async function getCoords(contactAddress){
    let url = "https://nominatim.openstreetmap.org/search?q=" + contactAddress + "&format=json&polygon=1&addressdetails=1";
    try{
        let response = await fetch(url, {method: "GET",  headers: {
                "Content-Type": "application/json; charset=utf-8",
            }});
        let responseJSON = await response.json();
        if (responseJSON !== undefined){
            let latitude = responseJSON[0].lat;
            let longitude = responseJSON[0].lon;

            return {lon: longitude, lat: latitude};
        } else{
            alert("Address doesn't exist!");
            return null;
        }
    } catch (err){
        console.log(err)
    }
}

let logoutButton = document.getElementById("bntLogout");
logoutButton.addEventListener("click", logoutButtonClicked);

function logoutButtonClicked() {
    document.getElementById('mainScreenID').classList.add("hidden");
    document.getElementById('add_ID').classList.add("hidden");
    document.getElementById('update_delete_ID').classList.add("hidden");
    document.getElementById("logoutDivID").classList.add("hidden");
    document.getElementById("loginScreenID").classList.remove("hidden");

    userLoggedIn = false;
}

let addNewButton = document.getElementById("btn_addNewID");
addNewButton.addEventListener("click", addNewButtonClicked);

function addNewButtonClicked() {
    document.getElementById("mainScreenID").classList.add("hidden");
    document.getElementById("add_ID").classList.remove("hidden");
}

let listAllContactsBtn = document.getElementById("btn_showAllID");
listAllContactsBtn.addEventListener("click", listAllContacts);

async function listAllContacts(){
    clearMarkers();
    clearButtons();
    let contactList = await getAllContacts();
    console.log(contactList)
    if (userCurrentlyLoggedIn.isAdmin){
        contactList.forEach(function (contact) {
            createButton(contact);
            if (contact.lon != null && contact.lat != null){
                createNewMarker(contact.lon, contact.lat);
            }
        });
    } else {
        contactList.forEach(function (contact) {
           if (contact.owner.toLowerCase() === "normalo" || !contact.isPrivate){
               createButton(contact);
               if (contact.lon != null && contact.lat != null){
                   createNewMarker(contact.lon, contact.lat);
               }
           }
        });
    }
}

let cancelButton = document.getElementById("btn_cancel");
cancelButton.addEventListener("click", cancelButtonClicked);

function cancelButtonClicked() {
    document.getElementById("mainScreenID").classList.remove("hidden");
    document.getElementById("update_delete_ID").classList.add("hidden");
}


