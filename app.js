document.addEventListener('DOMContentLoaded', () => {
    // --- Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            target.classList.add('active');
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('viewer-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.getElementById('close-modal');
    const cards = document.querySelectorAll('.card');

    // Sidebar elements
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarDesc = document.getElementById('sidebar-desc');
    const sidebarPoints = document.getElementById('sidebar-points');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.dataset.img;
            modalImg.src = imgSrc;
            
            // Populate sidebar
            sidebarTitle.textContent = card.dataset.title;
            sidebarDesc.textContent = card.dataset.desc;
            
            // Parse points and create list items
            sidebarPoints.innerHTML = '';
            try {
                const points = JSON.parse(card.dataset.points);
                points.forEach(point => {
                    const li = document.createElement('li');
                    li.textContent = point;
                    sidebarPoints.appendChild(li);
                });
            } catch (e) {
                console.error('Error parsing points data', e);
            }

            resetZoomPan();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'pan-container') {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
        setTimeout(() => { modalImg.src = ''; }, 300);
    }

    // --- Zoom and Pan Logic ---
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');

    function updateTransform() {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetZoomPan() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    zoomInBtn.addEventListener('click', () => {
        scale = Math.min(scale + 0.5, 5);
        updateTransform();
    });

    zoomOutBtn.addEventListener('click', () => {
        scale = Math.max(scale - 0.5, 0.5);
        updateTransform();
    });

    resetZoomBtn.addEventListener('click', resetZoomPan);

    // Mouse drag to pan
    modalImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mouse wheel to zoom
    modalImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            scale = Math.min(scale + 0.1, 5);
        } else {
            scale = Math.max(scale - 0.1, 0.5);
        }
        updateTransform();
    });
});
