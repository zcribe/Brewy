document.addEventListener("click", function (event) {
    var eventId = event.target.id;

    if (eventId === "btn-tab1"){
        var tabs = document.querySelectorAll(".tab");
        tabs.forEach(function(item){item.style.display = "none"})
        tabs.forEach(function(item){item.classList.remove("active")})
        document.querySelector("#tab1").style.display = 'block';
        document.querySelector("#btn-tab1").classList.add("active")
        

    } else if(eventId === "btn-tab2"){
        var tabs = document.querySelectorAll(".tab");
        tabs.forEach(function(item){item.style.display = "none"})
        document.querySelector("#tab2").style.display = 'block';
    } else if(eventId === "btn-tab3"){
        var tabs = document.querySelectorAll(".tab");
        tabs.forEach(function(item){item.style.display = "none"})
        document.querySelector("#tab3").style.display = 'block';
    } else if(eventId === "btn-tab4"){
        var tabs = document.querySelectorAll(".tab");
        tabs.forEach(function(item){item.style.display = "none"})
        document.querySelector("#tab4").style.display = 'block';
    } else if(eventId === "btn-tab5"){
        var tabs = document.querySelectorAll(".tab");
        tabs.forEach(function(item){item.style.display = "none"})
        document.querySelector("#tab5").style.display = 'block';
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
