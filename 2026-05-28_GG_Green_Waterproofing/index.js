/* ==========================================
   GG Green Waterproofing Premium JS Logic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Force scroll to top on load/reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Header Scroll Effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Drawer
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');

    const openDrawer = () => {
        mobileDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));

    // 4. Scroll Triggered Fade-in-up Animations
    const animatedElements = document.querySelectorAll('.review-card, .service-card, .why-card, .form-card, .hero-content, .trust-bar');
    
    // Add custom class for animation preparation
    animatedElements.forEach(el => el.classList.add('fade-in-up-trigger'));

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // 5. Image Drag and Drop & Preview Setup
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('photo');
    const previewArea = document.getElementById('previewArea');
    const imagePreview = document.getElementById('imagePreview');
    const removePreview = document.getElementById('removePreview');
    const dropzonePrompt = document.querySelector('.dropzone-prompt');

    // Drag events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
        }, false);
    });

    // Handle dropped files
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            handleFile(files[0]);
        }
    });

    // Handle file selection via input click
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Process and validate the selected image
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            clearFileInput();
            return;
        }

        // Limit size to 10MB
        if (file.size > 10 * 1024 * 1024) {
            alert('파일 용량은 최대 10MB를 초과할 수 없습니다.');
            clearFileInput();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            dropzonePrompt.style.display = 'none';
            previewArea.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    // Remove preview image
    removePreview.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearFileInput();
    });

    function clearFileInput() {
        fileInput.value = '';
        imagePreview.src = '';
        previewArea.style.display = 'none';
        dropzonePrompt.style.display = 'block';
    }

    // 6. Serverless Form Submission Handling
    const form = document.getElementById('waterproofForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = form.querySelector('.btn-text');
    const loader = form.querySelector('.loader');

    // Success Modal Elements
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalName = document.getElementById('modalName');
    const modalPhone = document.getElementById('modalPhone');
    const modalLocation = document.getElementById('modalLocation');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Custom Validation
        let isValid = true;
        const nameVal = document.getElementById('name').value.trim();
        const phoneVal = document.getElementById('phone').value.trim();
        const locationVal = document.getElementById('location').value;
        const agreeVal = document.getElementById('agree').checked;

        // Reset errors
        document.querySelectorAll('.error-feedback').forEach(el => el.style.display = 'none');

        // Name Check
        if (!nameVal) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        // Phone Check (Basic pattern check)
        const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
        const phoneClean = phoneVal.replace(/[^0-9]/g, '');
        // format input user typed to include hyphens
        let formattedPhone = phoneVal;
        if (phoneClean.length >= 9 && phoneClean.length <= 11) {
            formattedPhone = phoneClean.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        }

        if (!phoneClean || phoneClean.length < 9) {
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }

        // Location Check
        if (!locationVal) {
            document.getElementById('locationError').style.display = 'block';
            isValid = false;
        }

        // Agreement Check
        if (!agreeVal) {
            document.getElementById('agreeError').style.display = 'block';
            isValid = false;
        }

        if (!isValid) {
            // Scroll to the first error
            const firstError = document.querySelector('.error-feedback[style="display: block;"]');
            if (firstError) {
                firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Submit Simulation (Serverless optimization)
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'inline-block';

        // Simulate 1.5 seconds network delay
        setTimeout(() => {
            // Save data to LocalStorage to mock database entry
            const submissionData = {
                id: Date.now(),
                name: nameVal,
                phone: formattedPhone,
                location: locationVal,
                notes: document.getElementById('notes').value.trim(),
                timestamp: new Date().toISOString(),
                hasPhoto: !!fileInput.files.length
            };

            // Retrieve existing submissions and append
            const currentLeads = JSON.parse(localStorage.getItem('waterproof_leads') || '[]');
            currentLeads.push(submissionData);
            localStorage.setItem('waterproof_leads', JSON.stringify(currentLeads));

            // Populate and Show Success Modal
            modalName.textContent = nameVal;
            modalPhone.textContent = formattedPhone;
            modalLocation.textContent = locationVal;

            // Reset Loading Status
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            loader.style.display = 'none';

            // Show modal
            successModal.classList.add('active');

            // Reset Form and file upload
            form.reset();
            clearFileInput();
        }, 1500);
    });

    // Close success modal
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close modal clicking outside the modal-card
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
});
