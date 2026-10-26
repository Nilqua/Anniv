/* ==========================================================================
   พื้นที่ตั้งค่าข้อมูล (สามารถแก้ไขข้อความ วันที่ และรูปภาพได้ตรงนี้)
   ========================================================================== */
const CONFIG = {
  // เพลงประกอบ: ใส่ชื่อไฟล์ เช่น "song.mp3" หรือลิงก์ YouTube เช่น "https://www.youtube.com/watch?v=..."
  musicSource: "bgm.mp3",
  musicTitle: "OFFONOFF - 춤",
  years: 6,
  dateRangeText: "27 ต.ค. 2020 ❤ 27 ต.ค. 2026",
  memoriesPhotos: [
    "img/3-1.jpg",
    "img/3-2.jpg",
    "img/3-3.jpg",
    "img/3-4.jpg",
    "img/3-5.jpg",
    "img/3-6.jpg",
    "img/3-7.jpg"
  ],
  message: "ขอบคุณนะที่อยู่ด้วยกันมาตลอด 6 ปีที่ผ่านมา ขอโทษด้วยนะเรื่องที่ทำผิดไปหรือทำให้ไม่พอใจ แต่เค้าขอบคุณสำหรับทุกความทรงจำนะ เราอาจจะทะเลาะกันบ้าง แต่เค้าขอบคุณนะที่คอยคุยกันแล้วปรับความเข้าใจกันเสมอ ปีนี้อาจจะไม่ได้มีของขวัญอะไรให้ แต่เค้าอยากขอบคุณเธอจริงๆนะที่คอยอยู่ด้วยกัน หลังจากนี้เค้าก็อยากให้เราอยู่ด้วยกันไปนานๆนะ ❤",
  photos: [
    "img/4-1.jpg",
    "img/4-2.jpg",
    "img/4-3.jpg",
    "img/4-4.jpg"
    // รูปภาพสำหรับหน้าสุดท้าย
  ],
  dodgeHints: [
    "ลองอีกทีสิ",
    "คิดดี ๆ นะ",
    "ใกล้แล้วนะ",
    "ยังจะไม่รู้อีกเหรอ",
    "เหลือปุ่มเดียวแล้วนะ"
  ]
};

/* ==========================================================================
   ตรรกะการทำงานของหน้าเว็บ
   ========================================================================== */
const pages = document.querySelectorAll(".page");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const hintText = document.getElementById("hint");
const typedEl = document.getElementById("typed");
const dateBadgeEl = document.getElementById("dateBadge");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentPage = 0;
let dodgeCount = 0;
let activeTimers = [];

// กำหนดข้อความช่วงวันที่เริ่มต้น
if (dateBadgeEl && CONFIG.dateRangeText) {
  dateBadgeEl.textContent = CONFIG.dateRangeText;
}

// สร้างจุดบอกตำแหน่งหน้า (dots)
pages.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.className = `dot${index === 0 ? " on" : ""}`;
  dot.setAttribute("aria-label", `หน้า ${index + 1}`);
  dotsContainer.appendChild(dot);
});

// เอฟเฟกต์หัวใจลอยขึ้นมา
function spawnHearts(count = 15) {
  if (prefersReducedMotion) return;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "h";
    heart.textContent = "♥";
    heart.style.left = `${Math.random() * 92}vw`;
    heart.style.fontSize = `${1 + Math.random() * 1.6}rem`;
    heart.style.animationDelay = `${Math.random() * 0.7}s`;
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 3200);
  }
}

// ฟังก์ชันเปลี่ยนหน้า
function goToPage(targetIndex) {
  activeTimers.forEach(id => {
    clearTimeout(id);
    clearInterval(id);
  });
  activeTimers = [];

  currentPage = Math.max(0, Math.min(pages.length - 1, targetIndex));

  pages.forEach((page, idx) => {
    page.classList.toggle("on", idx === currentPage);
  });

  dotsContainer.querySelectorAll(".dot").forEach((dot, idx) => {
    dot.classList.toggle("on", idx === currentPage);
  });

  prevBtn.style.display = (currentPage > 0) ? "block" : "none";
  nextBtn.style.display = (currentPage > 0 && currentPage < pages.length - 1) ? "block" : "none";

  if (currentPage === 1) playRevealAnimation();
  if (currentPage === 2) spawnHearts(8);
  if (currentPage === 3) {
    playTypewriterAnimation();
    spawnHearts(14);
  }
}

