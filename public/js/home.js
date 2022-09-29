
const first = document.querySelector(".first-box");
const second = document.querySelector(".second-box");
const third = document.querySelector(".third-box");
const indigator = document.querySelector(".indigator");
const box = document.querySelector(".main-box")


first.addEventListener("click",()=>{
 
    first.classList.add("active")
    second.classList.remove("active")
    third.classList.remove("active")
    box.style.transform ="translateX(0vw)";
    
})
second.addEventListener("click",()=>{
  
    second.classList.add("active")
    first.classList.remove("active")
    third.classList.remove("active")
    box.style.transform ="translateX(-100vw";
    
   
})
third.addEventListener("click",()=>{
    third.classList.add("active")
    second.classList.remove("active")
    first.classList.remove("active")
    box.style.transform ="translateX(-200vw)";
   
})