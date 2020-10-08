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

document.querySelector("#beerAlcoholForm").addEventListener("submit", function(event){
    if(!isValid){
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
    // https://www.brewersfriend.com/2011/06/16/alcohol-by-volume-calculator-updated/
    return (76.08 * (originalGravity - finalGravity) / (1.775 - originalGravity)) * (finalGravity / 0.794)
}

function beerAlcoholContentSecondary() {
    var ogInSg = og;
    var fgInSg = fg;
    var ogInPlato = og;
    var fgInPlato = fg;
    if (gravityunit == "plato") {
        ogInSg = convertPlatoToGravity(og);
        fgInSg = convertPlatoToGravity(fg)
    }
    if (gravityunit == "sg") {
        ogInPlato = convertGravityToPlato(og, 10);
        fgInPlato = convertGravityToPlato(fg, 10)
    }
    if (equation == 'basic') {
        var abv_basic = (ogInSg - fgInSg) * 131.25;
        divABV.innerHTML = rounddecimal(abv_basic, 2) + "%"
    } else {
        var abw = 76.08 * (ogInSg - fgInSg) / (1.775 - ogInSg);
        var abv = abw * (fgInSg / 0.794);
        divABV.innerHTML = rounddecimal(abv, 2) + "%"
    }
    if (ogInPlato == 0) {
        ogInPlato = 0.0001
    }
    var attenuation = (1 - (fgInPlato / ogInPlato)) * 100;
    var calories = computeCaloriesPer12oz(ogInPlato, fgInPlato);
    divOG.innerHTML = rounddecimal(ogInPlato, 2) + " &deg;P, " + rounddecimal(ogInSg, 3);
    divFG.innerHTML = rounddecimal(fgInPlato, 2) + " &deg;P, " + rounddecimal(fgInSg, 3);
    divAttenuation.innerHTML = rounddecimal(attenuation, 0) + "%";
    divCalories.innerHTML = rounddecimal(calories, 1) + " per 12oz bottle"
}


function beerIBU() {
    var hop_util = $('#txthop_utilization_factor').val() ? $('#txthop_utilization_factor').val() / 100 : 1;
    if (volumeunit == "Liters") {
        batchsize = litersToGallons(batchsize);
        boilsize = litersToGallons(boilsize);
        oz[0] = gramsToOunces(oz[0]);
        oz[1] = gramsToOunces(oz[1]);
        oz[2] = gramsToOunces(oz[2]);
        oz[3] = gramsToOunces(oz[3]);
        oz[4] = gramsToOunces(oz[4]);
        oz[5] = gramsToOunces(oz[5])
    }
    boilgravity = (batchsize / boilsize) * (originalgravity - 1);
    divboilgravity.innerHTML = rounddecimal(boilgravity + 1, 3);
    totalIBU = 0;
    for (i = 0; i < 6; i++) {
        var IBU = 0;
        var util = 0;
        var bfactor = 1.65 * Math.pow(0.000125, boilgravity);
        var tfactor = (1 - Math.pow(e_constant, (-0.04 * time[i]))) / 4.15;
        util = bfactor * tfactor;
        if (hoptype[i] == 'pellet') {
            util = util * 1.1
        }
        if (hop_util) {
            util *= hop_util
        }
        IBU = util * (((aa[i] / 100) * oz[i] * 7490) / batchsize);
        divutil[i].innerHTML = rounddecimal(util, 4);
        divIBU[i].innerHTML = rounddecimal(IBU, 2);
        totalIBU = totalIBU + IBU
    }
    divtotalIBU.innerHTML = rounddecimal(totalIBU, 2)
}

function beerGrainColor(){
    // http://brewwiki.com/index.php/Estimating_Color
}

function beerBottlingBottleCount(){
    // https://www.brewersfriend.com/bottling-calculator/
}

function beerPrimingCalculator(){
    // https://www.brewersfriend.com/bottling-calculator/
}

function beerApparentAttenuation(originalGravity, finalGravity){
    return (originalGravity - finalGravity) / originalGravity
}

function beerPitchingRate(k, wortVolume, originalGravity){
    return k * wortVolume * (originalGravity/4)
}

function beerQuickInfusion() {
    var infusiontemp = maxinfusiontemp;
    var infusionstring = volumeunit + ' @ boiling';
    var totalvolume = mashratio * grainweight;
    if (targettemp < currenttemp) {
        infusiontemp = 50;
        if (tempunit == "C") {
            infusiontemp = 10
        }
    }
    if ((tempunit == 'C' && infusiontemp != 100) || (tempunit == 'F' && infusiontemp != 212)) {
        infusionstring = volumeunit + ' @ ' + infusiontemp + ' (' + tempunit + ')'
    }
    var addboiling = ((targettemp - currenttemp) * ((MASH_EQUATION_CONSTANT * grainweight) + totalvolume)) / (infusiontemp - targettemp);
    divinfuse.innerHTML = rounddecimal(addboiling, 1) + " " + infusionstring
}

function beerPrimingCalculator() {
    // https://www.brewersfriend.com/beer-priming-calculator/
    // Carbonation Guidelines by Style
    // British Style Ales 	1.5 - 2.0 volumes
    // Belgian Ales 	1.9 - 2.4 volumes
    // American Ales and Lager 	2.2 - 2.7 volumes
    // Fruit Lambic 	3.0 - 4.5 volumes
    // Porter, Stout 	1.7 - 2.3 volumes
    // European Lagers 	2.2 - 2.7 volumes
    // Lambic 	2.4 - 2.8 volumes
    // German Wheat Beer 	3.3 - 4.5 volumes

    if (tempunit == "C") {
        temp = celsiusToFahrenheit(temp)
    } else {
        batchsize = gallonsToLiters(batchsize)
    }
    var beerCO2 = 3.0378 - (0.050062 * temp) + (0.00026555 * temp * temp);
    var sucrose = ((volumes * 2) - (beerCO2 * 2)) * 2 * batchsize;
    var dextrose = sucrose / 0.91;
    var dme = sucrose / 0.68;
    var DMELaaglander = sucrose / 0.5;
    var turbinado = sucrose;
    var demarara = sucrose;
    var cornsyrup = sucrose / 0.69;
    var BrownSugar = sucrose / 0.89;
    var Molasses = sucrose / 0.71;
    var MapleSyrup = sucrose / 0.77;
    var SorghumSyrup = sucrose / 0.69;
    var Honey = sucrose / 0.74;
    var BelgianCandySyrup = sucrose / 0.63;
    var BelgianCandySugar = sucrose / 0.75;
    var InvertSugar = sucrose / 0.91;
    var BlackTreacle = sucrose / 0.87;
    var RiceSolids = sucrose / 0.79;
    var weight_unit = "g";
    if (tempunit == "F") {
        sucrose = gramsToOunces(sucrose);
        dextrose = gramsToOunces(dextrose);
        dme = gramsToOunces(dme);
        DMELaaglander = gramsToOunces(DMELaaglander);
        turbinado = gramsToOunces(turbinado);
        demarara = gramsToOunces(demarara);
        cornsyrup = gramsToOunces(cornsyrup);
        BrownSugar = gramsToOunces(BrownSugar);
        Molasses = gramsToOunces(Molasses);
        MapleSyrup = gramsToOunces(MapleSyrup);
        SorghumSyrup = gramsToOunces(SorghumSyrup);
        Honey = gramsToOunces(Honey);
        BelgianCandySyrup = gramsToOunces(BelgianCandySyrup);
        BelgianCandySugar = gramsToOunces(BelgianCandySugar);
        InvertSugar = gramsToOunces(InvertSugar);
        BlackTreacle = gramsToOunces(BlackTreacle);
        RiceSolids = gramsToOunces(RiceSolids);
        weight_unit = "oz."
    }
    divResults.innerHTML = "Table Sugar: " + rounddecimal(sucrose, 1) + " " + weight_unit + "<br/>" + "Corn Sugar: " + rounddecimal(dextrose, 1) + " " + weight_unit + "<br/>" + "DME - All Varieties: " + rounddecimal(dme, 1) + " " + weight_unit + "<br>" + "Belgian Candy Syrup: " + rounddecimal(BelgianCandySyrup, 1) + " " + weight_unit + "<br/>" + "Belgian Candy Sugar: " + rounddecimal(BelgianCandySugar, 1) + " " + weight_unit + "<br/>" + "Black Treacle: " + rounddecimal(BlackTreacle, 1) + " " + weight_unit + "<br/>" + "Brown Sugar: " + rounddecimal(BrownSugar, 1) + " " + weight_unit + "<br/>" + "Corn Syrup: " + rounddecimal(cornsyrup, 1) + " " + weight_unit + "<br/>" + "Demarara: " + rounddecimal(demarara, 1) + " " + weight_unit + "<br/>" + "DME - Laaglander: " + rounddecimal(DMELaaglander, 1) + " " + weight_unit + "<br/>" + "Honey: " + rounddecimal(Honey, 1) + " " + weight_unit + "<br/>" + "Invert Sugar Syrup: " + rounddecimal(InvertSugar, 1) + " " + weight_unit + "<br/>" + "Maple Syrup: " + rounddecimal(MapleSyrup, 1) + " " + weight_unit + "<br/>" + "Molasses: " + rounddecimal(Molasses, 1) + " " + weight_unit + "<br/>" + "Rice Solids: " + rounddecimal(RiceSolids, 1) + " " + weight_unit + "<br/>" + "Sorghum Syrup: " + rounddecimal(SorghumSyrup, 1) + " " + weight_unit + "<br/>" + "Turbinado: " + rounddecimal(turbinado, 1) + " " + weight_unit + "<br/>";
    divBeerCO2.innerHTML = rounddecimal(beerCO2, 2) + " volumes"
}