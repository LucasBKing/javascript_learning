/*
Bad way to get all fields:
var name = document.querySelector("#exampleInputName");
var gender = document.querySelectorAll("#form-user-create [name=gender]:checked");
var birth = document.querySelector("#exampleInputBirth");
var country = document.querySelector("#exampleInputCountry");
var email = document.querySelector("#exampleInputEmail1");
var password = document.querySelector("#exampleInputPassword1");
var photo = document.querySelector("#exampleInputFile");
var admin = document.querySelector("#exampleInputAdmin");
*/

var fields = document.querySelectorAll("#form-user-create [name]");

var user = {};

addLine = dataUser => {

    document.getElementById("table-users").innerHTML = `
        <tr>
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>   
    `;
};

// Adding an event when user press the submit button
document.getElementById("form-user-create").addEventListener("submit", event => {
    event.preventDefault();
    
    // Saving all user data
    fields.forEach(field => {
        // Taking just the checked gender
        if(field.name == "gender") {
            // If the select is checked, use it
            if(field.checked)
                user[field.name] = field.value;
        } else {
            user[field.name] = field.value;
        }
    });

    var objectUser = new User(
        user.name, 
        user.gender, 
        user.birth, 
        user.country, 
        user.email, 
        user.password, 
        user.photo, 
        user.admin
    );

    addLine(objectUser);
});

