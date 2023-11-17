// Get the "works" section from the DOM
const introSection = document.querySelector('#intro');
const introAnimCanvas = document.querySelector('#intro .right-div')

// Get the "works" section from the DOM
const worksSection = document.getElementById('works');

// Get content from genre-container / left div
const trackTextCtn = worksSection.querySelector(".track-txt-ctn");
const trackTextInner = trackTextCtn.querySelector(".track-txt")
const genreNav = worksSection.querySelector(".genre-nav");
const genreTitle = trackTextInner.querySelector("h2");
const genreDesc = trackTextInner.querySelector(".style-description p");

// Get content from track container / right div
const trackPlaylistCtn = document.querySelector(".track-list");
let scrollable = trackPlaylistCtn;

const repoURL = 'https://api.github.com/repos/MarkIacovone/markiacovone-music/contents/assets/audio/';
const assetsURL = 'https://raw.githubusercontent.com/MarkIacovone/markiacovone-music/master/assets/audio/';

///////////////////////////////
// I N T R O   S E C T I O N

import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { FlakesTexture } from 'three/addons/textures/FlakesTexture';
import { RGBELoader } from 'three/addons/loaders/RGBELoader';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";

function init() {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias:true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  introAnimCanvas.appendChild(renderer.domElement);

  var loader = new GLTFLoader();

  var obj;

  loader.load("mai_music_note.gltf", function(gltf) {
    obj = gltf.scene;
    scene.add(gltf.scene);

    camera.position.set(0, 0.3, 2);

    var light = new THREE.PointLight(0xffffff, 1);
    light.position.set(200,200,200);
    scene.add(light);

    var noteMaterial = new THREE.MeshPhysicalMaterial();
    var noteMesh = new THREE.Mesh(obj, noteMaterial);
    scene.add(noteMesh);

    animate();

    function animate(){+
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
      obj.rotation.y += 0.02;
    }

  });
}

init();

///////////////////////////////
// M U S I C   S E C T I O N

// Get files & titles from GIT repo
async function getGenreData() {
  const titleResponse = await fetch(repoURL);
  const genreData = await titleResponse.json();
  const folders = genreData.filter(item => item.type === 'dir');
  const images = genreData.filter(item => item.type === 'file');
  return { images, folders };
}

    // Create a genreDescriptions array to hold the genre descriptions
    const genreDescriptions = [
        "Natural and organic, filled with emotional depth through the authenticity and dynamics of acoustic instruments.",
        "Thrilling and explorative, capturing the emotions of a journey into the unknown.",
        "Spacious and atmospheric set of textures curated to provoke mindfulness and introspective.",
        "Laid-back and mellow, expressing warmness and relaxation through soothing beats and melodies.",
        "Pulsating and vibing, induces the listener to an energetic and electrifying state.",
        "Vulnerable and sensitive, evoking tender melodies and textures to capture a touching experience.",
        "Tense and eerie, builds a haunting feeling of fear and an dissonant and unsettling atmosphere.",
        "Raw and intense, catches a sense of a powerful and rebelious spirit through distorted guitars and loud drum beats.",
        "Futuristic and otherworldly, immerses listeners in a interestellar and cosmic realm.",
        "Joyful and inspiring, with melodies and rhythms that evoke optimism, motivation, and empowerment."
      ];

