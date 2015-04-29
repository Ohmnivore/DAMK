var base = 0;
var faces = [];
getFaces();

function getFaces(callback)
{
    chrome.storage.sync.get(null, function (obj) {
        console.log("Data: " + JSON.stringify(obj.faces));
        console.log(obj.faces);
        if (obj.faces === undefined)
        {
            faces = [
                "( ͡° ͜ʖ ͡°)", "( ͠° ͟ʖ ͡°)", "ᕦ( ͡° ͜ʖ ͡°)ᕤ", "( ͡~ ͜ʖ ͡°)",
                "( ͡o ͜ʖ ͡o)", "° ͜ʖ ͡-", "( ͡͡° ͜ʖ ͡°)﻿", "( ͡°° ʖ ͡°°)",
                "(ง ͠° ͟ل͜ ͡°)ง", "( ͡° ͜ʖ ͡°)", "(ʖ ͜° ͜ʖ)", "[ ͡° ͜ʖ ͡°]",
                "ヽ༼ຈل͜ຈ༽ﾉ", "( ͡o ͜ʖ ͡o)", "{ ͡• ͜ʖ ͡•}", "( ͡° ͜V ͡°)",
                "( ͡^ ͜ʖ ͡^)", "( ‾ʖ̫‾)", "( ͡°╭͜ʖ╮͡° )", "ᕦ( ͡°╭͜ʖ╮͡° )ᕤ"
                ];
            chrome.storage.sync.set({"faces": JSON.stringify(faces)});
        }
        else
        {
            faces = JSON.parse(obj.faces);
        }
        makeContext();
    });
}

function copyToClip(Content)
{
    var input = document.createElement('textarea');
    document.body.appendChild(input);
    input.value = Content;
    input.focus();
    input.select();
    document.execCommand('Copy');
    input.remove();
    chrome.tabs.executeScript(null, {code: "var toPaste = '" + Content + "';"}, function(){
        chrome.tabs.executeScript(null, {file: "paste.js"}
    )});
}

function genericOnClick(info, content)
{
    copyToClip(faces[info.menuItemId - base]);
}

function makeContext()
{
    for (var i = 0; i < faces.length; i++)
    {
        var face = faces[i];
        var id = chrome.contextMenus.create({"title": face, "contexts":["editable"],
            "onclick": function (info, tab) {
                genericOnClick(info, face);
            }});
        if (i == 0)
            base = id;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse)
{
    if (request.id === "LoadFaces")
    {
        chrome.contextMenus.removeAll(getFaces);
    }
});
