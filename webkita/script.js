
// === Modal behavior ===
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementsByClassName("close")[0];

    // Ambil semua gambar
    const images = document.querySelectorAll('.image-box img');
    const imageArray = Array.from(images).map(img => img.src);
    let currentIndex = 0;

    // Klik gambar untuk tampilkan modal
    images.forEach((img, index) => {
        img.addEventListener('click', function () {
            currentIndex = index;
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    // Tombol navigasi
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
        prevBtn.onclick = function () {
            currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
            modalImg.src = imageArray[currentIndex];
        };

        nextBtn.onclick = function () {
            currentIndex = (currentIndex + 1) % imageArray.length;
            modalImg.src = imageArray[currentIndex];
        };
    }

    // Tutup modal
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Update waktu real-time
    function updateDateTime() {
        const dateTimeElement = document.getElementById("dateTime");
        const now = new Date();
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

        const dayName = days[now.getDay()];
        const day = String(now.getDate()).padStart(2, '0');
        const month = months[now.getMonth()];
        const year = now.getFullYear();

        dateTimeElement.innerHTML = `${dayName}, ${day} ${month} ${year}`;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});

// === Background Canvas ===
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === Stars background ===
const stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        d: Math.random() * 100
    });
}

let angle = 0;
function updateStars() {
    angle += 0.01;
    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += Math.cos(angle + s.d) + 1 + s.r / 2;
        s.x += Math.sin(angle) * 2;

        if (s.x > canvas.width + 5 || s.x < -5 || s.y > canvas.height) {
            s.x = Math.random() * canvas.width;
            s.y = -10;
        }
    }
}

// === Follower stars (swarm bintang ngikutin cursor) ===
const followerStars = [];
const numFollowerStars = 0;

// Inisialisasi follower stars
for (let i = 0; i < numFollowerStars; i++) {
    followerStars.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 20,
        y: canvas.height / 2 + (Math.random() - 0.5) * 20,
        r: 2 + Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        alpha: 0.5 + Math.random() * 0.5,
        alphaSpeed: 0.01 + Math.random() * 0.02
    });
}


let cursor = { x: canvas.width / 2, y: canvas.height / 2 };

function updateFollowerStars() {
    followerStars.forEach(star => {
        const dx = cursor.x - star.x;
        const dy = cursor.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1) {
            star.x += dx * 0.08; // lebih cepat ngejar
            star.y += dy * 0.08;
        }

        // Wiggle movement (bergerak kecil terus)
        star.angle += 0.05;
        star.x += Math.cos(star.angle) * 0.5;
        star.y += Math.sin(star.angle) * 0.5;

        // Twinkle (opacity berkedip)
        star.alpha += star.alphaSpeed;
        if (star.alpha >= 1) {
            star.alpha = 1;
            star.alphaSpeed *= -1;
        }
        if (star.alpha <= 0.5) {
            star.alpha = 0.5;
            star.alphaSpeed *= -1;
        }
    });
}

function drawFollowerStars() {
    followerStars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.fill();
    });
}


// Update posisi cursor
canvas.addEventListener('mousemove', function(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
        cursor.x = e.touches[0].clientX;
        cursor.y = e.touches[0].clientY;
    }
}, { passive: true });


// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        ctx.moveTo(s.x, s.y);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    updateStars();

    // Update & draw follower stars
    updateFollowerStars();
    drawFollowerStars();

    requestAnimationFrame(animate);
}

// Responsive canvas
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});



// Start animation
animate();
