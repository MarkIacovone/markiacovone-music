const playBtn = document.getElementById('playBtn');
const nextAudioBtn = document.getElementById('nextBtn');
const prevAudioBtn = document.getElementById('prevBtn');
const testSection = document.querySelector(".test-section");

const audioSourceList = [
  '../assets/audio/chill/a-cozy-morning.mp3',
  '../assets/audio/chill/follow-me.mp3',
  '../assets/audio/chill/go-with-style.mp3',
  '../assets/audio/chill/innocent-steps.mp3',
  '../assets/audio/chill/new-flavors.mp3',
  '../assets/audio/chill/pacience-is-the-key.mp3',
]

const chill = [
  '../assets/audio/chill/a-cozy-morning.mp3',
  '../assets/audio/chill/follow-me.mp3',
  '../assets/audio/chill/go-with-style.mp3',
  '../assets/audio/chill/innocent-steps.mp3',
  '../assets/audio/chill/new-flavors.mp3',
  '../assets/audio/chill/pacience-is-the-key.mp3',
]

// GET Repo

let repoURL = 'https://api.github.com/repos/MarkIacovone/markiacovone-music/contents/assets/audio/';
let assetsURL = 'https://raw.githubusercontent.com/MarkIacovone/markiacovone-music/master/assets/audio/';

// Get folders / GENRES from GIT repo

async function getFolders() {
  const response = await fetch(`${repoURL}`);
  const data = await response.json();
  const folders = data.filter((item) => item.type === 'dir');
  return folders;
}

genreList = [];

getFolders().then(data => {
  // get all indexes from the array of objs
  let genreArray = data.map(a => a.name
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' '));
  // console.log(allIndex);
  for (i = 0; i < genreArray.length; i++) {
    const genreTitle = document.createElement("button");
    genreTitle.className = "test-button";
    genreTitle.style.cssText = "height:50px;";
    genreTitle.innerText = genreArray[i];
    testSection.appendChild(genreTitle);
    genreList.push(genreArray[i]);
    genreTitle.addEventListener("click", function(){
      if (genreList[i] == titleArray[i]) {
            testImage[i].classList.remove('test-img');
            console.log('match');
      } else {
        console.log('click');
      }
    });
  }
});

// S I L E N C I N G   T H I S   F U N C T I O N
// T O   S A V E   R E S O U R C E S

// Get images from all GENRES from GIT repo

async function getGenreImgs() {
  const response = await fetch(`${repoURL}`);
  const data = await response.json();
  const images = data.filter((item) => item.type === 'file');
  return images;
}

getGenreImgs().then(data => {
  // get all indexes from the array of objs
  let allIndex = data.map(a => a.name);
  // console.log(allIndex);
});

let titleArray = [];

getGenreImgs().then(data => {

  let imgArray = data.map(file => file.name);


  // CREATE IMG for GENRE BACKGROUND


  for (i = 0; i < imgArray.length; i++) {
    const genreImg = document.createElement("img");
    genreImg.style.cssText = "width:200px;height:200px;";
    genreImg.className = "test-img";
    genreImg.src = assetsURL + imgArray[i];
    genreImg.type = "image/webp";
    testSection.appendChild(genreImg);

    let arrayUpperCased = imgArray[i].slice(0, -5).split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('');
    titleArray.push(arrayUpperCased);
  }
});


// S I L E N C I N G   T H I S   F U N C T I O N
// T O   S A V E   R E S O U R C E S

// Get audio from ALL GENRES from GIT repo

// async function getAudio() {
//   const response = await fetch(`${repoURL + 'chill'}`);
//   const data = await response.json();
//   const audios = data.filter((item) => item.type === 'file');
//   return audios;
// }

// getAudio().then(data => {
//   // get all indexes from the array of objs
//   let allIndex = data.map(a => a.name);
//   // console.log(allIndex);
// });


// Create empty array that will store the genres names
// Then -> waits for a promise which could either resolve or reject
// can make a catch case

// getAudio().then(data => {

//   let songArray = data.map(file => file.name
// // grabs each file name and erases .mp4, uses every - to separate words into arrays,
// // goes over each word and uppercases its first letter, and erases the previous lowercased first letter 
// // joins and groups all the arrays together into a single string, each separated with a space
//     .slice(0, -4)
//     .split('-')
//     .map(word => word[0].toUpperCase() + word.slice(1))
//     .join(' '));

//   // CREATE H1 for GENRE TITLE

//   const testSection = document.querySelector(".test-section");

//   for (i = 0; i < songArray.length; i++) {
//     const songTitle = document.createElement("h1");
//     songTitle.innerText = songArray[i];
//     testSection.appendChild(songTitle);
//   }
// });

// ADD OR REMOVE CLASS TO SELECTED

const testButtons = Array.from(document.querySelectorAll(".test-button"));
const testImage = testSection.getElementsByTagName("img");

// let buttonSelected = true;

// function selectGenre() {
//   if (genreArray == titleArray) {
//     testImage.classList.remove(...testImage.classList);
//   } else {
    
