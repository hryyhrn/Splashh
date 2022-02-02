//Variable declarations
var colourArray = [], paletteCount = 0;






//Events and Listeners

window.onload = () => {
    randomizeColourPalette();

    //Gets all Palettes when Window loads
    fetch('/my-palettes', {
        headers: {
            'CSRF-Token': document.getElementById('_csrf').innerText
        }
    })
    .then((response) => {
        if(!response.redirected && response.status == 200)
            return response.json();
        else 
            window.location.href = 'home';
    })
    .then(resArray => {
        let resArrayLength = Object.keys(resArray).length;
        if(resArrayLength != 0) {
            for(let i = 0; i < resArrayLength; i++)
                loadPalettes(resArray);
        }
    })
    .catch((error) => {
        window.location.href = '/error-message';
    });
};

document.addEventListener('keyup', function(e) {
    if(e.keyCode == 32)
        randomizeColourPalette();
}
);

document.getElementById('navbar').querySelector(':nth-child(4)').addEventListener('click', paletteMenu);
 
document.addEventListener('keyup', function(e) {
    if(e.keyCode == 13&&document.getElementById('nameCont').style.display == 'block') {
        
        var paletteResArray = {
            'paletteName': document.getElementById('nameBar').value, 
            'colour1': colourArray[0], 
            'colour2': colourArray[1], 
            'colour3': colourArray[2], 
            'colour4': colourArray[3]
        };
        
        //Saves Palette
        fetch('/save-palette', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': document.getElementById('_csrf').innerText
            },
            body: JSON.stringify(paletteResArray)
        })
        .then((response) => {
            if(!response.redirected && response.status == 200)
                return response.text();
            else 
                window.location.href = 'home';
        })
        .then(resMsg => {
            savePalette(resMsg);
            document.getElementById('nameBar').value='';
            document.getElementById('nameBar').blur();
        }) 
        .catch((error) => {
            window.location.href = '/error-message';
        });
    }
}
);

document.getElementById('submitPal').onclick = submitPaletteButton;

for(let i=1;i<5;i++) {
    document.getElementById(i).addEventListener('click', toggleColourLock);
}

document.getElementById('closeNameCont').addEventListener('click', closeNameCont);

document.getElementById('closePaletteCont').addEventListener('click', closePaletteCont);

document.getElementById('randomizePal').addEventListener('click', randomizeColourPalette);

document.getElementById('nameSub').addEventListener('click', function(e) {
    var paletteResArray = {
        'paletteName': document.getElementById('nameBar').value, 
        'colour1': colourArray[0], 
        'colour2': colourArray[1], 
        'colour3': colourArray[2], 
        'colour4': colourArray[3]
    };
        
    //Saves Palette
    fetch('/save-palette', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': document.getElementById('_csrf').innerText
        },
        body: JSON.stringify(paletteResArray)
    })
    .then((response) => {
        if(!response.redirected && response.status == 200)
            return response.text();
        else 
            window.location.href = 'home';
    })
    .then(resMsg => {
        savePalette(resMsg);
        document.getElementById('nameBar').value='';
        document.getElementById('nameBar').blur();
    }) 
    .catch((error) => {
        window.location.href = '/error-message';
    });
});




//Functions

    //Loads existing Palettes
function loadPalettes(resArray) {
    paletteCount++;
    let element = document.createElement('div');
    element.setAttribute('id', 'P' + paletteCount);
    element.setAttribute('class', 'palette');
    element.textContent = resArray[paletteCount - 1].paletteName + '  |';
    document.getElementById('palCont').appendChild(element);

    for(let key in resArray[paletteCount-1]) {
        if(key != 'username' && key != 'paletteName' && key != '__v' && key != '_id') {
            let el = document.createElement('span');
            el.setAttribute('class', 'circle');
            el.style.backgroundColor = resArray[paletteCount - 1][key];
            document.getElementById('P' + paletteCount).appendChild(el);
            element.innerHTML += resArray[paletteCount - 1][key];
        }
    }

    let trashCan = document.createElement('span');
    trashCan.setAttribute('id', 'trash' + paletteCount)
    trashCan.setAttribute('class', 'fas fa-trash-alt trash');
    trashCan.addEventListener('mousedown', deletePalette);
    document.getElementById('P' + paletteCount).appendChild(trashCan);
}

    //Randomizes Palettes
