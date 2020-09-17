var urlParams = new URLSearchParams(location.search.substring(1));
const url = location.origin + location.pathname + "?";

var page = urlParams.get("page");
if(!page) {
    page = "home"
}

// Call loadPage("page_name") to change content
window.onload = loadPage(page, true);



async function loadPage(page, forceReload) {
    // Checking whether page should be force-reloaded
    if(!forceReload && urlParams.get("page") == page) {
        return;
    }
    // Setting URL params
    urlParams.set("page", page);
    history.replaceState(null, page, url + decodeURIComponent(urlParams));

    if(document.querySelector(`script[src="./${page}.js"]`)) {
        // Script is already loaded, no need to append it twice
        console.log("loaded");
        loadContent(page);
        return;
    }

    // Getting page as script (which is allowed to be imported even from file storage)
    let script  = document.createElement("script");
    script.type = "text/javascript";
    script.src = `./${page}.js`;

    // Appending script to body
    document.body.appendChild(script);

    script.onerror = () => {
        this.onerror = null;
        document.getElementById("content").innerHTML = e404;
        document.body.removeChild(script);
    }

    // Content is defined after script is ready
    // Lambda is required!
    script.onload = () => {
        loadContent(page);
    }
}

function loadContent(page) {
        try{
            document.getElementById("content").innerHTML = eval(page);
            eval(`init_${page}()`);
    } catch(err) {
        // Content is not defined
        document.getElementById("content").innerHTML = e404;
        init_e404();
        // Removing content element
        document.body.removeChild(document.querySelector(`script[src="./pages/${page}.js"`));
    }
}
