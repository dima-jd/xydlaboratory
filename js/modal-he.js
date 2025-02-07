class FullScreenGallery {
    constructor() {
        this.currentIndex = 0;
        this.startX = 0;
        this.images = [];

        // Cache DOM elements
        this.modal = document.getElementById("galleryModal");
        this.galleryContainer = document.getElementById("gallerySwipeContainer");
        this.closeButton = document.querySelector(".close-modal");

        // Bind methods
        this.close = this.close.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.prevImage = this.prevImage.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        // Add global event listeners
        this.addGlobalListeners();
    }

open(images) {
    if (!images || images.length === 0) {
        console.error("No images provided for the gallery.");
        return;
    }

    this.images = images;
    this.currentIndex = 0;

    // Clear existing images
    this.galleryContainer.innerHTML = "";

    // Populate new images
    images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = "Gallery Image " + (index + 1);
        img.classList.add("gallery-image");
        img.onload = () => console.log(`Image ${index + 1} loaded successfully: ${image}`);
        img.onerror = () => console.error(`Image ${index + 1} failed to load: ${image}`);
        this.galleryContainer.appendChild(img);
    });

    // Show modal
    this.modal.style.display = "block";

    // Adjust initial position for RTL
    if (document.documentElement.dir === "rtl") {
        this.currentIndex = this.images.length - 1; // Start at the last image for RTL
    }

    this.updateGalleryPosition();
}



    close() {
        console.log("Closing gallery");
        this.modal.style.display = "none";
    }

   nextImage() {
    if (document.documentElement.dir === "rtl") {
        // Reverse logic for RTL
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateGalleryPosition();
        } else {
            console.log("No more previous images in RTL");
        }
    } else {
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateGalleryPosition();
        } else {
            console.log("No more next images");
        }
    }
}

prevImage() {
    if (document.documentElement.dir === "rtl") {
        // Reverse logic for RTL
        if (this.currentIndex < this.images.length - 1) {
            this.currentIndex++;
            this.updateGalleryPosition();
        } else {
            console.log("No more next images in RTL");
        }
    } else {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateGalleryPosition();
        } else {
            console.log("No more previous images");
        }
    }
}


    updateGalleryPosition() {
    if (this.galleryContainer) {
        const direction = document.documentElement.dir === "rtl" ? -1 : 1;
        this.galleryContainer.style.transform = `translateX(${
            direction * -this.currentIndex * 100
        }%)`;
    }
}


    handleTouchStart(event) {
        this.startX = event.touches[0].clientX;
    }

    handleTouchEnd(event) {
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - this.startX;

        if (deltaX > 50) {
            this.prevImage();
        } else if (deltaX < -50) {
            this.nextImage();
        }
    }

    addGlobalListeners() {
        // Close modal on clicking the close button
        this.closeButton.addEventListener("click", this.close);

        // Close modal and handle keyboard navigation
        document.addEventListener("keydown", (event) => {
            if (this.modal.style.display === "block") {
                if (event.key === "ArrowRight") this.nextImage();
                if (event.key === "ArrowLeft") this.prevImage();
                if (event.key === "Escape") this.close();
            }
        });

        // Add swipe gestures for touch devices
        this.modal.addEventListener("touchstart", this.handleTouchStart, false);
        this.modal.addEventListener("touchend", this.handleTouchEnd, false);
    }
}

// Initialize the gallery globally
window.gallery = new FullScreenGallery();
