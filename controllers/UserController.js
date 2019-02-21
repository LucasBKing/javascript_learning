class UserController {
    constructor(formIdCreate, formIdUpdate, tableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
    }

    // Adding an event when user press the submit button
    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");
            // When user click on submit, disable the button until all data is correctly saved
            btn.disabled = true;
            

            let values = this.getValues(this.formEl);

            // Checking if the form is valid
            if(!values) return false;

            this.getPhoto(this.formEl)
                .then((content) => {
                    values.photo = content;

                    this.insert(values);

                    this.addLine(values);

                    // Cleaning the form on screen after submit some new user
                    this.formEl.reset();

                    btn.disabled = false;
                }, (e) => {
                    console.error(e)
                });
        });
    };

    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            // When user click on submit, disable the button until all data is correctly saved
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            
            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formEl)
                .then((content) => {
                    if(!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                        <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? 'Yes' : 'No'}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                    this.addEventsTr(tr);

                    this.updateCount();

                    // Cleaning the form on screen after submit some new user
                    this.formUpdateEl.reset();

                    btn.disabled = false;

                    this.showPanelCreate();
                }, (e) => {
                    console.error(e)
                });

        });
        
    };

    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    };

    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    };

    getPhoto(formEl) {

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
        
            let elements = [...formEl.elements].filter( item => {
                if (item.name === 'photo')
                    return item;
            });

            let file = elements[0].files[0];

            // Async function
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e);
            };

            // handling submit without photo
            if(file)
                fileReader.readAsDataURL(file);
            // default photo
            else   
                resolve('profiles.png');
        });
        
    }
    // Saving all user data
    getValues(formEl) {
        let user = {};
        let isValid = true;
        /**
         * this.formEl.elements is not an array, it's an object
         * use spread to use forEach
         *  
        */ 

        [...formEl.elements].forEach( (field, index) => {


            // If the current field is a required field, test if the value is null
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                // adding error class to parent of this input
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Taking just the checked gender
            if(field.name == "gender") {
                // If the select is checked, use it
                if(field.checked)
                    user[field.name] = field.value;
            } else if(field.name === "admin") {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }
        });

        if (isValid) {

            return new User(
                user.name, 
                user.gender, 
                user.birth, 
                user.country, 
                user.email, 
                user.password, 
                user.photo, 
                user.admin
            );
        } else {
            return false;
        }
        
    };

    //getting users from session storage
    getUsersStorage() {
        let users = [];

        if(sessionStorage.getItem("users")) {

            users = JSON.parse(sessionStorage.getItem("users"));
        }

        return users;
    };

    //
    selectAll() {
        let users = this.getUsersStorage();

        users.forEach( data => {
            let user = new User();
            user.loadFromJSON(data);

            this.addLine(user);
        });
    }
    //insert into session storage
    insert(data) { 

        let users = this.getUsersStorage();
        
        users.push(data);
        // setItem(key, value)
        sessionStorage.setItem("users", JSON.stringify(users));
    };

    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Yes' : 'No'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-edit btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-delete btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    };

    // Counting the nunmber of users and admin users
    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0; 

        [...this.tableEl.children].forEach( tr => {
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            // If user are admin, count it on numberAdmin
            if (user._admin) numberAdmin++;

        });

        // Printing on screen
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    };

    addEventsTr(tr) {
        tr.querySelector(".btn-delete").addEventListener("click", e => {
            if (confirm("Deseja realmente excluir?")) {
                tr.remove();

                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {
            let jsonUsers = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            // Filling in all user data already registered
            for(let name in jsonUsers) {
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");    
                
                if(field) {

                    switch(field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + jsonUsers[name] + "]");    
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = jsonUsers[name];
                            break;
                        default:
                            field.value = jsonUsers[name];
                    }
                }
            }

            this.formUpdateEl.querySelector(".photo").src = jsonUsers._photo;

            this.showPanelUpdate();

        });
    };
}