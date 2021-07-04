let userLoggedIn = false;
let currentUserLoggedIn;
let contactsOnWebsite;
let tempContact;

if (userLoggedIn === false) {
    document.getElementById('mainScreenID').classList.add("hidden");
    document.getElementById('add_ID').classList.add("hidden");
    document.getElementById('update_delete_ID').classList.add("hidden");
    document.getElementById('logoutDivID').classList.add("hidden");
}

class User {
    constructor(username, password, isAdmin, contactsList) {
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
        this.contactsList = contactsList;
    }
}

class Contact {
    constructor(preName, surName, address, plz, city, state, country, isPrivate, owner) {
        this.preName = preName;
        this.surName = surName;
        this.address = address;
        this.plz = plz;
        this.city = city;
        this.state = state;
        this.country = country;
        this.isPrivate = isPrivate;
        this.owner = owner;
    }
}

let normalo = new User("normalo", "normaloPW", false, []);
let admin = new User("admina", "adminaPW", true, []);

let hardCodedContactNormaloOne = new Contact("John", "Smith", "Fehlerstraße 19", 12345, "Berlin", "Berlin", "Deutschland", true,
    "self");

let hardCodedContactNormaloTwo = new Contact("Jane", "Smith", "Genslerstraße 84", 123479, "Berlin", "Berlin", "Deutschland", false,
    "self");

let hardCodedContactAdminaOne = new Contact("Patrick", "Propst", "Leopoldstraße 54", 12345, "Berlin", "Berlin", "Deutschland", true,
    "self");

let hardCodedContactAdminaTwo = new Contact("Tom", "Koch", "Brandenburgische Straße 29", 123479, "Berlin", "Berlin", "Deutschland", false,
    "self");

normalo.contactsList.push(hardCodedContactNormaloOne);
normalo.contactsList.push(hardCodedContactNormaloTwo);

addContactToMap(hardCodedContactNormaloOne.address);
addContactToMap(hardCodedContactNormaloTwo.address);

admin.contactsList.push(hardCodedContactAdminaOne);
admin.contactsList.push(hardCodedContactAdminaTwo);

addContactToMap(hardCodedContactAdminaOne.address);
addContactToMap(hardCodedContactAdminaTwo.address);


addUserToStorage(hardCodedContactNormaloOne, hardCodedContactNormaloOne.preName + "" +  hardCodedContactNormaloOne.surName);
addUserToStorage(hardCodedContactNormaloTwo, hardCodedContactNormaloTwo.preName + "" +  hardCodedContactNormaloTwo.surName);
addUserToStorage(hardCodedContactAdminaOne, hardCodedContactAdminaOne.preName + "" +  hardCodedContactAdminaOne.surName);
addUserToStorage(hardCodedContactAdminaTwo, hardCodedContactAdminaTwo.preName + "" +  hardCodedContactAdminaTwo.surName);


contactsOnWebsite = normalo.contactsList.concat(admin.contactsList);

addUserToStorage(normalo, "normaloFile");
addUserToStorage(admin, "adminaFile");


function addUserToStorage(user, storageFileName) {
    let myJSON = JSON.stringify(user);
    localStorage.setItem(storageFileName, myJSON);
}

let loginButton = document.getElementById("bntLogin");
loginButton.addEventListener("click", loginButtonClicked);

