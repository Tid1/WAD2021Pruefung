import {getAllContacts} from "../crudManager";
import {useContext, useEffect, useState} from "react";
import {MyContext} from "../App";

function ContactListComponent() {
   /*let [state, setState] = useState([]);
    useEffect((f) => {getAllContacts().then((e) => setState(e))}, []); */

    let [context, setContext] = useContext(MyContext);
    const showContact = (contact) => {
        context.currentScreen = "updateDeleteScreen";
        setContext({...context, currentContact: contact});
        console.log("Contact List currentContact: " , context.currentContact);
    };

    return (
        <div className="contacts" id="contactsID">
            {(context.contactList != null) && context.contactList.map((contact) => {
                return(
                  <button onClick={() => showContact(contact)}>{contact.firstname} {contact.lastname}</button>
                );
            })}
        </div>
    );
}

export default ContactListComponent;