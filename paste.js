function paste(content)
{
    var field = document.activeElement;
    if (field.selectionStart || field.selectionStart == '0')
    {
        var startPos = field.selectionStart;
        var endPos = field.selectionEnd;
        field.value = field.value.substring(0, startPos)
            + content
            + field.value.substring(endPos, field.value.length);
    }
    else
    {
        field.value += content;
    }
}

paste(toPaste);
