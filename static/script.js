haj()
async function haj(){
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const infocontainer = document.getElementById('info-container');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const songsinfo = document.getElementById('songsinfo');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');
const aSongs = document.getElementById('allSongs');

// Song titles
/* const songs = ['hey', 'summer', 'ukulele']; */
	/* let sings = await fetch("/getsongs")
	sings = JSON.parse(await sings.text())
	return sings */

	let response = await fetch("/getsongs");
    let data = await response.text();
    let songs = JSON.parse(data);

/* console.log("ogaboga")
console.log(songs) */

//Håller koll på vilken sång som är just nu värdet är startsånger
let songIndex = 2;
console.log("loadsongs afdw" + songs)


//Laddar låtarna som finns
loadSong(songs[songIndex]);
songsinfo.innerText = songs.name; //skriver låtarna i infoboxen

//Uppdatterar vilken låt det är och detaljerna till
function loadSong(song) {
  title.innerText = song.name;
  audio.src = `music/${song.songfile}.mp3`;
  cover.src = `images/${song.image}.jpg`;
  console.log("loadsongs" + song)
}

//Spelar låten
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

//Pausar låten
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

//Låten innan
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]);

  playSong();
}

//Nästa låt
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

let controller = 1
//tar up och ner menyn
function allsongs(){
	if(controller == 1){
		infocontainer.classList.add('down');
		aSongs.querySelector('i.fas').classList.remove('fa-sort-down');
		aSongs.querySelector('i.fas').classList.add('fa-sort-up');
		controller += 1;
	}
	else if(controller == 2){
		infocontainer.classList.remove('down');
		aSongs.querySelector('i.fas').classList.remove('fa-sort-up');
		aSongs.querySelector('i.fas').classList.add('fa-sort-down');
		controller -= 1;
	}
	else{
		console.log("fel")
	}
}

//Uppdaterar var du är i låten
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

//Sätter där du är i låten. (det som visas)
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

//tar vilken tidpunkt du är vid
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	//ändrar tiden du är på
	currTime.innerHTML = min +':'+ sec;

	//definierar var du är(tiden)(minuten)
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	//definierar sekunden du är på
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

//Byt låt
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

//uppdaterar tidpunkten
audio.addEventListener('timeupdate', updateProgress);

// där du trycker att du ska vara.(tidpunkten i låten)
progressContainer.addEventListener('click', setProgress);

//Låtens slut
audio.addEventListener('ended', nextSong);

//var du är i låten
audio.addEventListener('timeupdate',DurTime);

//tar upp/ner menyn
aSongs.addEventListener('click', allsongs);

}