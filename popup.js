var faces = [];
getFaces(patchAddForm);

function getFaces(callback)
{
    chrome.storage.sync.get(null, function (obj)
    {
        faces = JSON.parse(obj.faces);
        displayFaces();
        callback();
    });
}

function patchAddForm()
{
    var inpText = document.getElementById("newtext");
    var submitBtn = document.getElementById("submit");
    submitBtn.onclick = function () {
        addFace(inpText.value);
        inpText.value = "";
    };
    inpText.addEventListener("keydown", function(e) {
        if (!e) { var e = window.event; }

        // Enter is pressed
        if (e.keyCode == 13) { addFace(inpText.value); inpText.value = ""; }
    }, false);
}

function copyToClip(content, btn)
{
    var input = document.createElement("textarea");
    btn.appendChild(input);
    input.value = content;
    input.focus();
    input.select();
    document.execCommand("copy");
    input.remove();
    chrome.tabs.executeScript(null, {code: "var toPaste = '" + content + "';"}, function(){
        chrome.tabs.executeScript(null, {file: "paste.js"}
    )});
}

function addFace(face)
{
    if (face.length > 0)
    {
        faces.unshift(face);
        displayFaces();
        saveFaces();
    }
}
function removeFace(index)
{
    faces.splice(index, 1);
    displayFaces();
    saveFaces();
}
function saveFaces()
{
    chrome.storage.sync.set({"faces": JSON.stringify(faces)}, function() {
        // console.log("Settings saved");
    });
    chrome.runtime.sendMessage({id: "LoadFaces"});
}

function displayFaces()
{
    var table = document.getElementById("table");
    table.innerHTML = "";

    for (var i=0; i < faces.length; i++)
    {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        tr.appendChild(td1);
        var btn = (function wrap (i) {return createButton("copybutton", td1, faces[i], function ()
            {
                copyToClip(faces[i], this);
            });})(i);
        btn.appendChild(document.createTextNode(faces[i]));

        var td2 = document.createElement("td");
        tr.appendChild(td2);
        td2.class = "deletebutton";
        var dlBtn = (function wrap (i) {return createButton("deletebutton", td2, "X", function ()
            {
                removeFace(i);
            });})(i);

        var d = document.createElement("span");
        d.className = "typcn typcn-times-outline";
        dlBtn.appendChild(d);

        table.appendChild(tr);
    }
}

function createButton(className, context, value, func)
{
    var button = document.createElement("button");
    button.className = className;
    button.onclick = func;
    context.appendChild(button);
    return button;
}
