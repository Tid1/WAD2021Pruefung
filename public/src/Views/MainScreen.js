import MapComponent from "../components/MapComponent";
import ContactControllerComponent from "../components/ContactControllerComponent";
import ContactListComponent from "../components/ContactListComponent";
import {MyContext} from "../App";
import {useContext} from "react";

function MainScreen() {
    let [context, setContext] = useContext(MyContext);

    const logoutClicked = () => {
        setContext({...context, currentScreen: "loginScreen", userLoggedIn: null});
    }
    return (
        <>
            <div id="logoutDivID">
                <button id="bntLogout" onClick={logoutClicked} type="button">Logout</button>
            </div>
            <div id="mainScreenID">
                <div className="mainScreen">
                    <ContactControllerComponent/>
                    <div className="mapBox">
                        <ContactListComponent/>
                        <MapComponent/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainScreen;