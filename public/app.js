// ==============================
// Dashboard - Total Users Count
// ==============================

fetch("/users")
.then(response => response.json())
.then(data => {

    const total = document.getElementById("totalUsers");

    if(total){
        total.innerHTML = data.length;
    }

})
.catch(err => console.log(err));



// ==========================
// Add User
// ==========================

const form = document.getElementById("userForm");

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const user = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            phone: document.getElementById("phone").value.trim()
        };

        console.log("Sending:", user);

        try {

            const response = await fetch("/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {

                alert("✅ User Added Successfully");

                form.reset();

                window.location.href = "viewUsers.html";

            } else {

                alert("❌ " + JSON.stringify(data));

            }

        } catch (err) {

            console.log(err);

            alert("Server Error");

        }

    });

}



// ==============================
// Display Users
// ==============================


const table = document.getElementById("userTable");


if(table){

    loadUsers();

}


function loadUsers(){

    fetch("/users")

    .then(res=>res.json())

    .then(users=>{


        table.innerHTML="";


        users.forEach(user=>{


            table.innerHTML += `

            <tr>

                <td>${user.user_id}</td>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${user.phone}</td>


                <td>

                    <button onclick="editUser(${user.user_id})">
                        Edit
                    </button>


                    <button onclick="deleteUser(${user.user_id})">
                        Delete
                    </button>


                </td>


            </tr>

            `;


        });


    })

    .catch(err=>console.log(err));

}



// ==============================
// Delete User
// ==============================


function deleteUser(id){


    if(confirm("Delete this user?")){


        fetch("/users/"+id,{

            method:"DELETE"

        })


        .then(res=>res.json())


        .then(data=>{


            alert(data.message);


            loadUsers();


        })


        .catch(err=>console.log(err));


    }

}



// ==============================
// Edit User Redirect
// ==============================


function editUser(id){

    window.location="editUser.html?id="+id;

}



// ==============================
// Edit User
// ==============================


const editForm = document.getElementById("editForm");


if(editForm){


    const id = new URLSearchParams(window.location.search).get("id");



    fetch("/users/"+id)


    .then(res=>res.json())


    .then(data=>{


        document.getElementById("name").value=data[0].name;

        document.getElementById("email").value=data[0].email;

        document.getElementById("password").value=data[0].password;

        document.getElementById("phone").value=data[0].phone;


    });



    editForm.addEventListener("submit",function(e){


        e.preventDefault();



        const user={


            name:document.getElementById("name").value,

            email:document.getElementById("email").value,

            password:document.getElementById("password").value,

            phone:document.getElementById("phone").value


        };



        fetch("/users/"+id,{


            method:"PUT",


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify(user)


        })

        .then(res=>res.json())

        .then(data=>{


            alert(data.message);


            window.location="viewUsers.html";


        });



    });


}



// ==============================
// Register
// ==============================


const registerForm=document.getElementById("registerForm");


if(registerForm){


registerForm.addEventListener("submit",function(e){


e.preventDefault();



const user={


name:document.getElementById("name").value,

email:document.getElementById("email").value,

password:document.getElementById("password").value,

phone:document.getElementById("phone").value


};



fetch("/users/register",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(user)



})


.then(res=>res.json())


.then(data=>{


alert(data.message);


window.location="login.html";


});



});


}




// ==============================
// Login
// ==============================


const loginForm=document.getElementById("loginForm");


if(loginForm){


loginForm.addEventListener("submit",function(e){


e.preventDefault();



const data={


email:document.getElementById("email").value,

password:document.getElementById("password").value


};



fetch("/users/login",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify(data)



})


.then(res=>res.json())


.then(result=>{


alert(result.message);


if(result.success){

window.location="dashboard.html";

}


});



});


}




// ==============================
// Logout
// ==============================


function logout(){


fetch("/users/logout")


.then(res=>res.json())


.then(data=>{


alert(data.message);


window.location="login.html";


});


}



// ==============================
// Search Users
// ==============================


function searchUsers(){


const input=document

.getElementById("search")

.value

.toLowerCase();



const rows=document

.querySelectorAll("#userTable tr");



rows.forEach(row=>{


const text=row.innerText.toLowerCase();



if(text.includes(input)){


row.style.display="";


}

else{


row.style.display="none";


}



});


}