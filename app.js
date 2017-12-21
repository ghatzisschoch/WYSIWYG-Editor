var userArray = [];
var dragData = null;
var currentMove = null;
var selection = null;
var lastChange = [];
var lastHTMLChange = [];
var childs = document.getElementById("user").children;
uiselect.innerHTML = "Current Selection: ";

listen = function (ob) {
    selection = ob;
    if (contains(userArray, ob) == true) {
        currentMove = ob;
        uiselect.innerHTML = "Current Selection: " + ob.id;
    }
    if (window.addEventListener) {
        document.addEventListener('mousemove', drag, false);
        document.body.addEventListener('mouseup', stopDrag, false);
    }
    if (dragData == null) {
        if (selection == currentMove)
            lastChange.push(currentMove.parentNode.cloneNode(true));
        dragData = {
            x: event.clientX - selection.offsetLeft,
            y: event.clientY - selection.offsetTop
        };
    }
}

function drag(ev) {
    selection.style.top = ev.clientY - (dragData.y) + "px";
    selection.style.left = ev.clientX - (dragData.x) + "px";
}

function stopDrag(ev) {
    dragData = null;
    document.body.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('mousemove', drag);
    list();
    if (currentMove.onclick !== null)
        currentMove.onclick();
}

function contains(arr, obj)
{
    for (var c = 0; c < arr.length; c++)
    {
        if (arr[c] == obj)
        {
            return true;
        }
    }
    return false;
}

list = function ()
{
    uicodearea.innerHTML = "";
    for (var c = 0; c < userArray.length; c++) {
        var code = generateCode(userArray[c]);
        cleanupDiv();
        uicodearea.innerHTML += code + '\n' + '\n';
    }
}
list();


function generateCode(elem)
{
    var ndiv = make("DIV;id=" + elem.id + "div" + ";");
    ndiv.appendChild(elem);
    userdiv = document.getElementById("user");
    userdiv.appendChild(ndiv);
    var elemCode = ndiv.innerHTML;
    elemCode = elemCode.split('onmousedown="listen(this);"').join("");
    return elemCode.trim();
}

function cleanupDiv()
{
    for (var c = 0; c < childs.length; c++)
    {
        if (childs[c].children.length == 0)
        {
            childs[c].parentNode.removeChild(childs[c]);
        }
    }
}

function makeElement() {
    var valid = false;
    var type = prompt("Element type (e.g. BUTTON, TEXTAREA, DIV,INPUT, etc)");
    var elemid;
    while (valid == false)
    {
        elemid = prompt("Enter a unique id:");

        valid = true;
        if (elemid == "")
            valid = false;
        for (var c = 0; c < userArray.length; c++)
        {
            if (userArray[c].id == elemid)
            {
                valid = false;
            }
        }
    }
    var bwidth = prompt("Element width:");
    var bheight = prompt("Element height:");
    var text = prompt("Text:");
    var theElem = make(type + ";id=" + elemid + ";left:320px;top:20px;width:" + bwidth + "px;height:" + bheight + "px;" + "innerHTML=" + text + ";");
    theElem.setAttribute("onmousedown", "listen(this);");
    userArray.push(theElem);
    list();
}

var hidev = false;
var saveVisibility = new Array(6);
function hideUI() {
    if (hidev == false) {
        hidev = true;
        saveVisibility[0] = uiscriptarea.style.visibility;
        saveVisibility[1] = uiscriptDiv.style.visibility;
        saveVisibility[2] = uiselectionarea.style.visibility;
        saveVisibility[3] = uiselectionDiv.style.visibility;
        saveVisibility[4] = uicodearea.style.visibility;
        saveVisibility[5] = uidirectionsdiv.style.visibility;
        uiscriptarea.style.visibility = "hidden";
        uiscriptDiv.style.visibility = "hidden";
        uiselectionarea.style.visibility = "hidden";
        uiselectionDiv.style.visibility = "hidden";
        var uiElems = document.getElementsByClassName("ui");
        for (var c = 0; c < uiElems.length; c++)
        {
            uiElems[c].style.visibility = "hidden";
        }
        uihide.innerHTML = "Show UI";
    }
    else
    {
        hidev = false;
        var uiElems = document.getElementsByClassName("ui");
        for (var c = 0; c < uiElems.length; c++)
        {
            uiElems[c].style.visibility = "visible";
        }
        uiscriptarea.style.visibility = saveVisibility[0];
        uiscriptDiv.style.visibility = saveVisibility[1];
        uiselectionarea.style.visibility = saveVisibility[2];
        uiselectionDiv.style.visibility = saveVisibility[3];
        uicodearea.style.visibility = saveVisibility[4];
        uidirectionsdiv.style.visibility = saveVisibility[5];
        uihide.innerHTML = "Hide UI";
    }
}


