/* ==========================================
   SCRIPT.JS - YRKL WEBSITE (FULL OPTIMIZED)
   ========================================== */

// 1. INISIALISASI NAVIGASI & LOGIN
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.getElementById('login-btn');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Link Login ke Admin
    if (loginBtn) {
        loginBtn.style.cursor = "pointer";
        loginBtn.onclick = () => { window.location.href = '/admin/'; };
    }

    // Mobile Hamburger Menu
    if (hamburger && navLinks) {
        hamburger.onclick = (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        };
    }

    // Dropdown Logic (Click to Open)
    document.querySelectorAll('.drop-trigger').forEach(trigger => {
        trigger.onclick = (e) => {
            e.stopPropagation();
            const parent = trigger.parentElement;
            const wasActive = parent.classList.contains('is-active');

            // Tutup dropdown lain yang sedang terbuka
            dropdowns.forEach(d => d.classList.remove('is-active'));
            
            // Toggle dropdown yang diklik
            if (!wasActive) parent.classList.add('is-active');
        };
    });

    // Klik di luar untuk menutup semua menu
    document.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('is-active'));
        if (navLinks) navLinks.classList.remove('active');
    });
}

// 2. LOGIKA STATISTIK (DARI DATABASE DJANGO)
function loadStats() {
    const statElements = ['val-locations', 'val-years', 'val-adopter', 'val-ecosystems'];
    const exists = statElements.some(id => document.getElementById(id));
    
    if (exists) {
        fetch('/api/stats/')
            .then(res => res.json())
            .then(data => {
                statElements.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.innerText = data[id.replace('val-', '')] || 0;
                });
            })
            .catch(err => console.error("Gagal memuat statistik:", err));
    }
}

// 3. LOGIKA 3D CORAL (THREE.JS)
let scene, camera, renderer, coralModel;

function init3D() {
    const container = document.getElementById('container-3d');
    if (!container || typeof THREE === 'undefined') return;

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
    // Path absolut menggunakan /static/ agar tidak error di halaman sub-url
    const modelPath = `/static/3d/${status}/Branchingcoral/Coral.gltf`;

    loader.load(modelPath, (gltf) => {
        coralModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(coralModel);
        coralModel.position.sub(box.getCenter(new THREE.Vector3()));
        scene.add(coralModel);
    }, undefined, (err) => console.error("Model error:", modelPath, err));
}

function animate3D() {
    requestAnimationFrame(animate3D);
    if (coralModel) coralModel.rotation.y += 0.002;
    renderer.render(scene, camera);
}

function changeModel(status) {
    document.querySelectorAll('.btn-3d').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    loadCoralModel(status);
}

// 4. LOGIKA SLIDESHOW (WHY CORAL & JOURNEY)
function initSlideshows() {
    const runSlides = (selector, interval) => {
        const slides = document.querySelectorAll(selector);
        const dots = document.querySelectorAll('.dot');
        if (slides.length <= 1) return;

        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            if (dots[current] && selector.includes('journey')) dots[current].classList.remove('active');
            
            current = (current + 1) % slides.length;
            
            slides[current].classList.add('active');
            if (dots[current] && selector.includes('journey')) dots[current].classList.add('active');
        }, interval);
    };

    runSlides('.why-coral .slide', 3000);
    runSlides('.journey-slide', 4000);
}

// 5. JOIN MOVEMENT (POST TO DJANGO)
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

// EXECUTION ON LOAD
window.addEventListener('load', () => {
    initNavbar();
    init3D();
    loadStats();
    initSlideshows();
});