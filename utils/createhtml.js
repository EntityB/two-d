const { readdirSync, writeFile } = require('fs')
const { join, resolve } = require('path')

console.log("\n\nCreating index.html file ...")

const isJsFile = file => file.endsWith(".js")

let listOfExamples = readdirSync('docs').filter(isJsFile).map(example => `<li><a href="#${example}">${example}</a></li>`)

const fileContent =
    `<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Examples preview</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <ul>
        ${listOfExamples.join("\n")}
    </ul>
    <script type="text/javascript">
        function runPreview() {
            if(window.location.hash) {
                document.body.innerHTML = "";
                var s = document.createElement("script");
                s.type = "text/javascript";
                s.src = window.location.hash.substring(1);
                document.head.append(s);
            }
        }
        window.addEventListener("hashchange", runPreview, false);
        runPreview()
    </script>
</body>

</html>`

writeFile(resolve(__dirname, join('..', 'docs', 'index.html')), fileContent, (err) => {
    if (err) throw err

    console.log("index.html was created")
})