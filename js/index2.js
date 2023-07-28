const playBtn = document.getElementById('playBtn');
const nextAudioBtn = document.getElementById('nextBtn');
const prevAudioBtn = document.getElementById('prevBtn');
const testSection = document.querySelector(".test-section");

let repoURL = 'https://api.github.com/repos/MarkIacovone/markiacovone-music/contents/assets/audio/';
let assetsURL = 'https://raw.githubusercontent.com/MarkIacovone/markiacovone-music/master/assets/audio/';
  
// Get files & titles from GIT repo

async function getGenreData() {
  const titleResponse = await fetch(`${repoURL}`);
  const genreData = await titleResponse.json();
  const folders = genreData.filter((item) => item.type === 'dir');
  const images = genreData.filter((item) => item.type === 'file');

  return {images, folders};
}

// FUNCTION REGARDING GENRES, DESCRIPTIONS, IMAGES AND SONG TITLES

getGenreData().then(({ images, folders }) => {

    async function createGenresAndAddEventListeners() {

        // GET IMAGES

        const imagesData = await images;
        let imgTitleArray = imagesData.map(file => file.name);
        
        for (i = 0; i < imgTitleArray.length; i++) {
          const genreImg = document.createElement("img");
          genreImg.style.cssText = "width:200px;height:200px;";
          genreImg.className = "test-item";
          genreImg.src = assetsURL + imgTitleArray[i];
          genreImg.type = "image/webp";
          testSection.appendChild(genreImg);
        }
      
        const imgArray = testSection.getElementsByTagName("img");
      
        let titleArray = imgTitleArray.map(file => {
          return file.slice(0, -5).split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join('');
        });

        // GET GENRES & ASSIGN TO BUTTONS
      
        const foldersData = await folders;
        let genreArray = foldersData.map(a => a.name
          .split(' ')
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(' '));
        
        for (i = 0; i < genreArray.length; i++) {
        const genreTitle = document.createElement("button");
        genreTitle.className = "test-button";
        genreTitle.style.cssText = "height:50px;";
        genreTitle.innerText = genreArray[i];
        testSection.appendChild(genreTitle);
        genreTitle.dataset.imgName = imgTitleArray[i]; // Store image name as a data attribute

        // CREATION & ASSIGNATION OF DESCRIPTIONS PER GENRE

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

        const genreDesc = document.createElement("div");
        genreDesc.className = "test-item";
        genreDesc.innerText = genreDescriptions[i];
        testSection.appendChild(genreDesc);

        const descArray = testSection.getElementsByTagName("div");
    
        genreTitle.addEventListener("click", async function () {
          const imgName = this.dataset.imgName; // Retrieve image name from data attribute
          const imgIndex = imgTitleArray.indexOf(imgName);
          if (imgIndex !== -1) {
            if (activeImgIndex !== null) {
                imgArray[activeImgIndex].classList.add('test-item');
                descArray[activeImgIndex].classList.add('test-item'); // Add 'test-item' class back to the previous active image
                // console.log('click');
            }
                imgArray[imgIndex].classList.remove('test-item');
                descArray[imgIndex].classList.remove('test-item');
                activeImgIndex = imgIndex;

                const genreName = genreArray[imgIndex]; // Get the selected genre name
                await displaySongTitles(genreName); // Pass the genre name as an argument

                // console.log('match');
            } 
            // else {
            //     // console.log('click');
            // }

        });

        imgArray[0].classList.remove('test-item');
        descArray[0].classList.remove('test-item');

      }
      displaySongTitles(genreArray[0]);

        // Get audio from ALL GENRES from GIT repo
        async function displaySongTitles(genreName) {
            // HERE I CAN CONSOLE LOG ACTIVE GENRE
            // console.log('Audio URL:', audioSrc);
          // console.log('Genre Name:', genreName);

          if (typeof genreName !== 'string' || genreName.trim() === '') {
            console.error('Invalid genre name:', genreName);
            return; // Return early if genreName is not valid
          }

          const previousSongs = testSection.getElementsByClassName("song-title");
          const previousAudios = testSection.getElementsByClassName("song");

          
          while (previousSongs.length > 0 && previousAudios.length > 0) {
            previousSongs[0].remove();
            previousAudios[0].remove();
          }

            const response = await fetch(`${repoURL + genreName.toLowerCase()}`);
            const data = await response.json();
            const audios = data.filter((item) => item.type === 'file');
            // HERE I CAN CONSOLE LOG AUDIOS PER GENRE
            // console.log('Audio URL:', audioSrc);
            // console.log('Audios:', audios);
                      // let songPolishedArray = data.map(a => a.name);
          const songTitleArray = audios.map(file => file.name
            .slice(0, -4)
            .split('-')
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(' '));
  
          // Create empty array that will store the genres names
          // Then -> waits for a promise which could either resolve or reject
          // can make a catch case

          let songURLArray = audios.map(file => file.name);
  
          // CREATE SONG TITLES per GENRE
  
          for (let i = 0; i < songTitleArray.length; i++) {
            const songTitle = document.createElement("p");
            songTitle.className = "song-title";
            songTitle.innerText = songTitleArray[i];
            testSection.appendChild(songTitle);
          }

          // DISPLAY AUDIO FILES per GENRE

          for (let i = 0; i < songURLArray.length; i++) {
            const songAudio = document.createElement("audio");
            songAudio.className = "song";
            songAudio.style.cssText = "height:100px;";
            songAudio.controls = true;

            const audioSrc = `${assetsURL + genreName.toLowerCase()}/${songURLArray[i]}`;
            // HERE I CAN CONSOLE LOG URLS
            // console.log('Audio URL:', audioSrc);
            songAudio.src = audioSrc;
            testSection.appendChild(songAudio);
          }
      }      
    }
    let activeImgIndex = 0;
    createGenresAndAddEventListeners();
});