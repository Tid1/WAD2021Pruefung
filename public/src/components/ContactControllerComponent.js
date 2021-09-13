import {getAllContacts, getContactsOfUser} from "../crudManager";
import {useContext, useState} from "react";
import {MyContext} from "../App";
import {set} from "ol/transform";
import {showOwnContacts} from "../utils/Utils";

function ContactControllerComponent() {
    let [state, setState] = useState([]);
    let [context, setContext] = useContext(MyContext);

   const showMineClicked = async () => {
        await showOwnContacts([context, setContext]);
    }


    const showAllClicked = async () => {
        let contactList = await getAllContacts();
        let userLoggedIn = context.userLoggedIn;
        let contactListToShow = [];

        if (userLoggedIn.isAdmin) {
            contactListToShow = contactList;
        } else {
            contactList.forEach(function (contact) {
                if (contact.owner.toLowerCase() === "normalo" || !contact.isPrivate) {
                    contactListToShow.push(contact);
                }
            });
        }
        setContext({...context, contactList: contactListToShow});
    }

    const addNewContact = () => {
       context.currentScreen = "addScreen";
       setContext({...context});
    }

    return (
        <div className="row">
            <div className="column_tripple_butt">
                <div className="tbl_buttons">
                    <button className="btn_addcontact" id="btn_showMineID" onClick={showMineClicked}>Show Mine</button>
                </div>
            </div>
            <div className="column_tripple_butt">
                <div className="tbl_buttons">
                    <button className="btn_addcontact" id="btn_showAllID" onClick={showAllClicked}>Show All</button>
                </div>
            </div>
            <div className="column_tripple_butt">
                <div className="tbl_buttons">
                    <button className="btn_addcontact" id="btn_addNewID" onClick={addNewContact}>Add New</button>
                </div>
            </div>
        </div>
    );
}



export default ContactControllerComponent;