function randomizeColourPalette() {
    for(let i = 1; i<5; i++) {
        if(document.getElementById('l' + i).textContent == 'LOCK'&&document.getElementById('nameCont').style.display != 'block'&&document.getElementById('palCont').style.display != 'block') {
            let randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
            document.getElementById(i).style.backgroundColor = randomColor;
            colourArray[i-1] = randomColor;
        }
    }
}

    //Saves Palette
function savePalette(msg) {
    if(!msg) {
        document.getElementById('nameCont').style.display = 'none';

        paletteCount++;
        let element = document.createElement('div');
        element.setAttribute('id', 'P' + paletteCount);
        element.setAttribute('class', 'palette');
        element.textContent = document.getElementById('nameBar').value + '  |';
        document.getElementById('palCont').appendChild(element);

        for(let j=0; j < 4; j++) {
            let el = document.createElement('span');
            el.setAttribute('class', 'circle');
            el.style.backgroundColor = colourArray[j];
            document.getElementById('P' + paletteCount).appendChild(el);
            element.innerHTML += colourArray[j];
        }

        let trashCan = document.createElement('span');
        trashCan.setAttribute('id', 'trash' + paletteCount)
        trashCan.setAttribute('class', 'fas fa-trash-alt trash');
        trashCan.addEventListener('mousedown', deletePalette);
        document.getElementById('P' + paletteCount).appendChild(trashCan);

        document.getElementById('submitPal').disabled = false;
    }
    else {
        document.getElementById('error').innerText = msg;
    }
}

    //Deletes Palette
function deletePalette(e) {
    let trashID = e.target.id;
    let palNo = parseInt(trashID.replace('trash', ''));
    let el = document.getElementById('P' + palNo); 
    let delPalName = el.firstChild.textContent.replace('  |', '');
    el.remove();
    for(let l = palNo + 1; l <= paletteCount; l++) {
        document.getElementById('P' + l).setAttribute('id', 'P' + (l - 1));
        document.getElementById('trash' + l).setAttribute('id', 'trash' + (l - 1));
    }

    fetch('/delete-palette', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': document.getElementById('_csrf').innerText
        },
        body: JSON.stringify({'palName': delPalName})
    })
    .then((response) => {
        if(!response.redirected && response.status == 200)
            return;
        else
            window.location.href = 'home';    
    })
    .catch((error) => {
        window.location.href = '/error-message';
    });
    paletteCount--;
}

    //Toggles lock/unlock
function toggleColourLock(e) {
    if(document.getElementById(e.target.id).textContent == 'LOCK') {
        document.getElementById(e.target.id).textContent = 'UNLOCK';
        document.getElementById(e.target.id).style.paddingLeft = '4.47vw';
    }
    else {
        document.getElementById(e.target.id).textContent = 'LOCK';
        document.getElementById(e.target.id).style.paddingLeft = '5.88vw';
    }
}

    //Opens Palette Menu
function paletteMenu() {
    document.getElementById('palCont').style.display = 'block';
}
    
    //Closes Palette Menu
function closePaletteCont() {
    document.getElementById('palCont').style.display = 'none'
}

    //Palette Submit and Open Name Container
function submitPaletteButton() {
    document.getElementById('nameCont').style.display = 'block';
    document.getElementById('submitPal').disabled = true;
}

    //Closes Name Container
function closeNameCont() {
    document.getElementById('nameCont').style.display = 'none';
    document.getElementById('submitPal').disabled = false;
}