var length = 5;
function changeLen()
{
    length = prompt("Change password length to:");
}


function generatePass()
{
    var password = "";

    for (var c = 0; c < length; c++)
    {
        password += Math.floor((Math.random() + 1));
    }
    alert(password);
}
