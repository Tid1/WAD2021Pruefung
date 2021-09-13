let url = "http://localhost:3000/users";

async function postUser(username, password, firstname, lastname, isAdmin){
    let userToPost = {username: username, password : password, firstname: firstname, lastname : lastname, isAdmin: isAdmin};
    let userStringified = JSON.stringify(userToPost);
    console.log(JSON.stringify(userToPost));
    console.log(userStringified.username)
    let userJSON = JSON.parse(userStringified);
    console.log(userJSON.username)
    let response = await fetch(url, {method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(userToPost)});
    console.log((await response).status)
    let responseText = await response.text()
    let responseJson = JSON.parse(responseText)
    console.log(responseJson.username)

}

async function deleteUser(username, password, firstname, lastname, isAdmin){
    let userToDelete= {username: username, password : password, firstname: firstname, lastname : lastname, isAdmin: isAdmin};
    let response = await fetch(url, {method: "DELETE",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(userToDelete)});
    console.log((await response).status)
}

