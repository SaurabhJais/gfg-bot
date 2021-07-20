let puppet = require("puppeteer");




function calcLinks(linkNumber, io) {

    // let link = "https://www.geeksforgeeks.org/category/data-structures/c-arrays/page/" + linkNumber + "/";
     let link = "https://www.geeksforgeeks.org/tag/xor/page/" + linkNumber + "/"
    // let link = "https://www.geeksforgeeks.org/category/algorithm/bit-magic/page/" + linkNumber + "/"
    // let link = "https://www.geeksforgeeks.org/category/algorithm/mathematical/page/" + linkNumber
    // let link = "https://www.geeksforgeeks.org/page/" + linkNumber
    var pageLinks = [];


    (async () => {
        const browser = await puppet.launch();
        var page = await browser.newPage();
        await page.goto(link, { waitUntil: "domcontentloaded", timeout: 100000000 })

        pageLinks = await page.$$eval(".head a", (nodes) => nodes.map((el) => el.href))
        await page.close();


        io.emit("printPageLinks", { pageLinks: pageLinks })

        for (let mylink of pageLinks) {

            io.emit("current_checking", { link: mylink })

            page = await browser.newPage();
            await page.setRequestInterception(true)
            page.on('request', (request) => {
                if (request.resourceType == 'stylesheet' || request.resourceType == 'script') {
                    request.abort()
                } else {
                    request.continue()
                }
            })
            await page.goto(mylink, { waitUntil: "domcontentloaded", timeout: 10000000 });

            let keywords = await page.$$eval(".responsive-tabs__list__item", (nodes) => nodes.map((res) => res.innerHTML))


            if (
                (keywords.includes("C++") ||
                    keywords.includes("CPP") ||
                    keywords.includes("C/C++"))
                &&
                (
                    (!keywords.includes("Javascript")) ||
                    (!keywords.includes("Python3")) ||
                    (!keywords.includes("Java"))
                    )
            ) {
                io.emit("printlink", { link: mylink })
            } else {
                io.emit("js_already_added", { link: mylink })
            }
            page.close()
        }


    })().then(() => {
        console.log("One page's links displayed")
    }).catch((err) => {
        console.log(err)
    })
}


async function runLoop(from, to, io) {
    for (let i = from; i <= to; i++) {
        await calcLinks(i, io);
    }
}

module.exports = runLoop;






/*
let loginData = {isLoggedIn : true};



var loginImproveId, loginFeedbackId, authUrl = gfgObject.authUrl,
    writeUrl = gfgObject.writeUrl,
    writeApiUrl = gfgObject.writeApiUrl,
    utilUrl = (authUrl = gfgObject.authUrl, gfgObject.utilUrl),
    apiUrl = gfgObject.apiUrl;


function himproveArticleCall() {
    if (loginData && loginData.isLoggedIn) jQuery.ajax({
        url: writeApiUrl + "create-improvement-post/",
        type: "POST",
        dataType: "text",
        xhrFields: {
            withCredentials: !0
        },
        data: {
            action: "create_improve_post",
            gfg_id: post_id
        },
        success: function(e) {
            jQuery("#improve").hide(), '"picked_ten"' == e.trim() ? window.alert("You have already picked 10 articles, please complete them before picking another") : "false" == e ? window.alert("Currently, this article is being improved by another user, we will notify you through email once this article is available to improve.") : window.open(writeUrl + "improve-post/" + e + "/", "_blank")
        },
        async: !1
    });
}
*/