// FUNCTION REGARDING GENRES, DESCRIPTIONS, IMAGES AND SONG TITLES
getGenreData().then(({ images, folders }) => {
  async function createGenresAndAddEventListeners() {
    const imagesData = await images;
    const imgTitleArray = imagesData.map(file => file.name);
    const imgArray = [];
    const descArray = [];

    // Create genre images
    imgTitleArray.forEach((imgTitle, index) => {
      const genreImg = document.createElement("img");
      genreImg.className = "track-style-bg";
      genreImg.src = assetsURL + imgTitle;
      genreImg.type = "image/webp";
      trackTextCtn.appendChild(genreImg);
      imgArray.push(genreImg);
    });

    const foldersData = await folders;
    const genreArray = foldersData.map(a => a.name.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' '));

    // Create genre buttons and descriptions
    genreArray.forEach((genreName, index) => {
      const genreBtn = document.createElement("button");
      
      genreBtn.className = "genre-button";
      genreBtn.innerText = genreName;
      genreNav.appendChild(genreBtn);
      genreTitle.innerHTML = genreName;

      genreDesc.innerText = genreDescriptions[index];
      descArray.push(genreDesc);
      
      
      genreBtn.dataset.imgName = imgTitleArray[index]; // Store image name as a data attribute


      // Handle click event for each genre button
      genreBtn.addEventListener("click", async function () {
        const imgName = this.dataset.imgName;
        const imgIndex = imgTitleArray.indexOf(imgName);
        const genreName = genreArray[imgIndex];
        const allButtons = document.querySelectorAll('.genre-button');

        allButtons.forEach(button => button.classList.remove('active-btn'));
        this.classList.add('active-btn')

        if (imgIndex !== -1) {
          if (activeImgIndex !== null) {
            imgArray[activeImgIndex].classList.remove('active');
            genreTitle.innerHTML = genreName;
            genreDesc.innerHTML = genreDescriptions[index];
          }
          imgArray[imgIndex].classList.add('active');
          activeImgIndex = imgIndex;
          await displaySongTitles(genreName);
        }

      });


    });
    
    const initialGenreIndex = 0;
    genreDesc.innerHTML = genreDescriptions[initialGenreIndex];
    genreTitle.innerHTML = genreArray[initialGenreIndex];
    imgArray[initialGenreIndex].classList.add('active');
    descArray[initialGenreIndex].classList.remove('test-item');
    await displaySongTitles(genreArray[initialGenreIndex]);
  }
  let activeImgIndex = 0;
  createGenresAndAddEventListeners();

  function getTotalTrackWidth() {
    const trackElements = trackPlaylistCtn.querySelectorAll(".track");
    let totalWidth = 0;
    trackElements.forEach(element => {
      totalWidth += element.offsetWidth; // Include the element's width
      totalWidth += parseFloat(getComputedStyle(element).marginRight); // Include the margin
    });
    return totalWidth;
  }

  // Get audio from ALL GENRES from GIT repo
  async function displaySongTitles(genreName) {
    if (typeof genreName !== 'string' || genreName.trim() === '') {
      console.error('Invalid genre name:', genreName);
      return;
    }

    const previousSongs = trackPlaylistCtn.querySelectorAll("li.track, hr.connector, div.track-list-end");
    previousSongs.forEach(song => song.remove());

    const response = await fetch(`${repoURL + genreName.toLowerCase()}`);
    const data = await response.json();
    const audios = data.filter(item => item.type === 'file');
    const songTitleArray = audios.map(file => file.name.slice(0, -4).split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '));
    const songURLArray = audios.map(file => file.name);

    // DISPLAY AUDIO FILES per GENRE
    for (let i = 0; i < songURLArray.length; i++) {
      const createTrackOuterCtn = document.createElement("li");
      createTrackOuterCtn.className = "track";
      trackPlaylistCtn.appendChild(createTrackOuterCtn);

      const createTrackTitleCtn = document.createElement("div");
      createTrackTitleCtn.classList.add('track-title-ctn');
      createTrackOuterCtn.appendChild(createTrackTitleCtn);

      const createTrackTitle = document.createElement("h3");
      createTrackTitle.innerHTML = songTitleArray[i]
      createTrackTitleCtn.appendChild(createTrackTitle);

      const createTrackTitleUnderline = document.createElement("hr");
      createTrackTitleUnderline.className = "track-title-underline";
      createTrackTitleCtn.appendChild(createTrackTitleUnderline);

      const createTrackInnerCtn = document.createElement("div");
      createTrackInnerCtn.className = "player";
      createTrackOuterCtn.appendChild(createTrackInnerCtn);

      const createPlayerBarCtn = document.createElement("div");
      createPlayerBarCtn.className = "bar-ctn";
      createTrackInnerCtn.appendChild(createPlayerBarCtn);

      const createProgressBar = document.createElement("hr");
      createProgressBar.setAttribute("id", "progressBar");
      createPlayerBarCtn.appendChild(createProgressBar);

      const createProgressBarStamp = document.createElement("div");
      createProgressBarStamp.setAttribute("id", "timeCircle");
      createPlayerBarCtn.appendChild(createProgressBarStamp);

      const createProgressCtn = document.createElement("div");
      createProgressCtn.className = "progress";
      createPlayerBarCtn.appendChild(createProgressCtn);

      const trackCurrentTime = document.createElement("h5");
      trackCurrentTime.setAttribute("id", "currentTime");
      createProgressCtn.appendChild(trackCurrentTime);

      const trackRemainingTime = document.createElement("h5");
      trackRemainingTime.setAttribute("id", "remainingTime");
      createProgressCtn.appendChild(trackRemainingTime);

      const trackButtonCtn = document.createElement("div");
      trackButtonCtn.classList.add("track-btn-ctn");
      createTrackInnerCtn.appendChild(trackButtonCtn)
      
      const trackPlayBtn = document.createElement("button");
      trackPlayBtn.setAttribute("id", "play");
      trackButtonCtn.appendChild(trackPlayBtn);

      const trackPauseBtn = document.createElement("button");
      trackPauseBtn.setAttribute("id", "pause");
      trackButtonCtn.appendChild(trackPauseBtn);

      const songAudio = document.createElement("audio");
      songAudio.className = "song";
      songAudio.style.cssText = "height:100px;";
      songAudio.controls = true;

      const audioSrc = `${assetsURL + genreName.toLowerCase()}/${songURLArray[i]}`;
      songAudio.src = audioSrc;
      createTrackInnerCtn.appendChild(songAudio);

      const musicGraph = document.createElement("div");
      musicGraph.className = "music-graph";
      createTrackInnerCtn.appendChild(musicGraph);

      const createTrackConnector = document.createElement("hr");
      createTrackConnector.className = "connector";
      trackPlaylistCtn.insertBefore(createTrackConnector, createTrackOuterCtn);
    }

      // FUNCTION TO CREATE SEPARATOR LINE AFTER EACH TRACK
      function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    const endOfList = document.createElement("div");
    endOfList.className = "track-list-end";
    insertAfter(endOfList, trackPlaylistCtn.lastElementChild);


    // Calculate the total width of track elements and set it as scrollable width
    const totalTrackWidth = getTotalTrackWidth();
    scrollable.style.width = totalTrackWidth + "px";
  
    const tracksLoadedEvent = new Event('tracksLoaded');
    scrollable.dispatchEvent(tracksLoadedEvent);

        // Add event listeners for play and pause buttons
        addAudioEventListeners();
  }
});



