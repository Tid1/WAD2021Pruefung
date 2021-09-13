import {useContext, useState} from "react";
import {logInUser} from "../crudManager";
import {MyContext} from "../App";
import {showOwnContacts} from "../utils/Utils";

function LoginScreen() {
    let [state, setState] = useState({uname: "", psw: ""})
    let [context, setContext] = useContext(MyContext);

    const handleUsernameChange = (e) => {
        setState({...state, uname: e.target.value});
        console.log("triggered")
        console.log(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setState({...state, psw: e.target.value});
    }

    const getUser = async () => {
        let username = state.uname;
        let password = state.psw;

        console.log("Username: " + username + " Password: " + password + " State Username: " + state.uname);
        let user = await logInUser(username, password);
        if (user != null){
            alert("Welcome back " + username);
            context.userLoggedIn = user;
            setState({uname: "", psw: ""});
            context.currentScreen = "mainScreen";
            setContext({...context});
            await showOwnContacts([context, setContext]);
        }
    }

    return (
        <div id="loginScreenID">
            <form>
                <div className="imgcontainer">
                    <img src="images/lucio.png" alt="Avatar" className="avatar"/>
                </div>

                <div className="container">
                    <div className="login">
                        <label htmlFor="uname"><b>Username</b></label>
                        <input type="text" value={state.uname} onChange={handleUsernameChange} placeholder="Enter Username" id="uname" required/>

                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" value={state.psw} onChange={handlePasswordChange} placeholder="Enter Password" id="psw" required/>

                        <button id="bntLogin" type="button" onClick={getUser}>Login</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginScreen;