colourArray = [{r: 238, g: 220, b: 130}, {r: 253, g: 215, b: 0}, {r: 255, g: 191, b: 0}, {r: 255, g: 87, b: 51}, {r: 199, g: 0, b: 57}, {r: 144, g: 12, b: 63}, {r: 88, g: 24, b: 69}, {r: 50, g: 10, b: 40}, {r: 25, g: 5, b: 25}];

function getStart(loopVar) {
    let tempColour = {r: 0, g: 0, b: 0};
    tempColour.r = colourArray[~~(loopVar/25)].r + (colourArray[~~(loopVar/25) + 1].r - colourArray[~~(loopVar/25)].r) * ((loopVar - (~~(loopVar/25)) * 25) / 25);  
    tempColour.g = colourArray[~~(loopVar/25)].g + (colourArray[~~(loopVar/25) + 1].g - colourArray[~~(loopVar/25)].g) * ((loopVar - (~~(loopVar/25)) * 25) / 25);  
    tempColour.b = colourArray[~~(loopVar/25)].b + (colourArray[~~(loopVar/25) + 1].b - colourArray[~~(loopVar/25)].b) * ((loopVar - (~~(loopVar/25)) * 25) / 25);
    return 'rgba(' + tempColour.r + ', ' + tempColour.g + ', ' + tempColour.b + ', 0.4)';
}

function getEnd(loopVar) {
    let tempColour = {r: 0, g: 0, b: 0};
    tempColour.r = colourArray[~~(loopVar/25)].r + (colourArray[~~(loopVar/25) + 1].r - colourArray[~~(loopVar/25)].r) * ((loopVar + 1 - (~~(loopVar/25)) * 25) / 25);  
    tempColour.g = colourArray[~~(loopVar/25)].g + (colourArray[~~(loopVar/25) + 1].g - colourArray[~~(loopVar/25)].g) * ((loopVar + 1 - (~~(loopVar/25)) * 25) / 25);  
    tempColour.b = colourArray[~~(loopVar/25)].b + (colourArray[~~(loopVar/25) + 1].b - colourArray[~~(loopVar/25)].b) * ((loopVar + 1 - (~~(loopVar/25)) * 25) / 25);
    return 'rgba(' + tempColour.r + ', ' + tempColour.g + ', ' + tempColour.b + ', 0.4)';
}


for(let i = 0; i < 200; i++) {
    let element = document.createElement('div');
    element.setAttribute('class', 'paintStrip');

    if(i > 50 && i <= 150)
        element.style.setProperty('--line-height', Math.floor((Math.random() * 16)) + 15 + 'vh');
    else
        element.style.setProperty('--line-height', Math.floor((Math.random() * 26)) + 15 + 'vh');
    element.style.setProperty('--start-colour', getStart(i));
    element.style.setProperty('--end-colour', getEnd(i));

    document.getElementById('root').appendChild(element);
}