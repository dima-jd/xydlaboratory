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

    // Clear existing images in the container
    this.galleryContainer.innerHTML = "";

    // Populate new images
    images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = "Gallery Image " + (index + 1);
        img.classList.add("gallery-image");
        this.galleryContainer.appendChild(img);
    });

    // Show modal
    this.modal.style.display = "block";
    this.updateGalleryPosition();
}


    close() {
        console.log("Closing gallery");
        this.modal.style.display = "none";
    }

    nextImage() {
    if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this.updateGalleryPosition();
    } else {
        console.log("No more next images");
    }
}

prevImage() {
    if (this.currentIndex > 0) {
        this.currentIndex--;
        this.updateGalleryPosition();
    } else {
        console.log("No more previous images");
    }
}

    updateGalleryPosition() {
    if (this.galleryContainer) {
        this.galleryContainer.style.transform = `translateX(-${this.currentIndex * 100}%)`;
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
