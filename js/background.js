function makeActiveTab(block, button){
    var tabs = document.querySelectorAll(".tab");
    var btnTabs = document.querySelectorAll(".btn-tab");
    tabs.forEach(function(item){item.style.display = "none"})
    btnTabs.forEach(function(item){item.classList.remove("active")})
    document.querySelector(block).style.display = 'block';
    document.querySelector(button).classList.add("active") 
}

document.addEventListener("click", function (event) {
    var eventId = event.target.id;

    if (eventId === "btn-tab1"){
        makeActiveTab("#tab1", "btn-tab1")
    } else if(eventId === "btn-tab2"){
        var tabs = document.querySelectorAll(".tab");
        var btnTabs = document.querySelectorAll(".btn-tab");
        tabs.forEach(function(item){item.style.display = "none"})
        btnTabs.forEach(function(item){item.classList.remove("active")})
        document.querySelector("#tab2").style.display = 'block';
        document.querySelector("#btn-tab2").classList.add("active")
    } else if(eventId === "btn-tab3"){
        var tabs = document.querySelectorAll(".tab");
        var btnTabs = document.querySelectorAll(".btn-tab");
        tabs.forEach(function(item){item.style.display = "none"})
        btnTabs.forEach(function(item){item.classList.remove("active")})
        document.querySelector("#tab3").style.display = 'block';
        document.querySelector("#btn-tab3").classList.add("active")
    } else if(eventId === "btn-tab4"){
        var tabs = document.querySelectorAll(".tab");
        var btnTabs = document.querySelectorAll(".btn-tab");
        tabs.forEach(function(item){item.style.display = "none"})
        btnTabs.forEach(function(item){item.classList.remove("active")})
        document.querySelector("#tab4").style.display = 'block';
        document.querySelector("#btn-tab4").classList.add("active")
    } else if(eventId === "btn-tab5"){
        var tabs = document.querySelectorAll(".tab");
        var btnTabs = document.querySelectorAll(".btn-tab");
        tabs.forEach(function(item){item.style.display = "none"})
        btnTabs.forEach(function(item){item.classList.remove("active")})
        document.querySelector("#tab5").style.display = 'block';
        document.querySelector("#btn-tab5").classList.add("active")
    }
}, false)

document.addEventListener("submit", function(event){
    var inpObj = event.target

    if(inpObj.checkValidity() && inpObj.id === "abv-form"){
        var og = document.querySelector("#abv-og").value
        var fg = document.querySelector("#abv-fg").value
        var abv = beerAlcoholContent(og, fg)
        document.querySelector("#abv-val").textContent = abv.toString() + "%"
        event.preventDefault();
    } else if (inpObj.checkValidity() && inpObj.id === "primer-form"){
        var batch = document.querySelector("#primer-batch").value
        var volumes = document.querySelector("#primer-volumes").value
        var temp = document.querySelector("#primer-temp").value
        var priming = beerPrimingCalculator(batch, volumes, temp)
        var sugars = convertSugars(priming)
        document.querySelector("#primer-body").textContent = ''
        Object.keys(sugars).map(function(objKey, index){
            var value = sugars[objKey]
            var containerElem = document.createElement("tr")
            var keyElem = document.createElement("td")
            keyElem.textContent = objKey.toString()
            var valueElem = document.createElement("td")
            valueElem.textContent = value.toString() + "g"
            containerElem.appendChild(keyElem)
            containerElem.appendChild(valueElem)
            document.querySelector("#primer-body").appendChild(containerElem)
        })
        event.preventDefault();
    } else if (inpObj.checkValidity() && inpObj.id === "aa-form"){
        var og = document.querySelector("#aa-og").value
        var fg = document.querySelector("#aa-fg").value
        var baa = beerApparentAttenuation(og, fg)
        document.querySelector("#aa-val").textContent = baa.toString()
        event.preventDefault();
    } else if (inpObj.checkValidity() && inpObj.id === "pr-form"){
        var originalGravity = document.querySelector("#pr-og").value
        var wortVolume = document.querySelector("#pr-wv").value
        var k = document.querySelector("#pr-k").value
        var bpr = beerPitchingRate(k, wortVolume, originalGravity)
        document.querySelector("#pr-val").textContent = bpr.toString() 
        event.preventDefault();
    } else {
        event.preventDefault();
    }
})


function gramsToOunces(grams) {
    grams = parseFloat(grams);
    if (isNaN(grams)) {
        return false
    }
    return 0.0352739619 * grams
}

function litersToGallons(liters) {
    liters = parseFloat(liters);
    if (isNaN(liters)) {
        return false
    }
    return 0.264172052 * liters
}

function rounddecimal(n, places) {
    if (n === null) {
        return false
    }
    if (n === '') {
        return false
    }
    if (isNaN(n)) {
        return false
    }
    if (places < 0) {
        return false
    }
    if (places > 10) {
        return false
    }
    var rounded = Math.round(n * Math.pow(10, places)) / Math.pow(10, places);
    var decimalPointPosition = (rounded + "").lastIndexOf(".");
    if (decimalPointPosition == 0) {
        rounded = "0" + rounded;
        decimalPointPosition = 1
    }
    if (places != 0) {
        decimalPointPosition = (rounded + "").lastIndexOf(".");
        if (decimalPointPosition == -1 || decimalPointPosition == rounded.length - 1) {
            rounded += "."
        }
    }
    decimalPointPosition = (rounded + "").lastIndexOf(".");
    var currentPlaces = ((rounded + "").length - 1) - decimalPointPosition;
    if (currentPlaces < places) {
        for (x = currentPlaces; x < places; x++) {
            rounded += "0"
        }
    }
    return rounded
}


function beerAlcoholContent(originalGravity, finalGravity){
    return rounddecimal((76.08 * (originalGravity - finalGravity) / (1.775 - originalGravity)) * (finalGravity / 0.794), 1)
}

function beerPrimingCalculator(temp, batchsize, volumes) {
    return rounddecimal(((volumes * 2) - (3.0378 - (0.050062 * temp) + (0.00026555 * temp * temp) * 2)) * 2 * batchsize, 1)
}

function convertSugars(sucrose){
    return {"Sucrose": rounddecimal(sucrose, 1), "Dextrose": rounddecimal(sucrose / 0.91, 1), "Brown sugar": rounddecimal(sucrose / 0.89,1) , "Honey": rounddecimal(sucrose / 0.74, 1)};
}

function beerApparentAttenuation(originalGravity, finalGravity){
    return (originalGravity - finalGravity) / originalGravity
}

function beerPitchingRate(k, wortVolume, originalGravity){
    return k * wortVolume * (originalGravity/4)
}
