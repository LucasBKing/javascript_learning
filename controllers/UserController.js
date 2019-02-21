class UserController {
    constructor(formId, tableId) {
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
    }

    // Adding an event when user press the submit button
    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            let btn = this.formEl.querySelector("[type=submit]");
            // When user click on submit, disable the button until all data is correctly saved
            btn.disabled = true;
            event.preventDefault();

            let values = this.getValues();

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

        /**
         * this.formEl.elements is not an array, it's an object
         * use spread to use forEach
         *  
        */ 

        [...this.formEl.elements].forEach( (field, index) => {
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
    };


    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Yes' : 'No'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);
    };
}