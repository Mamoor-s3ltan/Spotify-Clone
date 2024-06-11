
let currentsong = new Audio();
let songs;
let currfolder;

function secondsTomins(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  
  const mins = Math.floor(seconds / 60);
  const remainseconds = Math.floor(seconds % 60);
  
  const formatedmins = String(mins).padStart(2, '0');
  const formatedsecs = String(remainseconds).padStart(2, '0');
  
  return `${formatedmins}:${formatedsecs}`;
}
async function getsongs(folder) {
  currfolder = folder
  let a = await fetch(`http://192.168.18.52:3000/${folder}/`);
  let data = await a.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  let as = div.getElementsByTagName("a");
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

// Showing the songs on the playlist

let songul = await document.querySelector(".songList").getElementsByTagName("ul")[0]
songul.innerHTML= ""
for (const song of songs) {
    songul.innerHTML = songul.innerHTML + ` <li>
    <img src="assets/music.svg" alt="">
    <div class="info">
    <div class="songartiest">  Mamoor</div>
    <div class="songname"> ${song}</div>
</div>
<div class="playnow">
<span>Play Now </span>
<img width="20px"  height="20px" class="invert" src="assets/play.svg" alt="">
</div>
</li>` 
}

// Add event listners to each songs

 Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click",element =>{
    playMusic(e.querySelector(".info").getElementsByTagName("div")[1].innerHTML.trim())

  })
})
return songs
}

const playMusic = (track, pause=false)=>{
  // let audio = new Audio()
  currentsong.src= `/${currfolder}/` + track
  if(!pause){
    currentsong.play()
    document.getElementById("play").src = "assets/pause.svg";
  
  }
  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function displayAlbums(){
  let data = await fetch(`http://192.168.18.52:3000/songs/`)
  let a = await data.text()
  let div = document.createElement("div")
  div.innerHTML= a
  let anchors =div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if(e.href.includes("/songs")){
     let folder = e.href.split("/").slice(-2)[0]

     // Get the meta data
     let data = await fetch(`http://192.168.18.52:3000/songs/${folder}/info.json`)
     let a = await data.json()
     

     cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder ="${folder}" class="card ">
                        <div class="play">
                            <svg width="44px" height="44px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <!-- Play Button Background -->
                                <circle cx="50" cy="50" r="40" fill="#1fdf64" />
                                <!-- Play Icon -->
                                <polygon points="45,35 70,50 45,65" fill="#000000" />
                            </svg>

                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="">
                        <h2>${a.title}</h2>
                        <p>${a.description}</p>
                    </div>`

    }
  }

  // Load the playlist when the card is clicked

Array.from(document.getElementsByClassName("card")).forEach(Event=>{
  Event.addEventListener("click",async item =>{
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
    playMusic(songs[0]) 
    
  })
  })



}
let vol;


async function main(){

//  songs = await getsongs("songs/cs");

// playMusic(songs[0])

// Dsiplay all the albums dynamically
await displayAlbums()



// Add eventlistner to songbuttons
play.addEventListener("click", ()=>{
  if(currentsong.paused){
    currentsong.play()
    document.getElementById("play").src = "assets/pause.svg";
    
  }
  else{
    currentsong.pause()
    document.getElementById("play").src = "assets/play.svg";
  }
})

// Listen for time update
currentsong.addEventListener("timeupdate", ()=>{
  document.querySelector(".songtime").innerHTML = `${secondsTomins(currentsong.currentTime)} / ${secondsTomins(currentsong.duration)}`;
  document.querySelector(".circle").style.left = (currentsong.currentTime/ currentsong.duration) * 97 + "%";
})

// Add event listner to seekbar

document.querySelector(".seekbar").addEventListener("click", (e)=>{
let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 97 ;
document.querySelector(".circle").style.left = percent + "%";

currentsong.currentTime = ((currentsong.duration) * percent) / 100
})

// Hamburg functionality

document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = 0;
})

// add eventlistner to cross

document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = -100 +"% ";
})

// Add an event listener to previous
previous.addEventListener("click", () => {
  currentsong.pause()
  console.log("Previous clicked")

  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
  }
})
// Add an event listener to next
next.addEventListener("click", () => {
  currentsong.pause()
  console.log("Next clicked")

  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
  }
})


// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
  let vol = e.target.value
  console.log(vol)
   currentsong.volume = parseInt(e.target.value)/100
})


// Add mute to volume
let mute =  document.querySelector(".volume > img")
mute.addEventListener("click", e=>{
  if(e.target.src.includes("assets/volume.svg")  ){
    e.target.src = e.target.src.replace("assets/volume.svg", "assets/mute.svg") 
     currentsong.volume =0
     document.querySelector(".range").getElementsByTagName("input")[0].value=0
  }
  else{
    e.target.src=e.target.src.replace("assets/mute.svg", "assets/volume.svg") 
     let cv = document.querySelector(".range").getElementsByTagName("input")[0].value =20
     currentsong.volume = .10 

  }
})



}

main()