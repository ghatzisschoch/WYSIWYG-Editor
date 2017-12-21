function undo()
{
    if (lastChange[lastChange.length - 1] !== null) {
        var last = lastChange.pop();
        var change = false;
        for (var c = 0; c < userArray.length; c++)
        {
            if (userArray[c].id == last.id) {
                userAr - ray[c].parentNode.parentNode.removeChild(userArray[c].parentNode);
                userArray.splice(c, 1)
                change = true;
            }
        }
        if (change == false)
        {
            if (lastHTMLChange[lastHTMLChange.length - 1] != null) {
                var last2 = lastHTMLChange.pop();
                if (last2 !== null) {
                    for (var c = 0; c < userArray.length; c++)
                    {
                        if (userArray[c].id == last.id) {
                            userAr - ray[c].parentNode.parentNode.removeChild(userArray[c].parentNode);
                            userArray.splice(c, 1)
                            change = true;
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
