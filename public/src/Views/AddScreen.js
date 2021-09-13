import {MyContext} from "../App";
import {useContext} from "react";
import {postContact} from "../crudManager";
import {showOwnContacts, getCoords} from "../utils/Utils";

function AddScreen(){
    let contactStreetName, contactFirstName, contactLastName, contactPLZ, contactCity, contactState, contactCountry, contactPrivate, contactOwner ;
    let [context, setContext] = useContext(MyContext);
    let options = [];

    switch (context.userLoggedIn.username.toLowerCase()){
        case "admina":
            options.push(<option value="self">Self</option>);
            options.push(<option value="normalo">Normalo</option>);
            break;

        case "normalo":
            options.push(<option value="normalo">Normalo</option>);
            break;
    }

    const addClicked = async () => {
        let contact = {
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

        let coords = await getCoords(contactStreetName.value);
        console.log(coords);

        if (coords != null){
            contact.lon = coords.lon;
            contact.lat = coords.lat;
        } else {
            contact.lon = null;
            contact.lat = null;
        }

        contact._id = await postContact(contact);
        let userLoggedIn = context.userLoggedIn;

        if (userLoggedIn.isAdmin && contactOwner.value.toLowerCase() === "self" || !userLoggedIn.isAdmin && contactOwner.value.toLowerCase() === "normalo"){
            setContext({...context, contactList: context.contactList.push(contact)});
        }
        context.currentScreen = "mainScreen";
        setContext({...context});
        alert("Successfully added Contact");
        await showOwnContacts([context, setContext]);
    }

    return (
        <div id="add_ID">
            <form>
                <div className="input_box">
                    <label htmlFor="add_vorname" className="input_lable">Vorname</label>
                    <input type="text" id="add_vorname" ref={e => contactFirstName = e} name="add_vorname" required/>
                    <br/>
                    <label htmlFor="add_name" className="input_lable">Name</label>
                    <input type="text" id="add_name" ref={e => contactLastName = e} name="add_name" required/>
                    <br/>
                    <label htmlFor="add_strasse" className="input_lable">Straße</label>
                    <input type="text" id="add_strasse" ref={e => contactStreetName = e} name="add_strasse" required/>
                    <br/>
                    <label htmlFor="add_plz" className="input_lable">PLZ</label>
                    <input type="text" id="add_plz" ref={e => contactPLZ = e} name="add_plz" required/>
                    <br/>
                    <label htmlFor="add_stadt" className="input_lable">Stadt</label>
                    <input type="text" id="add_stadt" ref={e => contactCity = e} name="add_stadt" required/>
                    <br/>
                    <label htmlFor="add_bundesland" className="input_lable">Bundesland</label>
                    <input type="text" id="add_bundesland" ref={e => contactState = e} name="add_bundesland"/>
                    <br/>
                    <label htmlFor="add_land" className="input_lable">Land</label>
                    <input type="text" id="add_land" ref={e => contactCountry = e} name="add_land"/>
                    <br/>
                    <label htmlFor="add_privat" className="input_lable">Privat</label>
                    <input type="checkbox" id="add_privat" ref={e => contactPrivate = e} name="add_privat" checked/>
                    <br/>
                    <label htmlFor="add_owner" className="input_lable">Owner</label>
                    <select id="add_owner" ref={e => contactOwner = e}>
                        {options}
                    </select>
                    <br/>
                    <input type="button" onClick={addClicked} id="btn_add" name="btn_add" value="Add"/>
                </div>
            </form>
        </div>
    );
}

export default AddScreen;