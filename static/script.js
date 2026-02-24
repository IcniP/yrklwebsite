// ==========================================
// 1. NAVBAR & DROPDOWN (DIPERBAIKI)
// ==========================================
function initNavbarFeatures() {
    const triggers = document.querySelectorAll('.drop-trigger');
    const dropdowns = document.querySelectorAll('.dropdown');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/admin/';
        });
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            const parent = this.parentElement;
            const wasActive = parent.classList.contains('is-active');
            dropdowns.forEach(nav => nav.classList.remove('is-active'));
            if (!wasActive) parent.classList.add('is-active');
        });
    });

    document.addEventListener('click', () => {
        dropdowns.forEach(nav => nav.classList.remove('is-active'));
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ==========================================
// 2. STATISTICS (DIPERBAIKI UNTUK DJANGO)
// ==========================================
function loadStatsFromServer() {
    fetch('/api/stats/') // URL Django
        .then(res => res.json())
        .then(data => {
            if (document.getElementById('val-locations')) {
                document.getElementById('val-locations').innerText = data.locations;
                document.getElementById('val-years').innerText = data.years;
                document.getElementById('val-adopter').innerText = data.adopter;
                document.getElementById('val-ecosystems').innerText = data.ecosystems;
            }
        });
}

// ==========================================
// 3. 3D CORAL LOGIC (DIPERBAIKI PATH-NYA)
// ==========================================
let scene, camera, renderer, coralModel;

function init3D() {
    const container = document.getElementById('container-3d');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, -0.4, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    loadCoralModel('normal');
    animate3D();
}

function loadCoralModel(status) {
    if (coralModel) scene.remove(coralModel);
    const loader = new THREE.GLTFLoader();
    
    // PERHATIKAN: Tambahkan /static/ di depan path agar Django bisa menemukannya
    const modelPath = `/static/3d/${status}/Branchingcoral/Coral.gltf`;
    
    loader.load(modelPath, function (gltf) {
        coralModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(coralModel);
        coralModel.position.sub(box.getCenter(new THREE.Vector3()));
        scene.add(coralModel);
        console.log("Model 3D berhasil dimuat:", status);
    }, undefined, (error) => {
        console.error('Gagal memuat model 3D dari:', modelPath, error);
    });
}

function animate3D() {
    requestAnimationFrame(animate3D);
    if (coralModel) coralModel.rotation.y += 0.002;
    renderer.render(scene, camera);
}

function changeModel(status) {
    const btns = document.querySelectorAll('.status-buttons-inline .btn-3d');
    btns.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    loadCoralModel(status);
}

// ==========================================
// 4. JOIN MOVEMENT
// ==========================================
function submitMovement() {
    const emailInput = document.getElementById('user-email');
    if (!emailInput || !emailInput.value) return alert("Masukkan email Anda!");

    fetch('/api/join-movement/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        emailInput.value = '';
    });
}

// ==========================================
// 5. SLIDESHOW LOGIC (WHY CORAL & JOURNEY)
// ==========================================
function initSlideshows() {
    // Slideshow untuk Section "Why Coral Reefs Matter"
    const whySlides = document.querySelectorAll('.why-coral .slide');
    if (whySlides.length > 0) {
        let currentWhySlide = 0;
        setInterval(() => {
            whySlides[currentWhySlide].classList.remove('active');
            currentWhySlide = (currentWhySlide + 1) % whySlides.length;
            whySlides[currentWhySlide].classList.add('active');
        }, 3000); // Ganti setiap 3 detik
    }

    // Slideshow untuk Section "Follow Our Journey"
    const journeySlides = document.querySelectorAll('.journey-slide');
    const dots = document.querySelectorAll('.dot');
    if (journeySlides.length > 0) {
        let currentJourneySlide = 0;
        setInterval(() => {
            // Update Slide
            journeySlides[currentJourneySlide].classList.remove('active');
            if(dots[currentJourneySlide]) dots[currentJourneySlide].classList.remove('active');
            
            currentJourneySlide = (currentJourneySlide + 1) % journeySlides.length;
            
            journeySlides[currentJourneySlide].classList.add('active');
            if(dots[currentJourneySlide]) dots[currentJourneySlide].classList.add('active');
        }, 4000); // Ganti setiap 4 detik
    }
}

// Tambahkan initSlideshows() ke dalam Event Listener DOMContentLoaded yang sudah ada
window.addEventListener('DOMContentLoaded', () => {
    initNavbarFeatures();
    if (typeof THREE !== 'undefined') init3D();
    loadStatsFromServer();
    initSlideshows(); // Tambahkan baris ini
});