color = function ()
{
    if (currentMove != null) {
        var inp = prompt("Change selection color to:");
        if (inp !== null) {
            lastChange.push(currentMove.parentNode.cloneNode(true));
            currentMove.style.background = inp;
            list();
        }
    }
}

function deleteSelection() {
    if (currentMove != null) {
        lastChange.push(currentMove.parentNode.cloneNode(true));
        currentMove.parentNode.parentNode.removeChild(currentMove.parentNode);
        if (userArray.length != 0)
            userArray.splice(userArray.indexOf(currentMove), 1);
        cleanupDiv();
        deSelect();
        list();
    }
}

function deSelect() {
    uiselect.innerHTML = "Current Selection: ";
    currentMove = null;
}

function buttonListen(e) {
    var evt = window.event ? event : e
    if (evt.keyCode == 90 && evt.ctrlKey && lastChange[lastChange.length - 1] != null)
        undo();

    if (evt.keyCode == 46)
        deleteSelection();

    if (evt.keyCode == 68)
        deSelect();


}
document.onkeydown = buttonListen;


function undo()
{
    if (lastChange[lastChange.length - 1] !== null) {
        var last = lastChange.pop();
        var change = false;
        for (var c = 0; c < childs.length; c++)
        {
            if (childs[c].id == last.id) {
                childs[c].parentNode.removeChild(childs[c]);
                userArray.splice(userArray.indexOf(last), 1)
                change = true;
            }
        }
        if (change == false)
        {
            if (lastHTMLChange[lastHTMLChange.length - 1] != null) {
                var last2 = lastHTMLChange.pop();
                if (last2 !== null) {
                    for (var c = 0; c < childs.length; c++)
                    {
                        if (childs[c].firstChild.id == last2.id) {
                            childs[c].parentNode.removeChild(childs[c]);
                            userArray.splice(userArray.indexOf(last2), 1);
                        }
                    }
                }
            }
            else
            {
                lastHTMLChange.pop();
            }
        }
        userArray.push(last.children[0]);
        deSelect();
        list();
    }
    else
    {
        lastChange.pop();
    }
}


function editOnclick()
{
    if (currentMove != null)
    {

        lastChange.push(currentMove.parentNode.cloneNode(true));
        currentMove.setAttribute("onClick", "");
        var script = prompt("Edit current selection's onclick function innercode. Leave the field blank to clear onclick():" + '\n' + '\n' + currentMove.onclick);
        if (script !== null)
        {
            currentMove.setAttribute("onClick", script);
        }
    }
}

function editScript()
{
    if (uiscriptarea.style.visibility == "hidden") {
        uiscriptarea.style.visibility = "visible";
        uiscriptDiv.style.visibility = "visible";
        uiscriptButton.innerHTML = "Save JavaScript functions";
        for (var c = 0; c < userArray.length; c++)
        {
            if (userArray[c].id == "script")
            {
                uiscriptarea.value = userArray[c].text;
            }

        }
    }
    else
    {
        if (uiscriptarea.value.trim() != "") {
            uiscriptButton.innerHTML = "Add JavaScript functions";
            uiscriptarea.style.visibility = "hidden";
            uiscriptDiv.style.visibility = "hidden";
            makeScript("");
            list();
        }
        else
        {
            uiscriptButton.innerHTML = "Add JavaScript functions";
            uiscriptarea.style.visibility = "hidden";
            uiscriptDiv.style.visibility = "hidden";
            if (document.getElementById("script") != null) {
                userArray.splice(userArray.indexOf(document.getElementById("script")), 1);
                document.getElementById("script").parentNode.parentNode.removeChild(document.getElementById("script").parentNode);
            }
            list();

        }
    }
}

