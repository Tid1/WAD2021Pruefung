import logo from './logo.svg';
import './App.css';
import LoginScreen from "./Views/LoginScreen";
import MainScreen from "./Views/MainScreen";
import AddScreen from "./Views/AddScreen";
import UpdateDeleteScreen from "./Views/UpdateDeleteScreen";
import {createContext, useContext, useState} from "react";
import {getContactsOfUser} from "./crudManager";

let contextState = {userLoggedIn: null, currentContact: null, currentScreen: null, contactList: []}
export const MyContext = createContext(contextState);

function App() {
    let [context, setContext] = useState(contextState);
    let currentScreen = null;
    switch (context.currentScreen){
        case "loginScreen":
            currentScreen = <LoginScreen/>
            break;
        case "mainScreen":
            currentScreen = <MainScreen/>
            break;
        case "addScreen":
            currentScreen = <AddScreen/>
            break;
        case "updateDeleteScreen":
            currentScreen = <UpdateDeleteScreen/>
            break;
        default:
            currentScreen = <LoginScreen/>
    }

    return (
        <MyContext.Provider value={[context, setContext]}>
            {currentScreen}
        </MyContext.Provider>
    );
}



export default App;
