function convertJsonToYag() {
    const inputField = document.getElementById("inputTextArea");
    const outputField = document.getElementById("outputTextArea");
    const embedName = document.getElementById("nameInputArea");

    outputField.value = convert(inputField.value, embedName.value)
}

function convert(s, name) {
    try {
        var json = JSON.parse(s);
    } catch (error) {
        if (error instanceof SyntaxError) {
            alert("There was a syntax error. Please correct it and try again: " + error.message);
        } else {
            throw error;
        }
    }
    var output;

    if (name === null || name.length === 0) output = "{{ $embed := cembed\n";
    else output = "{{ $" + name + " := cembed\n";


    if (json.hasOwnProperty('title')) output += "\t\"title\" \"" + escape(json['title']) + "\"\n";
    if (json.hasOwnProperty('description')) output += "\t\"description\" \"" + escape(json['description']) + "\"\n";
    if (json.hasOwnProperty('url')) output += "\t\"url\" \"" + json['url'] + "\"\n";
    if (json.hasOwnProperty('color')) output += "\t\"color\" " + json['color'] + "\n";
    if (json.hasOwnProperty('timestamp')) output += "\t\"url\" \"" + json['timestamp'] + "\"\n";

    if (json.hasOwnProperty('author')) {
        var authorOut = "\t\"author\" (sdict ";
        const val = json['author'];
        Object.keys(val).forEach(function (k) {
            if (k === "name") authorOut += "\"" + k + "\" \"" + escape(val[k]) + "\" ";
            else if (k === "icon_url" || k === "url") authorOut += "\"" + k + "\" \"" + val[k] + "\" ";
        });
        if (val.hasOwnProperty('name')) output += authorOut + ")\n"
    }

    if (json.hasOwnProperty('thumbnail')) {
        var thumbOut = "\t\"thumbnail\" (sdict ";
        const val = json['thumbnail'];
        Object.keys(val).forEach(function (k) {
            if (k === "url") thumbOut += "\"" + k + "\" \"" + val[k] + "\" ";
        });
        output += thumbOut + ")\n"
    }

    if (json.hasOwnProperty('footer')) {
        var footerOut = "\t\"footer\" (sdict ";
        const val = json['footer'];
        Object.keys(val).forEach(function (k) {
            if (k === "text") footerOut += "\"" + k + "\" \"" + escape(val[k]) + "\" ";
            else if (k === "icon_url") footerOut += "\"" + k + "\" \"" + val[k] + "\" "
        });
        if (val.hasOwnProperty('text')) output += footerOut + ")\n"
    }

    if (json.hasOwnProperty('image')) {
        var imageOut = "\t\"image\" (sdict ";
        const val = json['image'];
        Object.keys(val).forEach(function (k) {
            if (k === "url") imageOut += "\"" + k + "\" \"" + val[k] + "\" "
        });
        output += imageOut + ")\n"
    }

    if (json.hasOwnProperty('fields')) {
        var fieldsOut = "\t\"fields\" (cslice \n";
        const val = json['fields'];
        Object.keys(val).forEach(function (k) {
            if (val[k].hasOwnProperty('name') && val[k].hasOwnProperty('value') && val[k].hasOwnProperty('inline')) {
                fieldsOut += "\t\t(sdict ";
                const key = val[k];
                Object.keys(key).forEach(function (c) {
                    if (c === "name" || c === "value") fieldsOut += "\"" + c + "\" \"" + escape(key[c]) + "\" ";
                    else if (c === "inline") fieldsOut += "\"" + c + "\" " + key[c] + " ";
                });
                fieldsOut += ")\n"
            }
        });
        output += fieldsOut + ")\n"
    }

    output += "}}"

    return output;
}

function escape(s) {
    s = s.replaceAll("\"", "\\\"");
    s = s.replaceAll("\n", "\\n");
    return s;
}