function loginButtonClicked() {
    let inputUserName = document.getElementById("uname").value;
    let inputPassword = document.getElementById("psw").value;

    for (let i = 0; i < localStorage.length; i++) {
        let currentItem = JSON.parse(localStorage.getItem(localStorage.key(i)));

        if (currentItem.username === inputUserName && currentItem.password === inputPassword) {
            document.getElementById("mainScreenID").classList.remove("hidden");
            document.getElementById("logoutDivID").classList.remove("hidden");
            document.getElementById("loginScreenID").classList.add("hidden");

            currentUserLoggedIn = currentItem;

            document.getElementById("uname").value = "";
            document.getElementById("psw").value = "";

            alert("Welcome back " + inputUserName + "!");
            userLoggedIn = true;
            if (currentUserLoggedIn.isAdmin) {
                toggleAdminaFromSelected(document.getElementById("add_owner"), false);
                toggleAdminaFromSelected(document.getElementById("delete_owner"), false);
            } else {
                toggleAdminaFromSelected(document.getElementById("add_owner"), true);
                toggleAdminaFromSelected(document.getElementById("delete_owner"), true);
            }
            break;
        }
    }
    listOwnContacts();

    if (!userLoggedIn) {
        alert("Wrong Combination of Username and Password!");
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

let btn_addNew = document.getElementById("btn_addNewID");
btn_addNew.addEventListener("click", addNewButtonClicked);

function addNewButtonClicked() {
    document.getElementById("mainScreenID").classList.add("hidden");
    document.getElementById("add_ID").classList.remove("hidden");
}

let addButton = document.getElementById("btn_add");
addButton.addEventListener("click", addButtonClicked);

function addButtonClicked() {
    let contactPrename = document.getElementById("add_vorname").value;
    let contactSurname = document.getElementById("add_name").value;
    let contactAddress = document.getElementById("add_strasse").value;
    let contactPLZ = document.getElementById("add_plz").value;
    let contactCity = document.getElementById("add_stadt").value;
    let contactState = document.getElementById("add_bundesland").value;
    let contactCountry = document.getElementById("add_land").value;
    let contactPrivate = document.getElementById("add_privat").checked;
    let contactOwner = document.getElementById("add_owner")[document.getElementById("add_owner").selectedIndex];

    let contact = new Contact(contactPrename, contactSurname, contactAddress, contactPLZ, contactCity, contactState, contactCountry, contactPrivate, contactOwner.value);
    let currentUserContactsLength;
    if (contactOwner.value.toLowerCase() === "self") {
        currentUserContactsLength = admin.contactsList.length;
        admin.contactsList.push(contact);
        if (currentUserContactsLength < admin.contactsList.length) {
            alert("Contact " + contactPrename + " " + contactSurname + " successfully added.");
        } else {
            alert("Something went wrong trying to add your contact.");
        }
    } else {
        currentUserContactsLength = normalo.contactsList.length;
       normalo.contactsList.push(contact);
        if (currentUserContactsLength < normalo.contactsList.length) {
            alert("Contact " + contactPrename + " " + contactSurname + " successfully added.");
        } else {
            alert("Something went wrong trying to add your contact.");
        }
    }

    if (currentUserLoggedIn.isAdmin) {
        currentUserLoggedIn = admin;
    } else {
        currentUserLoggedIn = normalo;
    }

    addUserToStorage(contact, contactPrename + "" + contactSurname);
    listOwnContacts();
    addContactToMap(contactAddress);
    contactsOnWebsite.push(contact);

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

function createButton(contact) {
    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = contact.preName + " " + contact.surName;                   // Insert text
    document.getElementById("contactsID").append(btn);
    btn.addEventListener("click", function () {
        contactButtonClicked(contact);
    });
}

function contactButtonClicked(contact) {
    if (currentUserLoggedIn === normalo && contact.owner.toLowerCase() === "self") {
        updateButton.disabled = true;
        deleteButton.disabled = true;
    } else {
        updateButton.disabled = false;
        deleteButton.disabled = false;
    }

    // console.log("Button of: " + contact.preName + " " + contact.surName);
    // console.log(contact);
    document.getElementById("delete_vorname").value = contact.preName;
    document.getElementById("delete_name").value = contact.surName;
    document.getElementById("delete_strasse").value = contact.address;
    document.getElementById("delete_plz").value = contact.plz;
    document.getElementById("delete_stadt").value = contact.city;
    document.getElementById("delete_bundesland").value = contact.state;
    document.getElementById("delete_land").value = contact.country;
    document.getElementById("delete_privat").checked = contact.isPrivate;
    document.getElementById("delete_owner").value = contact.owner;

    tempContact = contact;

    document.getElementById("mainScreenID").classList.add("hidden");
    document.getElementById("update_delete_ID").classList.remove("hidden");
}

let updateButton = document.getElementById("btn_update");
updateButton.addEventListener("click", updateButtonClicked);

function updateButtonClicked() {
    for (let i = 0; i < contactsOnWebsite.length; i++){
        let currentContactFromUser = contactsOnWebsite[i];

        for (let j = 0; j < localStorage.length; j++){
            let currentItem = JSON.parse(localStorage.getItem(localStorage.key(j)));

            if (currentContactFromUser === tempContact) {

                if (currentContactFromUser.preName === currentItem.preName && currentContactFromUser.surName === currentItem.surName){

                    currentContactFromUser.preName = document.getElementById("delete_vorname").value;
                    currentContactFromUser.surName = document.getElementById("delete_name").value;
                    currentContactFromUser.address = document.getElementById("delete_strasse").value;
                    currentContactFromUser.plz = document.getElementById("delete_plz").value;
                    currentContactFromUser.city = document.getElementById("delete_stadt").value;
                    currentContactFromUser.state = document.getElementById("delete_bundesland").value;
                    currentContactFromUser.country = document.getElementById("delete_land").value;
                    currentContactFromUser.isPrivate = document.getElementById("delete_privat").checked;
                    currentContactFromUser.owner = document.getElementById("delete_owner").value;
                    if (currentItem.owner === "self"){
                        for(let k = 0; k < admin.contactsList.length; k++){
                            if(currentItem.preName === admin.contactsList[k].preName && currentItem.surName === admin.contactsList[k].surName){
                                admin.contactsList.splice(k, 1);
                                admin.contactsList.push(currentContactFromUser);
                            }
                        }
                    } else {
                        for(let k = 0; k < normalo.contactsList.length; k++){
                            if(currentItem.preName === normalo.contactsList[k].preName && currentItem.surName === normalo.contactsList[k].surName){
                                normalo.contactsList.splice(k, 1);
                                normalo.contactsList.push(currentContactFromUser);
                            }
                        }
                    }

                    localStorage.removeItem(j);
                    addUserToStorage(currentContactFromUser);
                }
            }
        }

        document.getElementById("mainScreenID").classList.remove("hidden");
        document.getElementById("update_delete_ID").classList.add("hidden");
    }
    listOwnContacts();
}

let deleteButton = document.getElementById("btn_delete");
deleteButton.addEventListener("click", deleteButtonClicked);

function deleteButtonClicked() {
    for (let i = 0; i < contactsOnWebsite.length; i++){
        let currentContactFromUser = contactsOnWebsite[i];

        if (currentContactFromUser === tempContact) {
            for (let j = 0; j < localStorage.length; j++) {
                let currentItem = JSON.parse(localStorage.getItem(localStorage.key(j)));
                if (currentContactFromUser.preName === currentItem.preName && currentContactFromUser.surName === currentItem.surName) {
                    if (currentItem.owner === "self"){
                        for (let k = 0; k < admin.contactsList.length; k++){
                            if (currentItem.preName === admin.contactsList[k].preName && currentItem.surName === admin.contactsList[k].surName){
                                admin.contactsList.splice(k, 1);
                                break;
                            }
                        }
                    } else {
                        for (let k = 0; k < normalo.contactsList.length; k++){
                            if (currentItem.preName === normalo.contactsList[k].preName && currentItem.surName === normalo.contactsList[k].surName){
                                normalo.contactsList.splice(k, 1);
                                break;
                            }
                        }
                    }
                    contactsOnWebsite.splice(i, 1);
                    localStorage.removeItem(j);
                }
            }
        }

        document.getElementById("mainScreenID").classList.remove("hidden");
        document.getElementById("update_delete_ID").classList.add("hidden");
    }
    listOwnContacts();
}

let cancelButton = document.getElementById("btn_cancel");
cancelButton.addEventListener("click", cancelButtonClicked);

function cancelButtonClicked() {
    document.getElementById("mainScreenID").classList.remove("hidden");
    document.getElementById("update_delete_ID").classList.add("hidden");
}

function addContactToMap (contactAddress) {
    let request = new XMLHttpRequest();
    let url = "https://nominatim.openstreetmap.org/search?q=" + contactAddress + "&format=json&polygon=1&addressdetails=1";
    request.open("GET", url, true);

    request.onload = function (e) {
        let responseJSON = JSON.parse(this.response);
        if (responseJSON[0] !== undefined) {
            let lattitude = responseJSON[0].lat;
            let longitude = responseJSON[0].lon;

            console.log("Lat: " + responseJSON[0].lat + "Long: " + responseJSON[0].lon);
            createNewMarker(longitude, lattitude);
        } else {
            alert("Address doesn't exist!")
        }
    }
    request.send();
}

let listOwnContactsBtn = document.getElementById("btn_showMineID");
listOwnContactsBtn.addEventListener("click", listOwnContacts);

//TODO testen idk bin zu müde
function listOwnContacts() {
    if (currentUserLoggedIn.isAdmin) {
        currentUserLoggedIn = admin;
    } else {
        currentUserLoggedIn = normalo;
    }
    clearMarkers();
    clearButtons();
    console.log(currentUserLoggedIn);
    for (let i = 0; i < currentUserLoggedIn.contactsList.length; i++){
        let currentContactFromUser = currentUserLoggedIn.contactsList[i];
        for (let j = 0; j < localStorage.length; j++){
            let currentItem = JSON.parse(localStorage.getItem(localStorage.key(j)));
            if (currentContactFromUser.preName === currentItem.preName && currentContactFromUser.surName === currentItem.surName){
                createButton(currentContactFromUser);
                addContactToMap(currentContactFromUser.address);
            }
        }
    }
}

let listAllContactsBtn = document.getElementById("btn_showAllID");
listAllContactsBtn.addEventListener("click", listAllContacts);

function listAllContacts(){
    clearMarkers();
    clearButtons();
    console.log(contactsOnWebsite);
    console.log(contactsOnWebsite.length);
    for (let i = 0; i < contactsOnWebsite.length; i++){
        if (currentUserLoggedIn.isAdmin && contactsOnWebsite[i].isPrivate){
            createButton(contactsOnWebsite[i]);
            addContactToMap(contactsOnWebsite[i].address);
        } else if(!currentUserLoggedIn.isAdmin){
            for(let j = 0; j < currentUserLoggedIn.contactsList.length; j++){
                if (currentUserLoggedIn.contactsList[j].preName === contactsOnWebsite[i].preName
                    && currentUserLoggedIn.contactsList[j].surName === contactsOnWebsite[i].surName
                    && currentUserLoggedIn.contactsList[j].isPrivate){
                    createButton(contactsOnWebsite[i]);
                    addContactToMap(contactsOnWebsite[i].address);
                }
            }
        } if (!contactsOnWebsite[i].isPrivate){
            createButton(contactsOnWebsite[i]);
            addContactToMap(contactsOnWebsite[i].address);
        }
    }
}

function clearButtons(){
    let contactListWebsite = document.getElementById("contactsID");
    contactListWebsite.innerHTML = "";
}

//createButton("TestButton");
//createButton("TestButton2")



