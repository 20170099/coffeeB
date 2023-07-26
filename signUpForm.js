//Get Reference for both the Forms
const signUpForm = document.getElementById('signUpForm');

//Event Listener for SignUp
signUpForm.addEventListener('submit',(e)=>{e.preventDefault();
const UserName1 = document.getElementById('FullName').value;
const Email1 = document.getElementById('Email').value;
const Password1 = document.getElementById('Password').value;
const ConfirmPassword1 = document.getElementById('confirmPassword').value;
//Store the Information in IndexedDB
SaveDataToIndexedDB(UserName1, Email1, Password1, ConfirmPassword1);
});

//Function to Store Data in IndexedDB
function SaveDataToIndexedDB(UserName, Email, Password, ConfirmPassword)
{   const User = {username: UserName, email:Email ,password: Password, confirm: ConfirmPassword};
    const request = window.indexedDB.open('UserDB',1);
    request.onerror = (event)=>
    {console.error('Sorry. Error Creating IndexedDB Database');};
    request.onsuccess = (event)=>
    {   const db = event.target.result;
        const transaction = db.transaction(['Users'],'readwrite');
        const objectstore = transaction.objectStore('Users');
        const addUserRequest = objectstore.add(User);
        addUserRequest.onsuccess = ()=>
        {
            window.location.href = "LogIn.html";
            console.log('User Data Saved Successfully!');
        };
        transaction.onsuccess = ()=>{db.close();};
    };
    request.onupgradeneeded=(event)=>
    {   const db = event.target.result;
        db.createObjectStore('Users',{keyPath:'username'});
    };
}


//Function to Checking User Data in the IndexedDB
function CheckDataInIndexedDB(UserName, Password)
{   const request = window.indexedDB.open('UserDB',1);
    request.onerror = (event)=>{console.error('Error while Reading!');};
    request.onsuccess = (event)=>
    {   const db = event.target.result;
        const transaction = db.transaction(['Users'],'readonly');
        const objectstore = transaction.objectStore('Users');
        const getUserRequest = objectstore.get(UserName);
        getUserRequest.onsuccess = () =>
        {   const User = getUserRequest.result;
            if(User && User.password === Password)
            {
                // console.log('Login Successful!');
                window.location.href = "index.html"
            }
            else {
                document.getElementById("note").innerHTML=`Username or Password Incorrect`
            }
        };
        transaction.oncomplete= ()=>{db.close();};
    };
    request.onupgradeneeded=(event)=>
    {   const db=event.target.result;
        db.createObjectStore('Users',{keyPath:'UserName'});
    };
}