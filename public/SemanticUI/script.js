function updateNumeroPlace(nb) {
    if (nb === "" ) {
        document.getElementById("option").innerHTML = ""
        return
    } 
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            let response = xhttp.responseText
            let l = response.split(':')
            let new_element = `<select name="numeroPlace" id="option" class="ui fluid dropdown">\n`
            for (let i = 1; i < l.length; i ++) {
                new_element += `<option value="${l[i].charAt(0)}">${l[i].charAt(0)}</option>\n`
            }
            new_element += `</select>\n`
            document.getElementById("option").outerHTML = new_element
        }
    }
    let idBillet = document.getElementById("hidden-input").value
    xhttp.open("GET", `/index/getplace/?num=${nb}&idBillet=${idBillet}`)
    xhttp.send()
}