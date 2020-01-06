console.log("ui.js has loaded");

const sidebar = document.querySelector("#sidebar");

//DOM menu elements
const menuInstructions = document.querySelector(".menu-instructions");
const menuWinningCombos = document.querySelector(".menu-winningCombos");
const menuAbout = document.querySelector(".menu-about");

//click event for nav items
sidebar.addEventListener("click", toggleMenu);

//function to toggle the menus open and closed when nav items are clicked
function toggleMenu(e){

    if(e.target.id == "btn_instructions"){
        if(menuInstructions.style.display == "flex"){
            menuInstructions.style.display = "none";
            // e.target.classList.remove("sidebarNavSelected");
            
        }
        else{
            menuInstructions.style.display = "flex";
            menuWinningCombos.style.display = "none";
            menuAbout.style.display = "none";
            // e.target.classList.add("sidebarNavSelected");
        }  
    }

    else if(e.target.id == "btn_winningCombos"){
        if(menuWinningCombos.style.display == "flex"){
            menuWinningCombos.style.display = "none";
            // e.target.classList.remove("sidebarNavSelected");

        }
        else{
            menuWinningCombos.style.display = "flex";
            menuAbout.style.display = "none";
            menuInstructions.style.display = "none";
            // e.target.classList.add("sidebarNavSelected");
        }
        
    }

    else if(e.target.id == "btn_about"){
        if(menuAbout.style.display == "flex"){
            menuAbout.style.display = "none";
            // e.target.classList.remove("sidebarNavSelected");

        }
        else{
            menuAbout.style.display = "flex";
            menuInstructions.style.display = "none";
            menuWinningCombos.style.display = "none";
            // e.target.classList.add("sidebarNavSelected");
        }
        
    }
}

//exit button on menu pop-out
menuInstructions.addEventListener("click", exit);
menuWinningCombos.addEventListener("click", exit);
menuAbout.addEventListener("click", exit);


function exit(e){
    if(e.target.classList.contains("exit")){
        e.target.parentElement.style.display = "none";
    }
}
