'use strict';

(function () {

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        // THE CODE INSIDE THIS BLOCK WILL BE EXECUTED FIRST AT ALL TIME!!
        // THINK OF IT AS main FUNCTION IN C OR JAVA

        var token;
        $(document).ready(function () {
            //This to inform the Authenticator to automatically close the authentication dialog once the authentication is complete.
            if (OfficeHelpers.Authenticator.isAuthDialog()) {
                window.close();
            }
            //If not logged in to amt, do log in
            if (Cookies.get('amtToken') === undefined) {
                amtLogin();
            }
            //If token is not existed, do authentication stuff
            if (Cookies.get('access_token') === undefined) {
                $('#errormessage').text("You are not authorized or your session has expired.");
                doAuthorize();
            } else {
                //Get token
                token = Cookies.get("access_token");
                //Do the MAGIC!!!
                loadItemProps(token);
            }
        });

        // END OF MAIN BLOCK CODE
    };

    //Pop-up the Authorization Window and do Authorization stuff
    function doAuthorize() {
        //Create new authenticator
        var authenticator = new OfficeHelpers.Authenticator();

        //Parameters for authenticator
        var client_id = '40f52d05-f5d8-4b29-9356-4248678802ba'; //Replace with another valid application id after register app with microsoft portal
        var configs = {
            redirectUrl: 'https://mroishii.github.io/amt-office/MessageRead.html',
            scope: 'https://graph.microsoft.com/mail.readwrite'
        };

        // register Microsoft (Azure AD 2.0 Converged auth) endpoint using parameters)
        authenticator.endpoints.registerMicrosoftAuth(client_id, configs);

        // Authentication for the default Microsoft endpoint
        authenticator
            .authenticate(OfficeHelpers.DefaultEndpoints.Microsoft)
            .then(function (token) { /* Microsoft Token */
                //console.log(token);
                $('#errormessage').text("Authorized");
                var inThirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
                Cookies.set('access_token', (String)(token.access_token), { expires: inThirtyMinutes });
                location.reload();
            })
            .catch(OfficeHelpers.Utilities.log);
    }

    //Get Current Item ID in REST formatted
    function getItemRestId() {
        var itemId;
        if (Office.context.mailbox.diagnostics.hostName === 'OutlookIOS') {
            // itemId is already REST-formatted
            itemId = Office.context.mailbox.item.itemId

        } else {
            // Convert to an item ID for API v2.0
            itemId = Office.context.mailbox.convertToRestId(
                Office.context.mailbox.item.itemId,
                Office.MailboxEnums.RestVersion.v2_0
            );
        }
        return itemId;
    }

    //Load and Show Mail Item Properties
    function loadItemProps(accessToken) {
        // Get the item's REST ID
        var itemId = getItemRestId();

        //---------DO NOT USE THIS-------------------------------------------------
        // Construct the REST URL to the current item
        // Details for formatting the URL can be found at 
        // https://docs.microsoft.com/previous-versions/office/office-365-api/api/version-2.0/mail-rest-operations#get-a-message-rest
        //var getMessageUrl = Office.context.mailbox.restUrl +
        //             '/v2.0/me/messages/' + itemId;
        //--------NOT WORKING--------------------------------------------------------

        //The URL use to get Mail Item
        var getMessageUrl = "https://graph.microsoft.com/v1.0/me/messages/" + itemId;
        //Call API to get Mail Item
        $.ajax({
            url: getMessageUrl,
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        }).done(function (item) {
            // Message is passed in `item`
            
            //-----------TRANSLATE WITH GOOGLE TRANSLATION--------------------------------------
            // // Translate and show Subject
            //translate(item.subject, "subject");
            // // Translate and show Mail body
            //translate(item.body.content, "body");
            
            //-----------TRANSLATE WITH AKAMINDS------------------------------------------------
            //Translate and show Subject
            amtTranslate(item.subject, "subject");
            
            //Parse the mail body
            parsedMailBody = parseHTML(item.body.content);
            //Traverse the parsed mail body and get text to translate
            traverse(parsedMailBody, "translate");
            console.log(textToTranslate);
            // Join all textToTranslate into 1 String with \n delimitter and send to amt api
            amtTranslate(textToTranslate.join(delimitter), "body");
            
        }).fail(function (error) {
            // Show error message then request authorization again
            $('#errormessage').text("You are not authorized or your session has expired.");
            console.log("Error", error.status);
            doAuthorize();
        });
    }

    //Call Translation API to get translated result
    // function translate(source, content) {
    //     //Google API Key. Replace this with another valid key.
    //     var GOOGLE_API_KEY = 'AIzaSyAYlBYQshvNVdRwBdCjXT6k8fqdxmoHnn0';

    //     $.ajax({
    //         url: 'https://translation.googleapis.com/language/translate/v2',
    //         type: "post",
    //         dataType: "json",
    //         data: {
    //             'q': source,
    //             'target': 'vi',
    //             'key': GOOGLE_API_KEY
    //         },
    //         success: function (json) {
    //             if (content === "subject") {
    //                 $("#subject").html(json.data.translations[0].translatedText);
    //             } else if (content === "body") {
    //                 $("#translated").html(json.data.translations[0].translatedText);
    //             }
    //         }
    //     });
    // }
    
})();