//   }
// }

// function selectGenre() {
//   console.log("clicked");
// }

// testButtons[0].addEventListener("click", selectGenre);


// if (testButton) {
// }
//
  








const audioList = audioSourceList.map(
  function (path) {
    const audioFile = document.createElement('audio');
    audioFile.src = path;
    // not a good practice to have side effects (append within map)
    document.body.append(audioFile);

    return audioFile;
  }
)

let currentTrackIndex = 0;
let isPlaying = false;


function toggleAudio() {
  if (!isPlaying) {
    audioList[currentTrackIndex].play();
  } else {
    audioList[currentTrackIndex].pause();
  }

  isPlaying = !isPlaying;
}

function playNextAudio() {
  audioList[currentTrackIndex].pause();
  audioList[currentTrackIndex + 1].play();
  currentTrackIndex = currentTrackIndex + 1;
}

function playPrevAudio() {
  audioList[currentTrackIndex].pause();
  audioList[currentTrackIndex - 1].play();
  currentTrackIndex = currentTrackIndex - 1;
}

playBtn.addEventListener('click', toggleAudio);
nextAudioBtn.addEventListener('click', playNextAudio);
prevAudioBtn.addEventListener('click', playPrevAudio);

// --------------------------------
/* Reference
const tracks = Array.from(document.querySelectorAll(".track-list li"));

let trackIndex = 0;
let observer = new IntersectionObserver(
  // function that gets executed every time a new node intersects with the observer element (works section)
  function (entries) {
    if (entries[0].isIntersecting === false) {
      tracks[trackIndex].classList.add("unselected");
      trackIndex = trackIndex + 1;
      tracks[trackIndex].classList.remove("unselected");
    }
    entries.forEach(entry => {
      console.log({
        target: entry.target, isIntersecting: entry.isIntersecting
      })
    })
  }, 
  // configuration object
  {
  root: document.querySelector("#works"),
  rootMargin: "0px",
  threshold: 1.0,
});


tracks.forEach(track => {
  observer.observe(track);
})
*/

const tracks = Array.from(document.querySelectorAll(".track-list li"));


let observer = new IntersectionObserver(
  // function that gets executed every time a new node intersects with the observer element (works section)
  function (entries) {
    if (entries[0].isIntersecting === false) {
      tracks[currentTrackIndex].classList.add("unselected");
      playNextAudio();
      tracks[currentTrackIndex].classList.remove("unselected");
    }
    entries.forEach(entry => {
      console.log({
        target: entry.target, isIntersecting: entry.isIntersecting
      })
    })
  },
  // configuration object
  {
    root: document.querySelector("#works"),
    rootMargin: "0px",
    threshold: 1.0,
  });


tracks.forEach(track => {
  observer.observe(track);
})


//
//
//
//------------------------------

let pointerFrom = 0;
let elementFrom = 0;

const scrollable = document.querySelector('.track-list');

scrollable.addEventListener('wheel', event => {
  const toLeft = event.deltaY < 0 && scrollable.scrollLeft > 0
  const toRight = event.deltaY > 0 && scrollable.scrollLeft < scrollable.scrollWidth - scrollable.clientWidth

  if (toLeft || toRight) {
    event.preventDefault()
    scrollable.scrollBy({ left: event.deltaY })
  }
})

// let scrollingHorizontally = true;

// scrollable.addEventListener("wheel", (event) => {
//   if (scrollingHorizontally) {
//     scrollable.scrollBy({
//       left: event.deltaY < 0 ? -70 : 70,
//       behavior: 'smooth'
//     });
//     event.preventDefault();
//     event.stopPropagation();

//     // check if the user has reached the end of the slider
//     if (scrollable.scrollLeft <= scrollable.scrollWidth 
//       || scrollable.scrollRight >= scrollable.scrollWidth
//       - scrollable.clientWidth) {
//       scrollingHorizontally = false;
//       scrollable.style.overflowY = "auto";
//     }
//   } else {
//     // (scroll the page up/down)
//     return true;
//   }
// });

const onDrag = (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior and when the pointer is down.
  if (event.pointerType == 'mouse') {
    scrollable.scrollLeft = elementFrom - event.clientX + pointerFrom;
  }
};

scrollable.addEventListener('pointerdown', (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior.
  if (event.pointerType == 'mouse') {
    pointerDown = true;
    // Set the position where the mouse is starting to drag from.
    pointerFrom = event.clientX;
    // Set the position of the element is scrolled from.
    elementFrom = scrollable.scrollLeft;
    // React on pointer move.
    document.addEventListener('pointermove', onDrag);
  }
});

// Stop reacting on pointer move when pointer is no longer clicked.
document.addEventListener('pointerup', (event) => {
  // Ensure we only do this for pointers that don't have native
  // drag-scrolling behavior.
  if (event.pointerType == 'mouse') {
    document.removeEventListener('pointermove', onDrag);
  }
});
