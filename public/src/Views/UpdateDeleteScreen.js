import {useContext, useEffect} from "react";
import {MyContext} from "../App";
import {getCoords, showOwnContacts} from "../utils/Utils";
import {deleteContact, updateContact} from "../crudManager";

function UpdateDeleteScreen() {
    let contactStreetName, contactFirstName, contactLastName, contactPLZ, contactCity, contactState, contactCountry,
        contactPrivate, contactOwner;
    let [context, setContext] = useContext(MyContext);
    let options = []

    switch (context.userLoggedIn.username.toLowerCase()){
        case "admina":
            options.push(<option value="self">Self</option>);
            options.push(<option value="normalo">Normalo</option>);
            break;

        case "normalo":
            if(context.currentContact.owner.toLowerCase() === "self"){
                options.push(<option value="self">Self</option>);
            } else {
                options.push(<option value="normalo">Normalo</option>);
            }
            break;
    }

    const postInit = () => {
        console.log("Current Contact: " , context.currentContact)
        let contactToUpdate = context.currentContact;
        if (contactToUpdate != null){
            contactStreetName.value = contactToUpdate.street;
            contactFirstName.value = contactToUpdate.firstname;
            contactLastName.value = contactToUpdate.lastname;
            contactPLZ.value = contactToUpdate.plz;
            contactCity.value = contactToUpdate.city;
            contactState.value = contactToUpdate.state;
            contactCountry.value = contactToUpdate.country;
            contactPrivate.checked = contactToUpdate.isPrivate;
            contactOwner.value = contactToUpdate.owner;
        }
    }

    const cancelClicked = () => {
        context.currentScreen = "mainScreen";
        setContext({...context, currentContact: null });
    }

    const updateClicked = async () => {
        console.log("Contact Owner", contactOwner.value);
        if (context.currentContact != null){
            let contactToUpdate = {
                _id: context.currentContact._id,
                firstname: contactFirstName.value,
                lastname: contactLastName.value,
                street: contactStreetName.value,
                plz: contactPLZ.value,
                city: contactCity.value,
                state: contactState.value,
                country: contactCountry.value,
                isPrivate: contactPrivate.checked,
                owner: contactOwner.value,
            }

            if (context.userLoggedIn != null && (context.userLoggedIn.isAdmin || !context.userLoggedIn.isAdmin && contactToUpdate.owner.toLowerCase() === "normalo")){
                let coords = await getCoords(contactStreetName.value);
                if (coords != null){
                    contactToUpdate.lon = coords.lon;
                    contactToUpdate.lat = coords.lat;
                }
                await updateContact(contactToUpdate);
                alert("Successfully updated Contact");
            } else {
                alert("Insufficient Permission")
            }
            context.currentScreen = "mainScreen";
            context.currentContact = null;
            setContext({...context});
            await showOwnContacts([context, setContext]);
        } else {
            alert("Something went wrong trying to update your contact")
        }
    }

    const deleteClicked = async () => {
        if (context.currentContact != null && context.userLoggedIn != null){
            let userLoggedIn = context.userLoggedIn;
            let currentContact = context.currentContact;
            if (userLoggedIn.isAdmin || !userLoggedIn.isAdmin && currentContact.owner.toLowerCase() === "normalo"){
                await deleteContact(currentContact._id);
                alert("Successfully deleted Contact");
            } else {
                alert("Insufficient Permission");
            }
            context.currentScreen = "mainScreen";
            context.currentContact = null;
            setContext({...context});
            await showOwnContacts([context, setContext]);
        } else {
            alert("Something went wrong trying to delete your contact")
        }
    }

    useEffect(postInit);

    return (
        <div id="update_delete_ID">
            <form>
                <div className="input_box">
                    <label htmlFor="delete_vorname" className="input_lable">Vorname</label>
                    <input type="text" id="delete_vorname" ref={e => contactFirstName = e} name="delete_vorname"
                            required/>
                    <br/>
                    <label htmlFor="delete_name" className="input_lable">Name</label>
                    <input type="text" id="delete_name" ref={e => contactLastName = e} name="delete_name"
                           required/>
                    <br/>
                    <label htmlFor="delete_strasse" className="input_lable">Straße</label>
                    <input type="text" id="delete_strasse" ref={e => contactStreetName = e} name="delete_strasse"
                           required/>
                    <br/>
                    <label htmlFor="delete_plz" className="input_lable">PLZ</label>
                    <input type="text" id="delete_plz" ref={e => contactPLZ = e} name="delete_plz"
                           required/>
                    <br/>
                    <label htmlFor="delete_stadt" className="input_lable">Stadt</label>
                    <input type="text" id="delete_stadt" ref={e => contactCity = e} name="delete_stadt"
                           required/>
                    <br/>
                    <label htmlFor="delete_bundesland" className="input_lable">Bundesland</label>
                    <input type="text" id="delete_bundesland" ref={e => contactState = e} name="delete_bundesland"
                           />
                    <br/>
                    <label htmlFor="delete_land" className="input_lable">Land</label>
                    <input type="text" id="delete_land" ref={e => contactCountry = e} name="delete_land"
                           />
                    <br/>
                    <label htmlFor="delete_privat" className="input_lable">Privat</label>
                    <input type="checkbox" id="delete_privat" ref={e => contactPrivate = e} name="delete_privat"/>
                    <br/>
                    <label htmlFor="delete_owner" className="input_lable">Owner</label>
                    <select id="delete_owner" ref={e => contactOwner = e}>
                        {options}
                    </select>
                    <br/>
                    <input type="button" onClick={deleteClicked} id="btn_delete" name="btn_delete"
                           value="Delete"/>
                    <input type="button" onClick={updateClicked} id="btn_update" name="btn_update"
                           value="Update"/>
                    <input type="button" onClick={cancelClicked} id="btn_cancel" name="btn_cancel"
                           value="Cancel"/>
                </div>
            </form>
        </div>
    );
}

export default UpdateDeleteScreen;