var traverseIndex = 0;      //Index use in traverse replace mode
var textToTranslate = [];   //Contains all the text need to be translated
var parsedMailBody;         //Mail body json data after parsing from html

function parseHTML(html) {
    //Get html-parser handler's instance
    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
        if (error) {
            console.log('Parse Failed. error: ' + error);
        } else {
            console.log('Parse Completed');
        }
    }, { verbose: false, ignoreWhitespace: true }); //Ignore some useless stuff

    //Get html-parser instance, pass the handler
    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);

    //Parse the html content
    parser.parseComplete(html);

    //console.log(handler.dom);
    return handler.dom;
}
//Loop through entire json object
function traverse(node, mode) {
    //Loop through every node inside parent
    for (var i = 0; i < node.length; i++) {
        //Any node with 'data' properties...
        if (node[i].data !== undefined) {
            // translate mode
            if (mode == "translate") {
                // Escape the linebreak character before push
                var oldData = $.trim(node[i].data).replace(/(\r\n|\n|\r)/gm, "\\n");
                // Push text need to be translated to array
                textToTranslate.push(oldData);
            
            // replace mode
            } else if (mode == "replace") {
                // Replace with translated data
                node[i].data = translatedData[traverseIndex] + "<br>";
                //console.log('new:' + node[i].data);
                traverseIndex++;
            }  
        }
        //If node have children, traverse it too
        if (node[i].children !== undefined) {
            traverse(node[i].children, mode);
        }
    }
}
