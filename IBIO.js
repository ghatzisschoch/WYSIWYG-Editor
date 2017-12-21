    //------------------------------------------- 
    //  Created by Dave Mulkey, Germany, 2014
    //
    //  Dynamically adds elements to a web-page.
    //  Sets style="position:absolute" automatically.
    //
    //  Typical calls like this:
    //
    //    make("TEXTAREA;id=showText;left:200px;top:100px;width:300px;height:200px;background:yellow");
    //    
    //    make("BUTTON;id=countBtn;innerHTML=Count Letters;left:200px;top:320px");
    //    countBtn.onclick = function()
    //    {  var num = showText.value.length;
    //       alert("Text area contains " + num + " letters");
    //    }
    //
    //    make("SELECT;id=chooseColor;red|green|blue;left:100px;top:100px");
    //    chooseColor.onchange = function()
    //    {
    //       var c = this.value;
    //       showText.style.background = c;
    //    }
    //  
    //  The first parameter is the TAG NAME :  BUTTON, INPUT, DIV, etc.
    //  This should work with virtually any HTML element, but not all HTML 5
    //  elements have been tested.  For example, videos have not been tested.
    //
    //  The other parameters contain properties (any quantity), separated by ; 
    //  Properties with = signs are the old fashion, web 1.0 properties.
    //  Properties with : are the more modern STYLE properties.
    //  For a SELECT options list, use | symbols to separate the list items.
    //
    //  Use  remove(obj)  to remove the object dynamically.
    //
    //  Keep in mind that these commands actually CREATE or DESTROY elements.
    //  This is not the same as using VISIBILITY to show and hide existing objects.
    //
    //  Be careful to declare the .onclick or .onchange functions only AFTER the
    //  make command creates the element.  If a button will be created after some event,
    //  then you cannot place the .onclick function in the "main" namespace,
    //  as this is processed while the page is loading.  The simple way
    //  is to simply write the .onclick function directly after the make command.
    //
    //-------------------------------------------   

    make = function(args)
    {
        if (args instanceof Array)
        {
            for (arg in args)
            {
                makeOne(args[arg]);
            }
            return null;
        }
        else
        {
            return makeOne(args);
        }
    }

    makeOne = function(args)
    {
        var first = args.indexOf(";");
        if (first < 0)
        {
            first = args.length;
        }
        var objType = args.substring(0,first);
        var properties = args.substring(first+1);

        var obj = document.createElement(objType);
        if (args.indexOf("top:")>=0 || args.indexOf("left:")>=0)
        {
            obj.style.position = "absolute";
        }
        var params = properties.split(";");
      
        for (var p = 0; p < params.length; p++)
        {   
            if (params[p].indexOf("=")>=0)
            {   
                var ps = params[p].split("="); 
                if(ps[0].substring(0,2)=="on")
                {  obj[ps[0]] = eval(ps[1]); }
                else
                {  obj[ps[0]] = ps[1];  }                 
            }
            else if (params[p].indexOf(":")>=0)
            {
                var ps = params[p].split(":");
                obj.style[ps[0]] = ps[1];
            }
            else if (params[p].indexOf("|")>=0)
            {
                var ops = params[p].split("|");
                for(var op=0; op < ops.length; op++)
                {
                    var anOption = document.createElement("OPTION");
                    anOption.text = ops[op]; 
                    obj.options.add(anOption);
                }
            }
        }
        document.body.appendChild(obj);
        return obj;
    }
    
    nextline = function()
    {
        make("br");
    }
   
    //---------------------------------------------------------------------
    // remove accepts either an Object Reference
    //  or the ID string as a parameter
    // remove can also accept an array of parameters
    // other parameters shouldn't cause an error
    //  but won't actually remove anything
    //---------------------------------------------------------------------

    remove = function(args)
    {
        if (args instanceof Array)
        {
            for (arg in args)
            {
                removeOne(args[arg]);
            }
        }
        else
        {
            removeOne(args);
        }
    }

    removeOne = function(obj)
    {  
        if (typeof(obj)=="object")
        {
            document.body.removeChild(obj);
        }
        else if (typeof(obj)=="string")
        {
            document.body.removeChild(document.getElementById(obj));
        }
    }
    
    //------------------------------------------------------------
    // loadFile needs an <input type=file onchange=loadFile ...>
    //
    // The input..file button can be created like this:
    //
    // make("INPUT;type=file;id=inputFile;onchange=loadFile;left....");
    //
    // Notice you need   onchange=loadFile
    //
    // Afterward, inputFile.contents  contains the contents of the file
    //------------------------------------------------------------
    
    loadFile = function ()
    {
        var target = this;
                
        var fr = new FileReader();

        fr.onloadend = function ()
        {
            target.contents = this.result;
        };
                
        fr.readAsBinaryString(this.files[0]);
    };
    
    //------------------------------------------------------------------
    // storage.saveAll(info) writes new values into localStorage.
    // 'info' must be a properly formatted stringified JSON object.
    // If preceded by localStorage.clear(),
    // then this replaces the current localStorage.
    // Without clear, this adds or modifies key:value pairs.
    // This is useful if localStorage has been stringified and
    // copied into a text file - then this restore can add/fix
    // values that have gone missing.
    //------------------------------------------------------------------
    
    var storage = new Object() ;
    
    storage.saveAll = function(info)
    {
        var allData = JSON.parse(info);
        for(k in allData)
        {
            var val = allData[k];
            localStorage.setItem(k,val);
        }        
    }
    
    storage.clear = function()
    {
        localStorage.clear();
    }
    
    storage.length = function()
    {
        return localStorage.length;
    }
    
    storage.save = function(key,value)
    {
        if (typeof(value)=="string" &&
            (
             value.charAt(0)=='{' && value.charAt(value.length-1)=='}'
             || value.charAt(0)=='[' && value.charAt(value.length-1)==']'
            )
           )
        {
            localStorage.setItem(key,value);
        }
        else
        {
            localStorage.setItem(key,JSON.stringify(value));
        }
    }
    
    // if a String starts/ends with {..} or [..]
    // it will not be "stringified" before storing.
    // This means that the RESTORE function
    // works properly when using String representations
    // of objects and arrays.  It would cause a problem
    // if a "normal" string starts and end this way
    // and contains funny characters, like \n .
    // Then these won't be stored properly.
    // But this way is should work for saving/restoring
    // objects and arrays, at least simple ones.
    //-------------------------------------------------------
    
    storage.load = function(key)
    {
        return JSON.parse(localStorage.getItem(key))
    }
    
    storage.loadAll = function()
    {
        return storageJSON.parse(localStorage)
    }
    
    //=====================================================
    // allToString and restoreFromString
    //  use "|" as a delimiter.
    // That means the character "|"
    //  cannot appear in the data.

    var storageDelimiter = "|";
    
    storage.allToString=function()
    {
        var v = "";

        for (var x in localStorage)
        {
           var item = storage.load(x);
           if (typeof(item)=="object") {
              item = JSON.stringify(item);
           }
           v = v + x + storageDelimiter + "\n" + item + storageDelimiter + "\n";
        }
        return v;
    }
    
    storage.allToArray=function()
    {
        var v = [] ;
        var p = 0;

        for (var x in localStorage)
        {
           var item = storage.load(x);
           v[p] = [ x , item ];
           p++;
        }
        return v;        
    }
    
    storage.restoreFromString = function(data)
    {
        if (data.substring(data.length-1,data.length)==storageDelimiter)
        {
            data=data+"\n"
        }
        var lines = data.split(storageDelimiter+"\n");
        for(var x=0; x<lines.length-1; x=x+2)
        {
            storage.save(lines[x],lines[x+1]);
        }    
    }
    
    storage.all = localStorage;
    
  //---------------------------------------------------------------------
  // Standard IBIO functions as described in the Pseudocode specification
  //
  //   input correctly return the correct type - either number or string
  //   output prints onto the HTML page, so several outputs can appear
  //   mod and div are written as functions rather than operators
  //   Students should be aware the the Pseudocode standard
  //    requires writing mod and div as operators, e.g.  100 div 7
  //
  // These implementations were created by Dave Mulkey, Germany, 2014
  //  to work in Javascript - these implementations are not "standard"
  //---------------------------------------------------------------------
    
    function output()
    {
       var a = 0
       var stuff = ""
       for(a=0; a < arguments.length; a++)
       {
          stuff = stuff + arguments[a] + " "
       }
       document.writeln(stuff+"<br>")
    }    
     
    function input(str)
    {
       var answer = prompt(str)
       if(answer!=null && answer.length > 0 && !isNaN(answer) )
       {
          return parseFloat(answer)      
       }
       else
       {
          return answer
       }
    }
    
    function div(a,b)
    {
        return Math.floor( a / b)
    }
    
    function mod(a,b)
    {
        return a % b;
    }
    
