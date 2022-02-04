class Employee {
    constructor(name, salary, age, url) {
        this.name = name;
        this.salary = salary;
        this.age = age;
        this.url = url;
    }
//     constructor(name) {
//         this.name = name;
//         this.traits = [];
//     }
    
//     addTrait(username, email) {
//         this.traits.push(new Trait(username, email));
//     }
// }

// class Trait {
//     constructor(username, email) {
//         this.username = username;
//         this.email = email;
//     }
}

class EmployeeService {
    static url = "http://dummy.restapiexample.com/api/v1/";
  
    static getAllEmployees() {
        return $.get("http://dummy.restapiexample.com/api/v1/employees").done( (res) => console.log(res));
    }

    static getEmployee(id) {
        return $.get(this.url  + `employee/${id}`).done( (res) => console.log(res));
    }

    static createEmployee(employee) {
        return $.post(this.url, employee).done( (res) => console.log(res));
    }

    static updateEmployee(employee) {
        return $.ajax({
            url: this.url + `/${employee.id}`,
            dataType: 'json',
            data: JSON.stringify(employee),
            contentType: 'application/json',
            type: 'PUT'
        }).done( (res) => console.log(res));
    }

    static deleteEmployee(id) {
        return $.ajax ({
            url: "http://dummy.restapiexample.com/api/v1/" + `delete/${id}`,	
            type: 'DELETE'
        }).done( (res) => console.log(res));
    }
}

class DOMManager {
    static employees;

    static getAllEmployees() {
        EmployeeService.getAllEmployees().then(employees => this.render(employees.data));
    } 

    static getEmployee(id) {
        EmployeeService.getEmployee(id).then(employees => this.render(employees.data));
    } 

    static createEmployee(name) {
       EmployeeService.createEmployee(new Employee(name))
        .then(() => {
            return EmployeeService.getAllEmployees();
        })
        .then((employees) => this.render(employees));//grab all the employees from the api and render those employees
    }

    static deleteEmployee(id) {   //delete a employee   // makes the deleteEmployee button work
        EmployeeService.deleteEmployee(id)
            .then(() => {  //send a request to get all employees that now exist.
                return EmployeeService.getAllEmployees();
            })
            .then((employees) => this.render(employees.data));
    }

    static addTrait(id) {
        for (let employee of this.employees) {
            if (employee._id == id) { //add a new trait (push) to the trait array on the employee
                employee.traits.push(new Trait($(`#${employee.id}-username`).val(), $(`#${employee.id}-email`).val()));
                EmployeeService.updateEmployee(employee) //sending new trait data to the api
                .then(() => {
                    return EmployeeService.getAllEmployees();
                })
                .then((employees) => this.render(employees));
            }
        }
    } 

    static deleteTrait(employeeId, traitId) {
        for (let employee of this.employees.data) {
            if (employee._id == employeeId) {
                for (let trait of employee.traits) {
                    if (trait._id == traitId) {
                        employee.traits.splice(employee.traits.indexOf(trait), 1);
                        EmployeeService.updateEmployee(employee)
                            .then(() => {
                                return EmployeeService.getAllEmployees();
                            })
                            .then((employees) => this.render(employees));
                    }
                }
            }
        }
    }

     static render(employees) {
        if (employees.length == undefined) {
            let employee = employees;
            this.employees = employees;
            $('#app').empty();
            
                $('#app').prepend(
                    `<div id="${employee.id}" class="card">
                        <div class="card-header">
                            <h2>${employee.employee_name}</h2>
                            <button class="btn btn-danger" onclick="DOMManager.deleteEmployee('${employee.id}')">Delete</button> 
                        </div>
                        <div class="card-body">
                            <p>${employee.employee_salary}</p>
                            <p>${employee.employee_age}</p>
                        </div>
                    



                    </div><br>`
                );
        } else {
            this.employees = employees;
            $('#app').empty();
            for (let employee of employees) {
                $('#app').prepend(
                    `<div id="${employee.id}" class="card">
                        <div class="card-header">
                            <h2>${employee.employee_name}</h2>
                            <button class="btn btn-danger" onclick="DOMManager.deleteEmployee('${employee.id}')">Delete</button> 
                        </div>
                        <div class="card-body">
                            <p>${employee.employee_salary}</p>
                            <p>${employee.employee_age}</p>
                        </div>
                    
    
    
    
                    </div><br>`
                );
        }
        
            // <div class="card-body">
            //             <div class="card">
            //                 <div class="row">
            //                     <div class="col-sm">
            //                         <input type="text" id="${employee._id}-username" class="form-control" placeholder="username">
            //                     </div>
            //                 <div class="col-sm">
            //                         <input type="text" id="${employee._id}-email" class="form-control" placeholder="email">
            //                     </div>
            //                 </div>
            //                 <button id="${employee._id}-new-trait" onclick="DOMManager.addTrait('${employee._id}')" class="btn btn-primary form-control">add trait</button>
            //             </div>
            //         </div>
            // for (let trait of employee.traits) {
            //     $(`#${employee._id}`).find('.card-body').append(
            //         `<p>
            //         <span id="username-${trait._id}"><strong>username: </strong> ${trait.username}</span>
            //         <span id="email-${trait._id}"><strong>email: </strong> ${trait.email}</span>
            //         <button class="btn btn-danger" onclick="DOMManager.deleteTrait('${employee._id}', '${trait._id}')">Delete Trait</button>`
            //     );
            // }
        }
    }
}

$('#create-new-employee').on('click',function(){
    DOMManager.createEmployee($('#new-employee-name').val());
    $('#new-employee-name').val('');
});

//DOMManager.getEmployee(6);
DOMManager.getAllEmployees();

