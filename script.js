/* ==========================================================================
   พื้นที่ตั้งค่าข้อมูล (สามารถแก้ไขข้อความ วันที่ และรูปภาพได้ตรงนี้)
   ========================================================================== */
const CONFIG = {
  passcode: "2710",
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

if (dateBadgeEl && CONFIG.dateRangeText) {
  dateBadgeEl.textContent = CONFIG.dateRangeText;
}

const storyPagesCount = Math.max(1, pages.length - 1);
for (let i = 0; i < storyPagesCount; i++) {
  const dot = document.createElement("button");
  dot.className = `dot${i === 0 ? " on" : ""}`;
  dot.setAttribute("aria-label", `หน้า ${i + 1}`);
  dotsContainer.appendChild(dot);
}

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

  const playerEl = document.getElementById("player");

  if (currentPage === 0) {
    dotsContainer.style.display = "none";
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    if (playerEl) playerEl.style.display = "none";
  } else {
    dotsContainer.style.display = "flex";
    if (playerEl) playerEl.style.display = "flex";

    const storyIdx = currentPage - 1;
    dotsContainer.querySelectorAll(".dot").forEach((dot, idx) => {
      dot.classList.toggle("on", idx === storyIdx);
    });

    prevBtn.style.display = (currentPage > 1) ? "block" : "none";
    nextBtn.style.display = (currentPage > 1 && currentPage < pages.length - 1) ? "block" : "none";
  }

  if (currentPage === 1) spawnHearts(8);
  if (currentPage === 2) {
    if (!isGiftOpened) {
      spawnHearts(8);
    } else {
      playRevealAnimation();
    }
  }
  if (currentPage === 3) spawnHearts(8);
  if (currentPage === 4) {
    if (!isEnvelopeOpened) spawnHearts(10);
  }
}

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
  goToPage(2);
});

let triggerMusicPlayback = null;

function setupLockScreen() {
  const PASSCODE = (CONFIG.passcode || "2710").toString();
  const pinDots = document.querySelectorAll(".pin-dot");
  const pinDisplay = document.getElementById("pinDisplay");
  const lockHint = document.getElementById("lockHint");
  const hintBtn = document.getElementById("hintBtn");
  const delBtn = document.getElementById("delBtn");
  const keys = document.querySelectorAll(".key[data-num]");

  let enteredCode = "";
  let isUnlocked = false;

  function updatePinDots() {
    pinDots.forEach((dot, i) => {
      dot.classList.toggle("filled", i < enteredCode.length);
    });
  }

  function handleDigit(num) {
    if (isUnlocked || enteredCode.length >= 4) return;
    enteredCode += num;
    updatePinDots();

    if (enteredCode.length === 4) {
      if (enteredCode === PASSCODE) {
        isUnlocked = true;
        pinDisplay.classList.remove("shake");
        lockHint.textContent = "รหัสถูกต้อง ยินดีต้อนรับนะ";
        spawnConfetti(35);
        spawnHearts(18);

        if (typeof triggerMusicPlayback === "function") {
          triggerMusicPlayback();
        }

        setTimeout(() => {
          goToPage(1);
        }, 550);
      } else {
        pinDisplay.classList.add("shake");
        lockHint.textContent = "รหัสยังไม่ถูกน้า คิดดี ๆ สิ";
        setTimeout(() => {
          enteredCode = "";
          updatePinDots();
          pinDisplay.classList.remove("shake");
        }, 500);
      }
    }
  }

  function deleteDigit() {
    if (isUnlocked || enteredCode.length === 0) return;
    enteredCode = enteredCode.slice(0, -1);
    updatePinDots();
  }

  keys.forEach(btn => {
    btn.addEventListener("click", () => {
      handleDigit(btn.getAttribute("data-num"));
    });
  });

  if (delBtn) {
    delBtn.addEventListener("click", deleteDigit);
  }

  if (hintBtn) {
    let hintLevel = 0;
    const hints = [
      "คำใบ้: วันสำคัญของเราสองคน (วัน/เดือน)",
      "คำใบ้: วันที่ 27 เดือน 10",
      "คำใบ้: วันที่ตกลงเป็นแฟนกัน 2710"
    ];
    hintBtn.addEventListener("click", () => {
      hintLevel = (hintLevel + 1) % hints.length;
      lockHint.textContent = hints[hintLevel];
    });
  }

  document.addEventListener("keydown", (e) => {
    if (currentPage === 0) {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        deleteDigit();
      }
    }
  });
}

let isGiftOpened = false;