///////////////////////////////
// MUSIC PLAYER FUNCTIONALITIES

function updateProgressElements(audio) {
  const progressBar = audio.parentElement.querySelector("#progressBar");
  const progressBarStamp = audio.parentElement.querySelector("#timeCircle");
  const currentTimeElement = audio.parentElement.querySelector("#currentTime");
  const remainingTimeElement = audio.parentElement.querySelector("#remainingTime");

  const update = () => {
      const progress = (audio.currentTime / audio.duration) * 100;

      // progressBar.style.width = `${progress}%`;
      progressBarStamp.style.left = `${progress}%`;
      
      const currentMinutes = Math.floor(audio.currentTime / 60);
      const currentSeconds = Math.floor(audio.currentTime % 60);
      currentTimeElement.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;

      const remainingMinutes = Math.floor((audio.duration - audio.currentTime) / 60);
      const remainingSeconds = Math.floor((audio.duration - audio.currentTime) % 60);
      remainingTimeElement.textContent = `-${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  audio.addEventListener('timeupdate', update);

  // Clean up event listener when audio ends
  audio.addEventListener('ended', () => {
      audio.removeEventListener('timeupdate', update);
  });
}

function makeProgressCircleDraggable(audio) {
  const progressBar = audio.parentElement.querySelector("#progressBar");
  const progressBarStamp = audio.parentElement.querySelector("#timeCircle");

  let isDragging = false;

  const handleMouseDown = (e) => {
      isDragging = true;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
      if (isDragging) {
          const rect = progressBar.getBoundingClientRect();
          let x = e.clientX - rect.left;

          if (x < 0) {
              x = 0;
          } else if (x > rect.width) {
              x = rect.width;
          }

          const progress = (x / rect.width) * 100;
          // progressBar.style.width = `${progress}%`;
          progressBarStamp.style.left = `${progress}%`;
      }
  };

  const handleMouseUp = () => {
      isDragging = false;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

 // Get the progress percentage from the style.left property of progressBarStamp
 const progress = parseInt(progressBarStamp.style.left);

 // Ensure progress is a valid number
 if (!isNaN(progress)) {
     // Set audio current time based on progress bar position
     const duration = audio.duration;
     const newTime = (progress / 100) * duration;
     audio.currentTime = newTime;
 }
  };

  progressBarStamp.addEventListener('mousedown', handleMouseDown);
}

function addAudioEventListeners() {
  var audioList = document.querySelectorAll('li.track');

  audioList.forEach(function(track) {
    var songAudio = track.querySelector('audio');
    var trackPlayBtn = track.querySelector('#play');
    var trackPauseBtn = track.querySelector('#pause');
    var musicGraph = track.querySelector('div.music-graph');

    function displayInitialTime(audio) {
      const trackCurrentTime = audio.parentElement.querySelector("#currentTime");
      const trackRemainingTime = audio.parentElement.querySelector("#remainingTime");
    
      trackCurrentTime.textContent = "0:00";
      
      const totalMinutes = Math.floor(audio.duration / 60);
      const totalSeconds = Math.floor(audio.duration % 60);
      trackRemainingTime.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
    }

    // Add an event listener for loadedmetadata
    songAudio.addEventListener('loadedmetadata', function() {
      displayInitialTime(songAudio);
    });

    trackPlayBtn.addEventListener('click', function() {
      // Cancel functionalities within any other playing audio
      audioList.forEach(function(otherTrack) {
        var otherAudio = otherTrack.querySelector('audio');
        if (otherAudio !== songAudio && !otherAudio.paused) {
          otherAudio.pause();
          otherTrack.querySelector('#play').style.display = 'block';
          otherTrack.querySelector('#pause').style.display = 'none';
          otherTrack.querySelector('.is-playing').classList.remove('is-playing');
        }
      });

      // Automatically hide play button, show pause button and add graph after play is pressed
      trackPlayBtn.style.display = 'none';
      trackPauseBtn.style.display = 'block';
      musicGraph.classList.add('is-playing');

      // Play audio
      songAudio.play();
      // Call the draggable function
      makeProgressCircleDraggable(songAudio);
      updateProgressElements(songAudio);
    });

    trackPauseBtn.addEventListener('click', function() {
      // Hide pause button and show play button
      trackPauseBtn.style.display = 'none';
      trackPlayBtn.style.display = 'block';
      musicGraph.classList.remove('is-playing');

      // Pause audio
      songAudio.pause();
    });
  });
}

// const audioList = songURLArray.map(
//     function (path) {
//       const audioFile = document.createElement('audio');
//       audioFile.src = path;
//       // not a good practice to have side effects (append within map)
//       document.body.append(audioFile);
  
//       return audioFile;
//     }
//   )
  
  let currentTrackIndex = 0;
//   let isPlaying = false;
  
  
//   function toggleAudio() {
//     if (!isPlaying) {
//       audioList[currentTrackIndex].play();
//     } else {
//       audioList[currentTrackIndex].pause();
//     }
  
//     isPlaying = !isPlaying;
//   }
  
//   function playNextAudio() {
//     audioList[currentTrackIndex].pause();
//     audioList[currentTrackIndex + 1].play();
//     currentTrackIndex = currentTrackIndex + 1;
//   }
  
//   function playPrevAudio() {
//     audioList[currentTrackIndex].pause();
//     audioList[currentTrackIndex - 1].play();
//     currentTrackIndex = currentTrackIndex - 1;
//   }
  
//   playBtn.addEventListener('click', toggleAudio);
//   nextAudioBtn.addEventListener('click', playNextAudio);
//   prevAudioBtn.addEventListener('click', playPrevAudio);

///////////////////////////////
// OBSERVE TRACK LIST

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

///////////////////////////////
// SCROLLING BEHAVIOUR IN SECTION - WHEEL




let pointerFrom = 0;
let elementFrom = 0;
let pointerDown = false;


// Function to enable the scroll functionality
function enableScrollFunctionality() {
  scrollable.addEventListener('wheel', event => {
    const toLeft = event.deltaX < 0 && scrollable.scrollLeft > 0;
    const toRight =
      event.deltaX > 0 &&
      scrollable.scrollLeft < scrollable.scrollWidth - scrollable.clientWidth;
console.log('scrolling');

const scrollHorizontally = deltaX => {
  scrollable.scrollBy({ left: deltaX });
  requestAnimationFrame(() => scrollHorizontally(deltaX));
};


if (toLeft || toRight) {
  event.preventDefault();
  const scrollSpeedFactor = 0.5; // Adjust this value to control the scroll speed
  scrollHorizontally(event.deltaX * scrollSpeedFactor);
}
});

const onDrag = event => {
  if (event.pointerType === 'mouse' && pointerDown) {
    scrollable.scrollLeft = elementFrom - event.clientX + pointerFrom;
    requestAnimationFrame(() => onDrag(event));
  }
};










  scrollable.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse') {
      pointerDown = true;
      pointerFrom = event.clientX;
      elementFrom = scrollable.scrollLeft;
      requestAnimationFrame(() => onDrag(event));
    }
  });

  document.addEventListener('pointerup', event => {
    if (event.pointerType === 'mouse') {
      pointerDown = false;
    }
  });
}

// Listen for the custom event "tracksLoaded" and enable the scroll functionality when fired
scrollable.addEventListener('tracksLoaded', () => {
  enableScrollFunctionality();
  console.log('scroll activated')
});






// const onDrag = (event) => {
//   // Ensure we only do this for pointers that don't have native
//   // drag-scrolling behavior and when the pointer is down.
//   if (event.pointerType == 'mouse') {
//     scrollable.scrollLeft = elementFrom - event.clientX + pointerFrom;
//   }
// };

// scrollable.addEventListener('pointerdown', (event) => {
//   // Ensure we only do this for pointers that don't have native
//   // drag-scrolling behavior.
//   if (event.pointerType == 'mouse') {
//     pointerDown = true;
//     // Set the position where the mouse is starting to drag from.
//     pointerFrom = event.clientX;
//     // Set the position of the element is scrolled from.
//     elementFrom = scrollable.scrollLeft;
//     // React on pointer move.
//     document.addEventListener('pointermove', onDrag);
//   }
// });

// // Stop reacting on pointer move when pointer is no longer clicked.
// document.addEventListener('mouseup', (event) => {
//   // Ensure we only do this for pointers that don't have native
//   // drag-scrolling behavior.
//   if (event.pointerType == 'mouse') {
//     document.removeEventListener('pointermove', onDrag);
//   }
// });







// // Smooth wheel scrolling
// let wheeling = false;

// const smoothWheelScroll = (event) => {
//   if (!wheeling) {
//     wheeling = true;
//     const toLeft = event.deltaY < 0 && trackPlaylistCtn.scrollLeft > 0;
//     const toRight = event.deltaY > 0 && trackPlaylistCtn.scrollLeft < trackPlaylistCtn.scrollWidth - trackPlaylistCtn.clientWidth;
//     const scrollStep = 15; // Adjust this value for scrolling speed

//     const scrollByStep = () => {
//       if ((toLeft && trackPlaylistCtn.scrollLeft > 0) || (toRight && trackPlaylistCtn.scrollLeft < trackPlaylistCtn.scrollWidth - trackPlaylistCtn.clientWidth)) {
//         trackPlaylistCtn.scrollBy({ left: scrollStep * Math.sign(event.deltaY) });
//         requestAnimationFrame(scrollByStep);
//       } else {
//         wheeling = false;
//       }
//     };

//     scrollByStep();
//   }
// };

// trackPlaylistCtn.addEventListener('wheel', event => {
//   event.preventDefault();
//   smoothWheelScroll(event);
// });

// // Drag and drop scrolling
// let scrollingHorizontally = false;
// let pointerStartX = 0;
// let scrollStartX = 0;

// const onDrag = (event) => {
//   // Ensure we only do this for pointers that don't have native
//   // drag-scrolling behavior and when the pointer is down.
//   if (event.pointerType === 'mouse') {
//     event.preventDefault();
//     const dragDistance = event.clientX - pointerStartX;
//     trackPlaylistCtn.scrollLeft = scrollStartX - dragDistance;
//   }
// };

// trackPlaylistCtn.addEventListener('pointerdown', (event) => {
//   if (event.pointerType === 'mouse') {
//     // Set the position where the mouse is starting to drag from.
//     pointerStartX = event.clientX;
//     // Set the initial scroll position.
//     scrollStartX = trackPlaylistCtn.scrollLeft;
//     // React on pointer move.
//     scrollingHorizontally = true;
//   }
// });

// // Stop reacting on pointer move when pointer is no longer clicked.
// document.addEventListener('pointerup', (event) => {
//   // Ensure we only do this for pointers that don't have native
//   // drag-scrolling behavior.
//   if (event.pointerType === 'mouse') {
//     scrollingHorizontally = false;
//   }
// });

// document.addEventListener('pointermove', (event) => {
//   if (scrollingHorizontally) {
//     onDrag(event);
//   }
// });

// STICKY NAV

document.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('#about, #works, #showcase, #collabs, #contact');

  sections.forEach(section => {
      const nav = section.querySelector('#stickyNav');
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY <= sectionBottom) {
          nav.classList.add('sticky');
      } else {
          nav.classList.remove('sticky');
      }
  });
});







// let stickyNavAbout = document.querySelector('#stickyNavAbout');
// let stickySection = document.querySelector('section#about').offsetHeight;

// window.scroll(function() {
//   if( this.scrollTop() > stickySection ) {
//     stickyNavAbout.addClass('fixed');
//   } else {
//     stickyNaAbout.removeClass('fixed');
//   }
// });