var ml4 = {};
ml4.opacityIn = [0,1];
ml4.scaleIn = [0.2, 1];
ml4.scaleOut = 3;
ml4.durationIn = 800;
ml4.durationOut = 600;
ml4.delay = 500;

anime.timeline({loop: true})
  .add({
    targets: '.ml4 .letters-1',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-1',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4 .letters-2',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-2',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4 .letters-3',
    opacity: ml4.opacityIn,
    scale: ml4.scaleIn,
    duration: ml4.durationIn
  }).add({
    targets: '.ml4 .letters-3',
    opacity: 0,
    scale: ml4.scaleOut,
    duration: ml4.durationOut,
    easing: "easeInExpo",
    delay: ml4.delay
  }).add({
    targets: '.ml4',
    opacity: 0,
    duration: 1000,
    delay: 100
  });



  let english = document.querySelector(".english")
  let french = document.querySelector(".french")
  english.style.backgroundColor = "black"
  english.style.color="#c0ff6b"
  english.style.padding= "5px 10px 5px 10px"
  english.style.borderRadius = "5px"
  english.addEventListener("click",function(){
    english.style.backgroundColor = "black"
    english.style.color="#c0ff6b"
    english.style.padding= "5px 10px 5px 10px"
    english.style.borderRadius = "5px"
    

    french.style.backgroundColor = "#d5d5d5"
    french.style.color="black"
    french.style.padding= "none"
    french.style.borderRadius = "none"
  })
  french.addEventListener("click",function(){
    french.style.backgroundColor = "black"
    french.style.color="#c0ff6b"
    french.style.padding= "5px 10px 5px 10px"
    french.style.borderRadius = "5px"
    

    english.style.backgroundColor = "#d5d5d5"
    english.style.color="black"
    english.style.padding= "none"
    english.style.borderRadius = "none"
  })