function spawnConfetti(count = 35) {
  if (prefersReducedMotion) return;
  const colors = ["#ff7fa1", "#ffd87a", "#ff9bb5", "#ffffff", "#b3637f", "#ffe3ec"];
  const rect = document.getElementById("giftBox")?.getBoundingClientRect() || {
    left: window.innerWidth / 2 - 55,
    top: window.innerHeight / 2 - 40
  };
  const startX = rect.left + 55;
  const startY = rect.top + 40;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${startX}px`;
    el.style.top = `${startY}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 240;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 40;
    const rot = (Math.random() - 0.5) * 720;

    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);
    el.style.setProperty("--rot", `${rot}deg`);
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${8 + Math.random() * 10}px`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2900);
  }
}

function setupGiftBox() {
  const giftBox = document.getElementById("giftBox");
  const giftContent = document.getElementById("giftContent");
  const giftHint = document.getElementById("giftHint");
  if (!giftBox) return;

  function openGift() {
    if (isGiftOpened) return;
    isGiftOpened = true;
    giftBox.classList.add("opened");
    giftContent.classList.add("revealed");
    if (giftHint) giftHint.textContent = "เย้ สุขสันต์วันครบรอบนะ";
    spawnConfetti(45);
    spawnHearts(18);
    playRevealAnimation();
  }

  giftBox.addEventListener("click", openGift);
  giftBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGift();
    }
  });
}

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

let isEnvelopeOpened = false;

function setupEnvelope() {
  const envelope = document.getElementById("envelope");
  const letter = document.getElementById("letter");
  const hint = document.getElementById("envelopeHint");
  const titleEl = document.querySelector(".env-title");
  
  if (!envelope || !letter) return;

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    envelope.classList.add("env-open");
    if (hint) { hint.style.opacity = "0"; hint.style.pointerEvents = "none"; }
    if (titleEl) { titleEl.style.opacity = "0"; titleEl.style.transform = "translateY(-8px)"; }

    setTimeout(() => {
      letter.classList.add("letter-peek");
    }, 450);

    setTimeout(() => {
      const letterRect = letter.getBoundingClientRect();

      const absoluteLetter = letter;
      // ย้ายกระดาษมาไว้ที่ body แทน เพื่อไม่ให้โดนจำกัดด้วย transform ของหน้าเพจ
      document.body.appendChild(absoluteLetter);

      absoluteLetter.style.position = "fixed";
      absoluteLetter.style.left = `${letterRect.left}px`;
      absoluteLetter.style.top = `${letterRect.top}px`;
      absoluteLetter.style.width = `${letterRect.width}px`;
      absoluteLetter.style.height = `${letterRect.height}px`;
      absoluteLetter.style.transform = "none";
      absoluteLetter.style.margin = "0";
      absoluteLetter.style.zIndex = "50";
      absoluteLetter.style.borderRadius = "4px 4px 0 0";
      absoluteLetter.style.transition = "all 0.72s cubic-bezier(0.4, 0, 0.2, 1)";

      envelope.classList.add("env-fade");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const letterW = Math.min(580, window.innerWidth - 24);
          const letterH = Math.min(380, Math.max(260, window.innerHeight - 40), letterW * 0.72);
          const leftPos = (window.innerWidth - letterW) / 2;
          const topPos = (window.innerHeight - letterH) / 2;

          absoluteLetter.style.left = `${leftPos}px`;
          absoluteLetter.style.top = `${topPos}px`;
          absoluteLetter.style.width = `${letterW}px`;
          absoluteLetter.style.height = `${letterH}px`;
          absoluteLetter.style.borderRadius = "1.4rem";
          absoluteLetter.style.boxShadow = "0 16px 50px rgba(122, 42, 73, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2)";
          absoluteLetter.style.overflowY = "auto";
          absoluteLetter.querySelector(".letter-inner").style.opacity = "1";
        });
      });

      spawnHearts(14);
    }, 1000);

    setTimeout(() => {
      playTypewriterAnimation();
    }, 1600);
  }

  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });
}

function playTypewriterAnimation() {
  const typedEl = document.getElementById("typed");
  if (!typedEl) return;
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
    if (charIndex >= CONFIG.message.length) clearInterval(timer);
  }, 50);

  activeTimers.push(timer);
}

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

  triggerMusicPlayback = () => {
    if (!isPlaying) {
      togglePlay();
    }
  };

  yesBtn.addEventListener("click", () => {
    if (!isPlaying) {
      togglePlay();
    }
  }, { once: true });
}

function initTapSparkleTrail() {
  if (prefersReducedMotion) return;
  const symbols = ["♥", "✦", "✧", "♥", "❤"];
  const colors = ["#ff7fa1", "#ffd87a", "#ff9bb5", "#ffffff", "#e8a9bf"];

  let lastSpawn = 0;
  function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSpawn < 45) return;
    lastSpawn = now;

    const el = document.createElement("div");
    el.className = "tap-sparkle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${0.85 + Math.random() * 0.7}rem`;

    const dx = (Math.random() - 0.5) * 36;
    const dy = -15 - Math.random() * 25;
    const rot = (Math.random() - 0.5) * 60;

    el.style.setProperty("--dx", `${dx}px`);
    el.style.setProperty("--dy", `${dy}px`);
    el.style.setProperty("--rot", `${rot}deg`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  document.addEventListener("pointerdown", (e) => {
    createSparkle(e.clientX, e.clientY);
  }, { passive: true });

  document.addEventListener("pointermove", (e) => {
    if (Math.random() < 0.22) {
      createSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });
}

initTapSparkleTrail();
setupLockScreen();
setupGiftBox();
setupEnvelope();
initMusicPlayer();
goToPage(0);