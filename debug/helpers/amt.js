var loginUrl = 'https://amtapi.akaminds.co.jp/login';
var translateUrl = "https://amtapi.akaminds.co.jp/api/translate/sentence";

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
    }
    
    var trav = function (node) {
        for (var i = 0; i < node.length; i++) {
            //Any node with text data will be translate
            var currentNode = node[i];
            if (currentNode.data !== undefined) {
                var oldData = $.trim(currentNode.data).replace(/(\r\n|\n|\r)/gm, "\\n");
                console.log('old:' + oldData);
                $.ajax({
                    url: translateUrl,
                    type: 'post',
                    headers: {'content-type': 'application/json',
                              'authorization': 'Bearer ' + amtToken,
                              'token-type': 'AMT'},
                    data: '{"jpn":"'+ source +'"}',
                }).done(function(data) {
                    currentNode.data = data;
                }).fail(function(error) {
                    console.log("Translate failed. Reason: " + error.responseText);
                })
                console.log('new' + currentNode.data);  
            }
            
            //If node have children, traverse it too
            if (currentNode.children !== undefined) {
                trav(currentNode.children);
            }
        }
    }

    if (contentType === "subject") {
        $.ajax({
            url: translateUrl,
            type: 'post',
            headers: {'content-type': 'application/json',
                      'authorization': 'Bearer ' + amtToken,
                      'token-type': 'AMT'},
            data: '{"jpn":"'+ source +'"}',
        }).done(function(data) {
            $("#subject").html("<b>" + data + "</b>");
        }).fail(function(error) {
            console.log("Translate failed. Reason: " + error.responseText);
        })
    } else if (contentType === "body") {
        trav(source);
    }
}