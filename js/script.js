document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONTADOR DE TIEMPO EN VIVO
    // ==========================================
    let startDate = new Date('2025-11-14T18:00:00'); 
 
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');
    const dateInput = document.getElementById('startDateInput');
 
    if (dateInput) {
        dateInput.value = startDate.toISOString().split('T')[0];
        dateInput.addEventListener('change', (e) => {
            if (e.target.value) {
                startDate = new Date(e.target.value + 'T00:00:00');
                updateCounter();
            }
        });
    }
 
    function updateCounter() {
        const now = new Date();
        const diff = Math.max(0, now - startDate);
 
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
 
        if (elDays) elDays.textContent = String(days).padStart(2, '0');
        if (elHours) elHours.textContent = String(hours).padStart(2, '0');
        if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
        if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
    }
 
    setInterval(updateCounter, 1000);
    updateCounter();
 
 
    // ==========================================
    // 2. REPRODUCTOR DE "NUESTRA CANCIÓN"
    // ==========================================
    const songBtn = document.getElementById('songToggleBtn');
    const bgSong = document.getElementById('bgSong');

    if (songBtn && bgSong) {
        songBtn.addEventListener('click', () => {
            if (bgSong.paused) {
                bgSong.play().then(() => {
                    songBtn.textContent = '⏸ Pausar canción';
                    songBtn.classList.add('active-song');
                }).catch(error => {
                    console.log("Error al reproducir audio:", error);
                    alert("Asegúrate de que el archivo de audio esté en la ruta correcta.");
                });
            } else {
                bgSong.pause();
                songBtn.textContent = 'Nuestra canción';
                songBtn.classList.remove('active-song');
            }
        });
    }


    // ==========================================
    // 3. CARRUSEL DE FOTOS ESTILO POLAROID
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('carouselDots');
    const addPhotoInput = document.getElementById('addPhotoInput');
    const changePhotoInput = document.getElementById('changePhotoInput');
 
    let currentIndex = 0;
    let slides = Array.from(document.querySelectorAll('.carousel-slide'));
 
    function renderDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `dot ${idx === currentIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir a la foto ${idx + 1}`);
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });
    }
 
    function goToSlide(index) {
        if (slides.length === 0) return;
        currentIndex = (index + slides.length) % slides.length;
        if (track) {
            // Línea corregida con el multiplicador (*)
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        renderDots();
    }
 
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
 
    // Soporte táctil en celular (Touch / Swipe)
    let touchStartX = 0;
    let touchEndX = 0;
 
    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
 
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
 
    function handleSwipe() {
        const swipeThreshold = 45;
        if (touchStartX - touchEndX > swipeThreshold) {
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            goToSlide(currentIndex - 1);
        }
    }
 
    // Cambiar la foto actual del carrusel
    if (changePhotoInput) {
        changePhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
 
            const reader = new FileReader();
            reader.onload = (event) => {
                const currentImg = slides[currentIndex].querySelector('img');
                if (currentImg) currentImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }
 
    // Añadir una nueva diapositiva con foto propia
    if (addPhotoInput && track) {
        addPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
 
            const reader = new FileReader();
            reader.onload = (event) => {
                const newSlide = document.createElement('div');
                newSlide.className = 'carousel-slide';
                newSlide.innerHTML = `
                    <div class="polaroid-card">
                        <div class="polaroid-img-wrapper">
                            <img src="${event.target.result}" alt="Nuestro recuerdo">
                        </div>
                        <div class="polaroid-caption">
                            <h3>Un momento especial</h3>
                            <p>Un recuerdo inolvidable a tu lado.</p>
                            <span class="polaroid-date">Hoy • Nuestro recuerdo</span>
                        </div>
                    </div>
                `;
                track.appendChild(newSlide);
                slides = Array.from(document.querySelectorAll('.carousel-slide'));
                goToSlide(slides.length - 1);
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }
 
    renderDots();
 
 
    // ==========================================
    // 4. TARJETAS GIRATORIAS (FLIP CARDS)
    // ==========================================
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
 
 
    // ==========================================
    // 5. SOBRE INTERACTIVO (ABRIR / CERRAR CARTA)
    // ==========================================
    const envelope = document.getElementById('loveEnvelope');
    const toggleLetterBtn = document.getElementById('toggleLetterBtn');
 
    function toggleEnvelope() {
        if (!envelope) return;
        envelope.classList.toggle('open');
        if (toggleLetterBtn) {
            toggleLetterBtn.textContent = envelope.classList.contains('open') 
                ? 'Cerrar carta' 
                : 'Abrir carta';
        }
    }
 
    if (envelope) envelope.addEventListener('click', toggleEnvelope);
    if (toggleLetterBtn) {
        toggleLetterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEnvelope();
        });
    }
 
 
    // ==========================================
    // 6. CUPONERA CANJEABLE
    // ==========================================
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.coupon-card');
            if (!card) return;
            
            const isRedeemed = card.classList.toggle('redeemed');
            btn.textContent = isRedeemed ? '¡Canjeado! ♥' : 'Canjear vale';
        });
    });


    // ==========================================
    // 7. MODAL DEL EMOTE CHIBI
    // ==========================================
    const chibiBtn = document.getElementById('chibiBtn');
    const chibiModal = document.getElementById('chibiModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (chibiBtn && chibiModal) {
        chibiBtn.addEventListener('click', () => {
            chibiModal.style.display = 'flex';
        });
    }

    if (closeModalBtn && chibiModal) {
        closeModalBtn.addEventListener('click', () => {
            chibiModal.style.display = 'none';
        });
    }

    // Permitir cerrar el modal si hacen clic fuera de la cajita blanca
    if (chibiModal) {
        chibiModal.addEventListener('click', (e) => {
            if (e.target === chibiModal) {
                chibiModal.style.display = 'none';
            }
        });
    }

    // ==========================================
    // REPRODUCTOR DE LA CANCIÓN EXTRA
    // ==========================================
    const extraSongBtn = document.getElementById('extraSongBtn');
    const extraSong = document.getElementById('extraSong');

    if (extraSongBtn && extraSong) {
        extraSongBtn.addEventListener('click', () => {
            if (extraSong.paused) {
                extraSong.play().then(() => {
                    extraSongBtn.textContent = '⏸ Pausar canción';
                    extraSongBtn.classList.add('active-song');
                }).catch(error => {
                    console.log("Error al reproducir audio:", error);
                    alert("Asegúrate de que el archivo de audio esté en la ruta correcta.");
                });
            } else {
                extraSong.pause();
                extraSongBtn.textContent = '♪ Reproducir canción especial';
                extraSongBtn.classList.remove('active-song');
            }
        });
    }
});