//-----------------------------------------------------------------------------
// GLOBAL VARIABLES
//-----------------------------------------------------------------------------

const questions = "assets/questions.json";

var obj;



/** 
 * This is the main setup function for the page, responsible for reqeusting and
 * parsing the JSON document containing all possible questions into a workable 
 * data structure form the server.
 * @param: none
 * @returns: void
*/
function setup() {
    var counter = 1;

    jsonRequest(counter);

    var previous = cookieCheck("test");
    setCookie("test", "value");

    document.getElementById("welcome").innerText = (previous != "false") ? 
        "test" : "Welcome!";
}

function cookieCheck(cookie) {
    window.getCookie = (cookie) => {     
        var match = document.cookie.match(new RegExp(cookie + '=([^;]+)'));
        console.log("in cookie check: " + match);
        if(match) {
            return match[1];
        } else {
            return "false";
        }
    }
    return "false";
}

/**
 * If another question remains, generate and display new question elements,
 * otherwise, display answer
 * @param: counter current question number
 */
function getNext(counter) {
    
}

/**
 * Retrieve value of selected option
 * @param: obj changed select element
 * @returns: selected value as String
 */
function getSelect(obj) {
    var selection = obj.options[obj.selectedIndex].value;
    return selection;
}

/**
 * Retrieve JSON object from server
 */
function jsonRequest(counter) {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
        try {
            obj = (xmlhttp.readyState === 4 && xmlhttp.status === 200) ?
                JSON.parse(xmlhttp.responseText) : "XMLHTTP response error";
            
            // Create and append initial question text
            let text = document.createElement("span");
            text.innerText = obj.questions.question1.text;
            document.getElementById("initial").appendChild(text);

            let br = document.createElement("br");
            document.getElementById("initial").appendChild(br);

            // Create and append initial question options within select
            let select = document.createElement("select");
            // Increment question counter
            counter++;
            select.setAttribute("onchange", "getNext(" + counter + ")")
            let options = obj.questions.question1.options;
            for(var option in options) {
                if(options.hasOwnProperty(option)) {
                    let opt = document.createElement("option");
                    opt.setAttribute("value", option);
                    opt.innerText = options[option];
                    select.appendChild(opt);
                }
            }
            document.getElementById("initial").appendChild(select);
        } catch(TypeError) {
            // this should prevent errors being thrown until the AJAX call completes
        }
    }

    xmlhttp.open("GET", questions, true);
    xmlhttp.send();
}

function setCookie(name, value) {
    document.cookie = name + "=" + value;
}