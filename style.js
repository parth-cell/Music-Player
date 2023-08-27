const wrapper =document.querySelector(".wrapper"),
musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-detail .name"),
musicArtist=wrapper.querySelector(".song-detail .artist"),
mainAudio=wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMusicBtn=musicList.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingSong();
})

//Loading Music FN
function loadMusic(indexNumb){
    musicName.innerHTML=allMusic[indexNumb-1].name;
    musicArtist.innerHTML=allMusic[indexNumb-1].artist;
    musicImg.src =`images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src=`songs/${allMusic[indexNumb-1].src}.mp3`;
}

//play music
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText="pause";
    mainAudio.play();
}

// pause fn
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText="play_arrow";
    mainAudio.pause();
}
// next bn fn
function nextMusic(){
    musicIndex++;
    musicIndex>allMusic.length?musicIndex=1:musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
//prev bn
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex=allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
// play bn
playPauseBtn.addEventListener("click",()=>{
    const isMusicPaused=wrapper.classList.contains("paused");
    isMusicPaused? pauseMusic():playMusic();
});

// next music 
nextBtn.addEventListener("click",()=>{
    nextMusic();
})
// prev music 
prevBtn.addEventListener("click",()=>{
    prevMusic();
})


mainAudio.addEventListener("timeupdate",(e)=>{
    
     const currentTime=e.target.currentTime;
     const duration =e.target.duration;
     let progressWidth=(currentTime/duration)*100;
     progressBar.style.width =`${progressWidth}%`;

    let musicCurrentTime=wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

mainAudio.addEventListener("loadeddata",()=>{
 // update song total duration
    let audioDuration=mainAudio.duration;
    let totalMin=Math.floor(audioDuration / 60);
    let totalSec=Math.floor(audioDuration % 60);
    if(totalSec < 10){
        totalSec=`0${totalSec}`;
    }
musicDuration.innerHTML=`${totalMin}:${totalSec}`;
});

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec=`0${currentSec}`;
    }
musicCurrentTime.innerHTML=`${currentMin}:${currentSec}`;
});

//update with mouse cursor
progressArea.addEventListener("click",(e)=>{
    let progressWidthval=progressArea.clientWidth;
    let clickOffSetx=e.offsetX;
    let songDuration=mainAudio.duration;
    mainAudio.currentTime=(clickOffSetx/progressWidthval)*songDuration;
   playMusic();
});

// shuffle btn , repeat btn
const repeatBtn=wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
let getText=repeatBtn.innerText;
switch(getText){
    case"repeat":
    repeatBtn.innerText="repeat_one";
    repeatBtn.setAttribute("title","Song looped");
    break;
    case"repeat_one":
    repeatBtn.innerText="shuffle";
    repeatBtn.setAttribute("title","Playback shuffle");
    break;
    case"shuffle":
    repeatBtn.innerText="repeat";
    repeatBtn.setAttribute("title","Playlist looped");
    break;
}
});


mainAudio.addEventListener("ended",()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case"repeat":
        nextMusic();
        break;
        case"repeat_one":
        mainAudio.currentTime = 0;
        loadMusic(musicIndex);
        playMusic();
        break;
        case"shuffle":
        let randIndex =Math.floor ((Math.random()*allMusic.length)+1);
        do{
            randIndex =Math.floor ((Math.random()*allMusic.length)+1);
        }while(musicIndex == randIndex);
        musicIndex=randIndex;
        loadMusic(musicIndex);
        playMusic();
        break;
    } 
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
   showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
 
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); 

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ 
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; 
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); 
  });
}

//select song on click

const allLitags=ulTag.querySelectorAll("li");
function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");
    
    for (let j = 0; j < allLiTag.length; j++) {
      let audioTag = allLiTag[j].querySelector(".audio-duration");
    if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration=audioTag.getAttribute("t-duration");
        audioTag.innerText=adDuration;
    }  
      if(allLiTag[j].classList.contains("playing")){
        allLiTag[j].classList.remove("playing");
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
      }
  
      //if the li tag index is equal to the musicIndex then add playing class in it
      if(allLiTag[j].getAttribute("li-index") == musicIndex){
        allLiTag[j].classList.add("playing");
        audioTag.innerText = "Playing";
      }
  
      allLiTag[j].setAttribute("onclick", "clicked(this)");
    }
  }

  function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; //updating current song index with clicked li index
    loadMusic(musicIndex);
    playMusic();
    playingSong();
  }