let puppet = require("puppeteer");




function calcLinks(linkNumber, io) {
    
    let link = "https://www.geeksforgeeks.org/category/data-structures/c-arrays/page/" + linkNumber + "/";
    var pageLinks = [];


    (async () => {
        const browser = await puppet.launch();
        var page = await browser.newPage();
        await page.goto(link, { waitUntil: "domcontentloaded" })

        pageLinks = await page.$$eval(".head a", (nodes) => nodes.map((el) => el.href))
        await page.close();


        io.emit("printPageLinks", {pageLinks: pageLinks})

        for (let mylink of pageLinks) {
            
            io.emit("current_checking", {link: mylink})

            page = await browser.newPage();
            await page.setRequestInterception(true)
            page.on('request', (request) => {
                if (request.resourceType == 'stylesheet' || request.resourceType == 'script') {
                    request.abort()
                } else {
                    request.continue()
                }
            })
            await page.goto(mylink, { waitUntil: "domcontentloaded", timeout: "10000000" });

            let keywords = await page.$$eval(".responsive-tabs__list__item", (nodes) => nodes.map((res) => res.innerHTML))
            

            if(keywords.includes("C++") && (!keywords.includes("Javascript")) 
                || keywords.includes("PHP") && (!keywords.includes("Javascript")))
            {
                io.emit("printlink", {link: mylink})
            }else{
                io.emit("js_already_added", {link: mylink})
            }
            page.close()
        }


    })().then(() => {
            console.log("One page's links displayed")
    }).catch((err)=>{
        console.log(err)
    })
}


async function runLoop(from, to, io){
    for(let i = from; i <= to; i++){
        await calcLinks(i, io);
    }
}

module.exports = runLoop;