// หน้า 1: ปุ่ม "ไม่รู้" วิ่งหนีเมื่อถูกแตะหรือชี้
function dodgeButton(e) {
  if (e) e.preventDefault();
  dodgeCount++;

  const randomX = (Math.random() - 0.5) * 220;
  const randomY = (Math.random() - 0.5) * 160;
  const scaleDown = Math.max(0.4, 1 - dodgeCount * 0.12);
  const scaleUp = 1 + dodgeCount * 0.14;

  noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(${scaleDown})`;
  yesBtn.style.transform = `scale(${scaleUp})`;

  const hintIndex = Math.min(dodgeCount - 1, CONFIG.dodgeHints.length - 1);
  hintText.textContent = CONFIG.dodgeHints[hintIndex];

  if (dodgeCount >= 5) {
    noBtn.style.display = "none";
  }
}

noBtn.addEventListener("pointerdown", dodgeButton);
noBtn.addEventListener("mouseenter", (e) => {
  if (window.matchMedia("(hover: hover)").matches) dodgeButton(e);
});
noBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter") dodgeButton(e);
});

yesBtn.addEventListener("click", () => {
  spawnHearts(18);
  goToPage(1);
});

// หน้า 2: นับจำนวนปี
function playRevealAnimation() {
  spawnHearts(16);
  const numEl = document.getElementById("num");
  const targetYears = CONFIG.years;

  if (prefersReducedMotion) {
    numEl.textContent = targetYears;
    return;
  }

  let currentVal = 0;
  numEl.textContent = "0";

  const timer = setInterval(() => {
    currentVal++;
    numEl.textContent = currentVal;
    if (currentVal >= targetYears) {
      clearInterval(timer);
    }
  }, 200);

  activeTimers.push(timer);
}

// หน้า 3: แอนิเมชันพิมพ์ข้อความทีละตัวอักษร
function playTypewriterAnimation() {
  typedEl.style.whiteSpace = "pre-line";

  if (prefersReducedMotion) {
    typedEl.textContent = CONFIG.message;
    return;
  }

  typedEl.textContent = "";
  let charIndex = 0;

  const timer = setInterval(() => {
    charIndex++;
    typedEl.textContent = CONFIG.message.slice(0, charIndex);
    if (charIndex >= CONFIG.message.length) {
      clearInterval(timer);
    }
  }, 65);

  activeTimers.push(timer);
}

// แสดงกรอบโพลารอยด์
function renderGrid(containerId, photosList, defaultCount = 4) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = "";
  const totalFrames = Math.max(defaultCount, photosList.length);

  for (let i = 0; i < totalFrames; i++) {
    const frame = document.createElement("div");
    frame.className = "pol";

    const placeholder = document.createElement("div");
    placeholder.className = "ph";

    if (photosList[i]) {
      const img = document.createElement("img");
      img.src = photosList[i];
      img.alt = `ความทรงจำ ${i + 1}`;
      placeholder.appendChild(img);
    } else {
      placeholder.textContent = "♥";
    }

    frame.appendChild(placeholder);
    grid.appendChild(frame);
  }
}

renderGrid("gridMemories", CONFIG.memoriesPhotos, 4);
renderGrid("grid", CONFIG.photos, 4);

// ระบบควบคุมการเปลี่ยนหน้า (ปุ่ม, คีย์บอร์ด, ปัดหน้าจอ)
prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
nextBtn.addEventListener("click", () => goToPage(currentPage + 1));

document.addEventListener("keydown", (e) => {
  if (currentPage > 0 && (e.key === "ArrowRight" || e.key === " ")) {
    goToPage(currentPage + 1);
  } else if (e.key === "ArrowLeft") {
    goToPage(currentPage - 1);
  }
});

let touchStartX = null;
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (touchStartX === null || currentPage === 0) return;
  const touchDeltaX = e.changedTouches[0].clientX - touchStartX;
  touchStartX = null;

  if (touchDeltaX < -50) goToPage(currentPage + 1);
  else if (touchDeltaX > 50) goToPage(currentPage - 1);
}, { passive: true });

/* ==========================================================================
   ระบบเล่นเพลง (รองรับทั้งไฟล์ในเครื่องและ YouTube)
   ========================================================================== */
function initMusicPlayer() {
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const playerTitle = document.getElementById("playerTitle");
  const equalizer = document.getElementById("equalizer");
  const audioEl = document.getElementById("audio-player");
  const playerContainer = document.getElementById("player");

  if (!playBtn) return;

  if (CONFIG.musicTitle && playerTitle) {
    playerTitle.textContent = CONFIG.musicTitle;
  }

  const src = (CONFIG.musicSource || "").trim();
  if (!src) {
    if (playerTitle) playerTitle.textContent = "ยังไม่ได้ระบุเพลง";
    playBtn.addEventListener("click", () => {
      alert("กรุณาระบุไฟล์เพลงหรือลิงก์ YouTube ในตัวแปร CONFIG.musicSource ของ script.js ค่ะ");
    });
    return;
  }

  let isPlaying = false;
  let ytPlayer = null;
  let isYouTube = false;

  function getYouTubeId(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  const ytId = getYouTubeId(src);

  function updateUI(playing) {
    isPlaying = playing;
    playIcon.innerHTML = playing ? "&#10074;&#10074;" : "&#9654;";
    equalizer.classList.toggle("playing", playing);
  }

  if (ytId) {
    isYouTube = true;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytPlayer = new YT.Player("yt-container", {
        height: "1",
        width: "1",
        videoId: ytId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: ytId
        },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              updateUI(true);
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              updateUI(false);
            }
          }
        }
      });
    };
  } else {
    audioEl.src = src;
    audioEl.loop = true;
    audioEl.addEventListener("play", () => updateUI(true));
    audioEl.addEventListener("pause", () => updateUI(false));
    audioEl.addEventListener("ended", () => updateUI(false));
  }

  function togglePlay() {
    if (isYouTube) {
      if (!ytPlayer || typeof ytPlayer.playVideo !== "function") return;
      if (isPlaying) {
        ytPlayer.pauseVideo();
      } else {
        ytPlayer.playVideo();
      }
    } else {
      if (isPlaying) {
        audioEl.pause();
      } else {
        audioEl.play().catch(err => {
          console.warn("Autoplay blocked:", err);
        });
      }
    }
  }

  playBtn.addEventListener("click", togglePlay);

  // ควบคุมระดับเสียง (Volume & Mute)
  const volSlider = document.getElementById("volSlider");
  const muteBtn = document.getElementById("muteBtn");
  let previousVolume = 0.3;

  audioEl.volume = 0.3;

  if (volSlider) {
    volSlider.value = 0.3;
    volSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      audioEl.volume = val;
      if (isYouTube && ytPlayer && typeof ytPlayer.setVolume === "function") {
        ytPlayer.setVolume(val * 100);
      }
      if (val > 0) previousVolume = val;
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      if (audioEl.volume > 0) {
        previousVolume = audioEl.volume;
        audioEl.volume = 0;
        if (volSlider) volSlider.value = 0;
        if (isYouTube && ytPlayer && typeof ytPlayer.mute === "function") ytPlayer.mute();
      } else {
        const restoreVal = previousVolume || 0.3;
        audioEl.volume = restoreVal;
        if (volSlider) volSlider.value = restoreVal;
        if (isYouTube && ytPlayer && typeof ytPlayer.unMute === "function") {
          ytPlayer.unMute();
          ytPlayer.setVolume(restoreVal * 100);
        }
      }
    });
  }

  // เริ่มเล่นเพลงอัตโนมัติเมื่อกด "รู้สิ" ในหน้าแรก
  yesBtn.addEventListener("click", () => {
    if (!isPlaying) {
      togglePlay();
    }
  }, { once: true });
}

initMusicPlayer();
