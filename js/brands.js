const divBrands = document.querySelector("#brands")

function xhr_request(callback_functions = [], args = {}) {
    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let brend_xml = xhr.responseXML.querySelectorAll("brend")


            for (let callback of callback_functions) {
                brend_xml = callback(brend_xml, args)
            }

            display_results(divBrands, brend_xml)

        }

        if (xhr.readyState == 4 && xhr.status > 400) {
            ispis.innerHTML = `<h1>Error: ${xhr.status}</h1>
                            <p>Message: ${xhr.statusText}</p>
            `
        }
    }


    xhr.open("GET", "./../data/brands.xml")
    xhr.send()
}


function display_results(html_element, brend_xml) {
    html_element.innerHTML = ""
    for (let brend of brend_xml) {

        const link = brend.querySelector("link").textContent
        const slika = brend.querySelector("img").getAttribute("url")
        const naziv = brend.querySelector("naziv").textContent


        html_element.innerHTML += `
            <div class="brand-holder">
                <a href="${link}" >
                    <img data-brandname="${naziv}" class="brand-image" src="${slika}" />
                </a>
                <a data-brandname="${naziv}" class="brandname-link" href="${link}" >${naziv}</a>               
            </div>
        `
    }
}

function filter_by_category(brend_xml, args) {
    let filtered_brands = []

    for (let brend of brend_xml) {

        const category = brend.getAttribute("data-category")
        const split_category = category.split(",")

        for (let split of split_category) {
            if (args['category'] == split) {
                filtered_brands.push(brend)
            }
        }

    }

    return filtered_brands
}

window.onload = (e) => xhr_request()

function new_xhr_request(callback_function, args = {}) {
    const new_xhr = new XMLHttpRequest()

    new_xhr.onload = () => {
        if (new_xhr.readyState == 4 && new_xhr.status == 200) {
            let brands = new_xhr.responseXML.querySelectorAll("brend")

            let brand = callback_function(brands, args)

            display_single_brand(divBrands, brand)
        }
        if (new_xhr.readyState == 4 && new_xhr.status > 400) {
            ispis.innerHTML = `<h1>Error: ${new_xhr.status}</h1>
                            <p>Message: ${new_xhr.statusText}</p>
            `
        }
    }

    new_xhr.open("GET", "./../data/brands.xml")
    new_xhr.send()
}

function filter_by_brand(brands, args) {
    let single_brand = {}


    for (let brand of brands) {
        const naziv = brand.querySelector("naziv").textContent
        if (args["brandname"] == naziv) {
            single_brand = brand
        }
    }
    return single_brand
}

function display_single_brand(html_element, brand) {
    html_element.innerHTML = ""

    const naziv = brand.querySelector("naziv").textContent
    const slika = brand.querySelector("img").getAttribute("url")
    //const link = brand.querySelector("link").textContent

    html_element.innerHTML = `
        <div class="single-brand">
            <img src="${slika}" />
            <div>
                <h3>${naziv}</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. 
                Sed nisi. Nulla quis sem at nibh elementum imperdiet. 
                Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed 
                augue semper porta. Mauris massa. Vestibulum lacinia arcu 
                eget nulla. Class aptent taciti sociosqu ad litora torquent 
                per conubia nostra, per inceptos himenaeos. Curabitur sodales 
                ligula in libero. Sed dignissim lacinia nunc. </p>

                <p><i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. 
                Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque 
                sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin 
                ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, 
                suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia 
                aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, 
                euismod in, nibh. </p>
            </div>
        </div>
    `
}

document.body.onclick = (e) => {
    if (e.target.tagName == "A" && e.target.classList.contains("category-link")) {
        e.preventDefault()
        const category = e.target.getAttribute("data-category")
        xhr_request([filter_by_category], { "category": category })

    }

    if (e.target.tagName == "A" && (e.target.getAttribute("data-category") == "svi")) {
        xhr_request()
    }
    if (e.target.tagName == "A" && e.target.hasAttribute("data-brandname") ||
        (e.target.tagName == "IMG" && e.target.hasAttribute("data-brandname"))) {
        e.preventDefault()
        const brandname = e.target.getAttribute("data-brandname")
        new_xhr_request(filter_by_brand, { "brandname": brandname })
    }
}