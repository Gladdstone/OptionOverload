//-----------------------------------------------------------------------------
// GLOBAL VARIABLES
//-----------------------------------------------------------------------------

const questions = "assets/questions.json";

// I'm not pleased that these are global variables either, but unfortunately, I'm tremendously lazy
var ans = "1";
var obj;



/** 
 * This is the main setup function for the page, responsible for reqeusting and
 * parsing the JSON document containing all possible questions into a workable 
 * data structure form the server.
 * @param: none
 * @returns: void
*/
function setup() {
    jsonRequest();

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
function getNext(value) {
    // increment answer value
    ans = ans + value;
    
    // construct new article
    let article = document.createElement("article");

    // if obj contains another question, generate it, otherwise, generate the answer
    if(obj.hasOwnProperty("q" + ans)) {
        // increment obj to next question based on binary value
        obj = obj["q" + ans];

        // question text
        let text = document.createElement("span");
        text.innerText = obj.text;
        article.appendChild(text);

        // break
        let br = document.createElement("br");
        article.appendChild(br);

        // select w/ onchange
        let select = document.createElement("select");
        select.setAttribute("onchange", "getNext(this.value)");
        article.appendChild(select);

        // default select option
        let def = document.createElement("option");
        def.innerText = "Please select an option";
        select.appendChild(def);

        // dynamically generated select options
        let options = obj.options;
        for(var option in options) {
            if(options.hasOwnProperty(option)) {
                let opt = document.createElement("option");
                opt.setAttribute("value", option);
                opt.innerText = options[option];
                select.appendChild(opt);
            }
        }

        article.appendChild(select);
    } else {
        console.log(obj);

        // break
        let br = document.createElement("br");
        article.appendChild(br);

        // final answer and exit function
        let answer = document.createElement("span");
        answer.innerText = obj;
        article.appendChild(answer);
        return;
    }

    let br = document.createElement("br");
    document.getElementById("main").appendChild(br);
    document.getElementById("main").appendChild(article);
    
    // if there is a next question, increment to it, other wise, answer
    if(obj.hasOwnProperty("next")) {
        obj = obj.next;
    } else {
        obj = obj.answer;
    }
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
function jsonRequest() {
    let xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
        try {
            obj = (xmlhttp.readyState === 4 && xmlhttp.status === 200) ?
                JSON.parse(xmlhttp.responseText) : "XMLHTTP response error";
            // Create and append initial question text
            let text = document.createElement("span");
            text.innerText = obj.questions.q1.text;
            document.getElementById("initial").appendChild(text);

            let br = document.createElement("br");
            document.getElementById("initial").appendChild(br);

            // Create and append initial question options within select
            let select = document.createElement("select");
            select.setAttribute("onchange", "getNext(this.value);");

            // set default option
            let def = document.createElement("option");
            def.innerText = "Please select an option";
            select.appendChild(def);

            let options = obj.questions.q1.options;
            for(var option in options) {
                if(options.hasOwnProperty(option)) {
                    let opt = document.createElement("option");
                    opt.setAttribute("value", option);
                    opt.innerText = options[option];
                    select.appendChild(opt);
                }
            }
            document.getElementById("initial").appendChild(select);
            obj = obj.questions.q1.next;
        } catch(TypeError) {
            // this should prevent errors being thrown until the AJAX call completes
            // for my own peace of mind more than anything else
        }
    }

    xmlhttp.open("GET", questions, true);
    xmlhttp.send();
}

function setCookie(name, value) {
    document.cookie = name + "=" + value;
}