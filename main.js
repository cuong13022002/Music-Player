/**
 * Render songs => ok
 * Scroll top => ok
 * Play/pause/seek => 
 * CD rotate
 * Next /prev
 * Random
 * Next/ Repeat when ended
 * Active song
 * Scroll active song into view
 * Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')   
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
          
          name: "Lỗi tại anh",
          singer: "Alex Lam",
          path: "./music/LỖI TẠI ANH.mp3",
          image: "./image/Lỗi tại anh.jpg"
        },
        {
          name: "Chúng ta của hiện tại ",
          singer: "Sơn Tùng MTP",
          path: "./music/SƠN TÙNG M-TP _ CHÚNG TA CỦA HIỆN TẠI.mp3",
          image:
            "./image/Chúng ta của hiện tại.jpg"
        },
        
        {
          name: "Phía sau một cô gái",
          singer: "Soobin Hoàng Sơn",
          path: "./music/Phía Sau Một Cô Gái.mp3",
          image: "./image/Phía sau một cô gái.jpg"
        },
        
        {
          name: "Thất Tình",
          singer: "Trịnh Đình Quang",
          path: "./music/Thất Tình.mp3",
          image: "./image/Thất tình.jpg"
        }
      ],
      render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' :""}">
                <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
             </div>
            `
        })
        $('.playlist').innerHTML =  htmls.join('\n');
      },
      defineProperties: function(){
            Object.defineProperty(this,'currentSong',{
                get: function(){
                    return this.songs[this.currentIndex]
                }
            })
      },

      handleEvents: function(){
        const _this = this 
        const cdWidth = cd.offsetWidth 

        // Xử lí cd quay và dừng

        const cdThumbAnimate = cdThumb.animate([
          { transform : 'rotate(360deg)'}
        ],{
            duration: 10000, // 10 seconds
            iterations : Infinity
        })
        cdThumbAnimate.pause()

        // Xu li phong to thu nho cd
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.screenY ;
            const newWidth = cdWidth - scrollTop ;
            cd.style.width = newWidth > 0 ? newWidth + 'px': 0 ;
            cd.style.opacity = newWidth/cdWidth;

        }

        // Xu li khi click play

        playBtn.onclick = function(){
          if(_this.isPlaying){
            audio.pause()
          }else{
            audio.play()
          }
        }

        //  khi song duoc chay
        audio.onplay = function(){
          _this.isPlaying = true 
          player.classList.add('playing')
          cdThumbAnimate.play()
        }
        //  khi song pause
        audio.onpause = function(){
          _this.isPlaying = false 
          player.classList.remove('playing')
          cdThumbAnimate.pause()
        }

        // khi tien do bai hat thay đổi
        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
          }
        }

        //Xử lí khi tua
        progress.onchange = function (e){

          const seekTime = audio.duration /100 * e.target.value
          audio.currentTime =  seekTime
        }


        //  Khi next song
        nextBtn.onclick = function(){
          if(_this.isRandom){

            _this.playRandomSong()
          }else{
            _this.nextSong()
          }
          audio.play()
         _this.render()
         _this.scrollToActiveSong()
        }
        //  Khi prev song
        prevBtn.onclick = function(){
          if(_this.isRandom){

            _this.playRandomSong()
          }else{
            _this.prevSongSong()
          }
          audio.play()
          _this.render()
        }
        // xử lí random bật tắt
        randomBtn.onclick = function(e){
          _this.isRandom = !_this.isRandom
          randomBtn.classList.toggle('active',_this.isRandom)
        }
        // Xử lý lặp lại 1 song
        repeatBtn.onclick = function(e){
          _this.isRepeat = !_this.isRepeat
          repeatBtn.classList.toggle('active',_this.isRepeat)
        },
        //xử lí next song khi audio ended
        audio.onended = function(){
          if(_this.isRepeat){
            audio.play()
          }else{

            nextBtn.click()
          }
        }
      } ,

      scrollToActiveSong: function(){
        setTimeout(() => {
          $('.song.active').scrollIntoView()
        },500)
      },

      loadCurrentSong: function (){
          
          heading.textContent = this.currentSong.name
          cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
          audio.src = this.currentSong.path
          // console.log(heading,cdThumb,audio)
      },
      // Khi next song
      nextSong :function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
          this.currentSong = 0
        }
        this.loadCurrentSong()
      },
      // Khi prev song
      prevSong :function(){
        this.currentIndex--
        if(this.currentIndex < 0){
          this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
      },
      playRandomSong: function(){
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex =newIndex
        this.loadCurrentSong()
      },
      // repeatSong : function(){
      //   this.setAttribute()
      //   this.loadCurrentSong();
      // },

      start: function (){
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // lang nghe cac su kien
        this.handleEvents()

        // Tai bia hat dau tien vao UI 
        this.loadCurrentSong()

        // render playlist
        this.render()
      }
}

app.start();