function makeScript(script)
{
    var theScript = document.createElement('script');
    theScript.id = "script";
    theScript.type = "text\/javascript";
    if (script == "") {
        theScript.text = uiscriptarea.value;
    }
    else
    {
        theScript.text = script;
    }
    if (userArray.length != 0) {
        for (var c = 0; c < userArray.length; c++)
        {
            if (userArray[c].id == "script")
            {
                userArray[c].parentNode.parentNode.removeChild(userArray[c].parentNode);
                userArray.splice(c, 1);
            }

        }
        userArray.push(theScript);
        list();
    }
    else
    {
        userArray.push(theScript);
        list();
    }
}

var selected;
function editHTML()
{
    if (uiselectionarea.style.visibility == "hidden" && currentMove !== null) {
        selected = currentMove;
        uiselectionarea.style.visibility = "visible";
        uiselectionDiv.style.visibility = "visible";
        uiselectionButton.innerHTML = "Save selection";
        uiselectionarea.value = generateCode(selected);
    }
    else if (uiselectionarea.style.visibility == "visible")
    {
        currentMove = selected;
        lastChange.push(currentMove.parentNode.cloneNode(true));
        if (uiselectionarea.value.trim() != "") {
            uiselectionButton.innerHTML = "View/Edit selection html";
            uiselectionarea.style.visibility = "hidden";
            uiselectionDiv.style.visibility = "hidden";
            var ndiv = document.createElement('div');
            ndiv.innerHTML = uiselectionarea.value;
            deleteSelection();
            ndiv.firstChild.setAttribute("onmousedown", "listen(this);");
            lastHTMLChange.push(ndiv.firstChild);
            userArray.push(ndiv.firstChild);
            list();
            deSelect();
        }
        else
        {
            currentMove = selected;
            deleteSelection();
            uiselectionButton.innerHTML = "View/Edit selection html";
            uiselectionarea.style.visibility = "hidden";
            uiselectionDiv.style.visibility = "hidden";
        }
    }
}

function savePage()
{
    var arr = [], divid = [];
    for (var c = 0; c < userArray.length; c++)
    {
        arr[c] = userArray[c].parentNode.innerHTML;
        divid[c] = userArray[c].parentNode.id;
    }
    var jstring = JSON.stringify(arr);
    localStorage.setItem("userArray", jstring);
    localStorage.setItem("divid", JSON.stringify(divid));
}

function loadPage()
{
    var store = localStorage.getItem("userArray");
    var arr = JSON.parse(store);
    var ids = JSON.parse(localStorage.getItem("divid"));

    for (var c = 0; c < ids.length; c++)
    {
        if (document.getElementById(ids[c]) == null) {
            var ndiv = document.createElement('div');
            ndiv.innerHTML = arr[c];
            if (ndiv.firstChild.nodeName != "SCRIPT") {
                userArray.push(ndiv.firstChild);
            }
            else
            {
                makeScript(ndiv.firstChild.text);
            }

        }
    }
    list();
}

uiviewcodeButton.onclick = function ()
{
    if (uicodearea.style.visibility == "hidden")
    {
        uicodearea.style.visibility = "visible";
        uiviewcodeButton.innerHTML = "Hide page code";
    }
    else
    {
        uicodearea.style.visibility = "hidden";
        uiviewcodeButton.innerHTML = "Show page code"
    }
}

uisearchElemButton.onclick = function ()
{
    currentMove = document.getElementById(prompt("Enter id of an element:"));
    if (currentMove !== null)
    {
        editHTML();
        uiselect.innerHTML = "Current Selection: " + currentMove.id;
    }
    else
    {
        alert("Element not found");
    }
}

uicopyButton.onclick = function ()
{
    var code =
            "<!DOCTYPE html>" + "\n" +
            "<html>" + "\n" +
            "<head>" + "\n" +
            "</head>" + "\n" +
            "<body>" + "\n" +
            uicodearea.value +
            "</body>" + "\n" +
            "</html>";
    window.prompt("To copy code to clipboard press: Ctrl+C" + '\n' + "Paste this code to a blank HTML file to create your page", code);
}

uidirectionsButton.onclick = function ()
{
    if (uidirectionsdiv.style.visibility == "hidden")
    {
        uidirectionsdiv.style.visibility = "visible";
        uidirectionsButton.innerHTML = "Hide directions";
    }
    else
    {
        uidirectionsdiv.style.visibility = "hidden";
        uidirectionsButton.innerHTML = "Show directions";
    }
}

window.setInterval(function () {
    list();
}, 500);

