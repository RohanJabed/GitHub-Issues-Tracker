document.getElementById("sign-up")
.addEventListener('click',function(e){
    e.preventDefault();

    const UserName = document.getElementById("user-name").value;
    const password = document.getElementById("password").value;

    if(UserName === "admin" && password === "admin123"){
        alert("Login successful!");
        window.location.href = "home.html";
    }else{
        alert("Invalid UserName or password. Please try again.");
    }
})