function Collection() {
  var values = new Array();
  var next = 0;
  
  this.getValue = function(n)
  {
    return values[n];
  }

  this.isEmpty = function()
  {
    if(values.length)
    {
       return (values.length < 1)
    }
    else
    {  return true }
  }        

  this.add = function(value) {
     var size = values.length
     values[size] = value;
  }

  this.addItem = function(value) {
     var size = values.length
     values[size] = value;
  }        

  this.resetNext = function()
  {
	next = 0
  }

  this.getNext = function()
  {
	var result = null
	if(this.hasNext())
	{
		result = values[next]
		next = next + 1
	}
	return result
  }

  this.hasNext = function()
  {
	if (next < values.length) {
		return true;
	}
	else {
		return false;
	}
  }

  this.showAll = function()
  {
	alert("There are " + values.length + " values in this collection")
	var saveNext = next;
	this.resetNext();
	while(this.hasNext())
	{
		alert(this.getNext())
	}
    next = saveNext;	
  }	

  this.contains = function(val)
  {
	var x = 0
	while(x < values.length)
	{
		if(values[x]==val)
		{
			return true
		}
		x++;
	}
	return false
  }

  this.remove = function(val)
  { 
	var found = -1
	var p = 0;
	while(p < values.length)
	{
		if(values[p]==val)
		{
			found = p
			break
		}
		p++
	}
	if(found>=0)
	{
		values.splice(found,1)
	}
  }

}

function Stack() {
  var values = new Array();
  var next = 0;

  this.isEmpty = function()
  {
    if(values.length)
    {
     return (values.length < 1)
    }
    else
    {  return true }
  }        

  this.push = function(val)
  {
	values.splice(0,0,val)	
  }

  this.pop = function()
  {
	var result = null
	if(values.length>0)
	{
		result = values[0]
		values.splice(0,1)
	}
	return result
  }

}

function Queue() {
  var values = new Array();
  var next = 0;

  this.isEmpty = function()
  {
    if(values.length)
    {
     return (values.length < 1)
    }
    else
    {  return true }
  }        

  this.enqueue = function(value)
  {
   var size = values.length
   values[size] = value;
  }

  this.dequeue = function()
  {
	var result = null
	if(values.length>0)
	{
		result = values[0]
		values.splice(0,1)
	}
	return result
  }
}