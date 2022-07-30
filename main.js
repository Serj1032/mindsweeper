import {Field} from "./field.js"

let field = document.getElementById("field");
let bombsLeftLabel = document.getElementById("bombsLeft");

let f;// = new Field(20, 10, 35);


export function NewGame(width, height, bombAmount){
    f = new Field(width, height, bombAmount);
    bombsLeftLabel.innerHTML = f.bombAmount - f.flagAmount;

}


field.addEventListener("contextmenu",function(event){
    event.preventDefault();
    f.flagField(event.x - field.offsetLeft, event.y - field.offsetTop);
    bombsLeftLabel.innerHTML = f.bombAmount - f.flagAmount;
},false);

field.addEventListener('click', (event) => {
    if (event.button == 0) {
        f.clickField(event.x - field.offsetLeft, event.y - field.offsetTop);
    }
});
