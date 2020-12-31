var xmlString = "<people>"; 
var textArr = [];
var openFamily = false; 

const Main = {
    
    init:function() {
        var confirmButton = document.getElementById('confirm'); 
        confirmButton.addEventListener('click', Main.readInput); 
    }, 

    readInput:function () {
        var file = document.getElementById("files").files[0];
        var reader = new FileReader(); 
            reader.addEventListener('load', function (e) {
                var text = e.target.result; 
                var startSlice = 0; 
            
                for (let i = 0; i < text.length; i++) {
                    if (text[i] == "\n") {
                        var currentString = text.slice(startSlice, i); 
                        startSlice = i + 1;
                        textArr.push(currentString);
                    }
                }
                Main.handlePeopleArray(); 
            });
            reader.readAsText(file); 
    },

    handlePeopleArray:function () {

        for (let i = 0; i < textArr.length; i++) {
            var currentIndex = textArr[i];

            if (currentIndex.includes("P|")) {
                Main.createPerson(currentIndex); 
            } 

            else if (currentIndex.includes("T|")) {
                Main.createTelephone(currentIndex); 
                Main.checkNextIndex(i);
            }

            else if (currentIndex.includes("A|")) {
                Main.createAddress(currentIndex);
                Main.checkNextIndex(i);
            }

            else if (currentIndex.includes("F|")) {
                openFamily = true;
                Main.createFamily(currentIndex);
                Main.checkNextIndex(i);
            }

            else {
                console.log('error no match found, malformed input'); 
                console.log(textArr[i]);
            }
        }
        xmlString += "</person></people>";

        var XMLFile = document.createElement("a"); 
            XMLFile.setAttribute("href", "data:text/xml;charset=utf-8," + encodeURIComponent(xmlString)); 
            XMLFile.setAttribute("download", "output.xml"); 
            XMLFile.click(); 
    },

    createPerson:function (person) {
        person = person.substring(2, person.length); 
        var nameIndex = person.indexOf("|"); 
            if (nameIndex != -1) {
                var firstName = person.substring(0, nameIndex);  
                var lastName = person.substring(nameIndex + 1, person.length);
                xmlString += "<person><firstname>" + firstName + "</firstname><lastname>" + lastName + "</lastname>";   
            } 
            else {
                console.log("Error! Malformed input: Person. " + person); 
                console.log("Expected person to follow syntax: firstname|lastname"); 
            }
    }, 

    createTelephone:function (phone) {
        phone = phone.substring(2, phone.length); 
        var phoneIndex = phone.indexOf("|"); 
            if (phoneIndex != -1) {
                var mobilePhone = phone.substring(0, phoneIndex); 
                var landLine = phone.substring(phoneIndex + 1, phone.length); 
                xmlString += "<phone><mobile>" + mobilePhone + "</mobile><landline>" + landLine + "</landline></phone>";  
            }
            else {
                console.log("Error! Malformed input: Phone. " + phone); 
                console.log("Expected phone to follow syntax: mobile|landline"); 
            }
    },

    createAddress:function (address) {
        address = address.substring(2, address.length); 
        var addressFirstIndex = address.indexOf("|"); 
        var addressLastIndex = address.lastIndexOf("|"); 
            if (addressFirstIndex != -1 && addressLastIndex != -1 && addressFirstIndex != addressLastIndex) {
                var street = address.substring(0, addressFirstIndex); 
                var city = address.substring(addressFirstIndex + 1, addressLastIndex); 
                var zip = address.substring(addressLastIndex + 1, address.length); 
                xmlString += "<address><street>" + street + "</street><city>" + city + "</city><zip>" + zip + "</zip></address>";
            }
            else {
                console.log("Error! Malformed input: Address. " + address);
                console.log("Expected address to follow syntax: street|city|zip");
            }
    },

    createFamily:function (family) {
        family = family.substring(2, family.length); 
        var familyIndex = family.indexOf("|"); 
            if (familyIndex != -1 ) {
                var name = family.substring(0, familyIndex); 
                var born = family.substring(familyIndex + 1, family.length); 
                xmlString += "<family><name>" + name + "</name><born>" + born + "</born>"; 
            }
            else {
                console.log("Error! Malformed input: Family. " + family); 
                console.log("Expected family to follow syntax: name|born"); 
            }
    },

    checkNextIndex:function (index) {

            if (index + 1 != textArr.length) {
            var nextIndex = textArr[index + 1];

            if (nextIndex.includes("F|") && openFamily == true) {
                xmlString += "</family>";
                openFamily = false;
            }

            else if (nextIndex.includes("P|") && openFamily == true) {
                xmlString += "</family></person>";
                openFamily = false;
            }

            else if (nextIndex.includes("P|") && openFamily == false) {
                xmlString += "</person>"; 
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', Main.init);