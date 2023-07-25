//Get Reference for both the Forms
const signUpForm = document.getElementById('signUpForm');
const LogInForm = document .getElementById('LogInForm');
//Event Listener for SignUp
signUpForm.addEventListener('submit',(e)=>{e.preventDefault();
    const UserName1 = document.getElementById('FullName').value;
    const Email1= document.getElementById('Email')
    const Password1 = document.getElementById('Password').value;
    const confirmPass= document.getElementById('confirmPassword').value;
//Store the Information in IndexedDB
SaveDataToIndexedDB(UserName1, Password1, Email1, confirmPass);
});
//Event Listener for Login
LoginForm.addEventListener('submit',(e) =>{e.preventDefault();
    const Email2 = document.getElementById('Email').value;
    const Password2 = document.getElementById('LoginPassword').value;
    //Read the Information from IndexedDB
CheckDataInIndexedDB(Email2,Password2);
});
//Function to Store Data in IndexedDB
function SaveDataToIndexedDB(UserName, Password)
{   const User = {username: UserName, password: Password, };
    const request = window.indexedDB.open('UserDB',1);
    request.onerror = (event)=>
    {console.error('Sorry. Error Creating IndexedDB Database');};
    request.onsuccess = (event)=>
    {   const db = event.target.result;
        const transaction = db.transaction(['Users'],'readwrite');
        const objectstore = transaction.objectStore('Users');
        const addUserRequest = objectstore.add(User);
        addUserRequest.onsuccess = ()=>
        {console.log('User Data Saved Successfully!');};
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
            {window.location.href="./ShowImg.html";}

            else {document.getElementById("message").innerHTML='UserName or Password Incorrect'
                console.log('UserName or Password Incorrect');}
        };
        transaction.oncomplete= ()=>{db.close();};
    };
    request.onupgradeneeded=(event)=>
    {   const db=event.target.result;
        db.createObjectStore('Users',{keyPath:'UserName'});
    };
}