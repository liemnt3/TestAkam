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

    console.log(handler.dom);
    return handler.dom;
}

//Loop through entire json object, do the action stuff
// function traverse(node) {
//     //Loop through every node inside parent
//     for (var i = 0; i < node.length; i++) {
//         //Any node with text data will be translate
//         var currentNode = node[i];
//         if (currentNode.data !== undefined) {
//             var oldData = $.trim(currentNode.data).replace(/(\r\n|\n|\r)/gm, "\\n");
//             var callback = function (data) {
//                 this.currentNode.data = data;
//             };
            
//             console.log('old:' + oldData);
//             amtTranslate(oldData, "body", callback, currentNode);
//             console.log('new' + currentNode.data);
            
//         }
        
//         //If node have children, traverse it too
//         if (currentNode.children !== undefined) {
//             traverse(currentNode.children);
//         }
//     }
// }
