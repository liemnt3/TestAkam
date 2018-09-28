var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";
var translatedData = [];    // Contains translated text data
var delimitter = "\\n";     // Use to split and join array

function amtLogin() {
    var user = 'trongtv_api';
    var password = 'Amt_api@2018##';
    var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
    $.ajax({
        url: loginUrl,
        type: 'post',
        headers: {'Content-Type': 'application/json'},
        data: '{"username":"'+ user +'","password":"'+ password +'"}'
    }).done(function(response) {
        //console.log("Logged in. Token: " + amtToken);
        Cookies.set('amtToken', response.token, { expires: inThirtyMinutes });
    }).fail(function(error) {
        console.log("Login failed. Reason: " + error.responseText);
    })
}

function amtTranslate(source, contentType) {
    var amtToken;

    if (Cookies.get('amtToken') !== undefined) {
        amtToken = Cookies.get('amtToken');
    } else {
        amtLogin();
        amtToken = Cookies.get('amtToken');
    }
    
    $.ajax({
        url: translateUrl,
        type: 'post',
        headers: {'content-type': 'application/json',
                  'authorization': 'Bearer ' + amtToken,
                  'token-type': 'AMT'},
        data: '{"jpn":"'+ source +'"}',
    }).done(function(data) {
        if (contentType == "subject") {
            // If subject, display to #subject div
            $("#subject").html("<b>" + data + "</b>");
        } else if (contentType == "body") {
            // If body, pass the translated string to callback function
            translateCallback(data);
        }
    }).fail(function(error) {
        console.log("Translate failed. Reason: " + error.responseText);
    })
}

function translateCallback (data) {
    // Replace new line character with \n
    var dataToSplit = data.replace(/(\r\n|\n|\r)/gm, "\\n");
    // Use \n delimitter to split string to translatedData array
    translatedData = dataToSplit.split(delimitter);
    //console.log(translatedData);
    
    //Traverse and replace text data in mail body with translated one
    traverse(parsedMailBody, "replace");

    //Re-parse html data to html and set the html of #translated div
    var translatedHtml = html(parsedMailBody);
    $('#translated').html(translatedHtml);
}