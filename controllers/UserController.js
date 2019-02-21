class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
    }

    // Adding an event when user press the submit button
    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            let btn = this.formEl.querySelector("[type=submit]");
            // When user click on submit, disable the button until all data is correctly saved
            btn.disabled = true;
            event.preventDefault();

            let values = this.getValues();

            // Checking if the form is valid
            if(!values) return false;

            this.getPhoto()
                .then((content) => {
                    values.photo = content;
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
        
    };

    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";
    };

    showPanelUpdate() {
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";
    };

    getPhoto() {

        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
        
            let elements = [...this.formEl.elements].filter( item => {
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
    getValues() {
        let user = {};
        let isValid = true;
        /**
         * this.formEl.elements is not an array, it's an object
         * use spread to use forEach
         *  
        */ 

        [...this.formEl.elements].forEach( (field, index) => {


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
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e => {
            console.log(JSON.parse(tr.dataset.user));

            this.showPanelUpdate();

        });

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
}