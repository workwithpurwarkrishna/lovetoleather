// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle")
const mainNav = document.getElementById("mainNav")

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active")
    menuToggle.classList.toggle("active")

    // Toggle aria-expanded attribute for accessibility
    const isExpanded = mainNav.classList.contains("active")
    menuToggle.setAttribute("aria-expanded", isExpanded)
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains("active")) {
      mainNav.classList.remove("active")
      menuToggle.classList.remove("active")
      menuToggle.setAttribute("aria-expanded", false)
    }
  })
}

// Language Switcher
const langToggle = document.getElementById("langToggle")

if (langToggle) {
  langToggle.addEventListener("click", () => {
    // Get the current language
    const currentLang = document.documentElement.lang

    // Toggle between languages
    if (currentLang === "en") {
      // Switch to German
      document.documentElement.lang = "de"

      // Store the language preference
      localStorage.setItem("preferredLanguage", "de")

      // Redirect to German version if it exists, otherwise stay on same page
      const germanPage = window.location.pathname.replace(".html", ".de.html")
      if (germanPage !== window.location.pathname) {
        window.location.href = germanPage
      }
    } else {
      // Switch to English
      document.documentElement.lang = "en"

      // Store the language preference
      localStorage.setItem("preferredLanguage", "en")

      // Redirect to English version
      const englishPage = window.location.pathname.replace(".de.html", ".html")
      if (englishPage !== window.location.pathname) {
        window.location.href = englishPage
      }
    }
  })

  // Set initial language based on stored preference
  document.addEventListener("DOMContentLoaded", () => {
    const storedLang = localStorage.getItem("preferredLanguage")
    if (storedLang) {
      document.documentElement.lang = storedLang
    }
  })
}

// Hero Slider (Fade Transition)
const slides = document.querySelectorAll(".hero-slider .slide")
let currentSlide = 0

function showNextSlide() {
  if (!slides.length) return

  slides[currentSlide].classList.remove("active")
  currentSlide = (currentSlide + 1) % slides.length
  slides[currentSlide].classList.add("active")
}

if (slides.length > 0) {
  // Set initial slide
  slides[0].classList.add("active")

  // Start slideshow
  setInterval(showNextSlide, 5000) // Change every 5 seconds
}

// Image Carousels
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".image-carousel")

  carousels.forEach((carousel, carouselIndex) => {
    const slides = carousel.querySelectorAll(".carousel-slide")
    const dotsContainer = carousel.querySelector(".carousel-dots")

    // Create dots for each slide
    slides.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("carousel-dot")
      if (index === 0) dot.classList.add("active")

      dot.addEventListener("click", () => {
        // Remove active class from all slides and dots
        slides.forEach((slide) => slide.classList.remove("active"))
        dotsContainer.querySelectorAll(".carousel-dot").forEach((d) => d.classList.remove("active"))

        // Add active class to clicked dot and corresponding slide
        slides[index].classList.add("active")
        dot.classList.add("active")
      })

      dotsContainer.appendChild(dot)
    })

    // Auto-rotate slides
    let currentIndex = 0

    setInterval(
      () => {
        // Remove active class from current slide and dot
        slides[currentIndex].classList.remove("active")
        dotsContainer.querySelectorAll(".carousel-dot")[currentIndex].classList.remove("active")

        // Move to next slide
        currentIndex = (currentIndex + 1) % slides.length

        // Add active class to new slide and dot
        slides[currentIndex].classList.add("active")
        dotsContainer.querySelectorAll(".carousel-dot")[currentIndex].classList.add("active")
      },
      4000 + carouselIndex * 500,
    ) // Stagger timing for different carousels
  })
})

// Dropdown menu for mobile
const dropdownLinks = document.querySelectorAll(".has-dropdown > a")

dropdownLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // Only handle dropdown on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault()
      const parent = this.parentElement
      parent.classList.toggle("active")

      // Toggle aria-expanded for accessibility
      const isExpanded = parent.classList.contains("active")
      this.setAttribute("aria-expanded", isExpanded)
    }
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    // Don't interfere with dropdown functionality
    if (this.parentElement.classList.contains("has-dropdown") && window.innerWidth <= 768) {
      return
    }

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      e.preventDefault()

      // Close mobile menu if open
      if (mainNav && mainNav.classList.contains("active")) {
        mainNav.classList.remove("active")
        menuToggle.classList.remove("active")
      }

      // Smooth scroll to target
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Update URL without page jump
      history.pushState(null, null, targetId)
    }
  })
})

// Add active class to nav links based on scroll position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const scrollPosition = window.scrollY + 100 // Offset for header

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelector(`.main-nav a[href="#${sectionId}"]`)?.classList.add("active")
    } else {
      document.querySelector(`.main-nav a[href="#${sectionId}"]`)?.classList.remove("active")
    }
  })
})

// Contact Form Handling
const contactForm = document.getElementById("contactForm")
const formMessage = document.getElementById("formMessage")

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Check if honeypot field is filled (spam bot)
    if (document.getElementById("website").value !== "") {
      return false
    }

    // Get form data
    const formData = new FormData(this)

    // Show loading state
    const submitBtn = this.querySelector("button[type='submit']")
    const originalBtnText = submitBtn.textContent
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    // Send form data
    fetch(this.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        // Show success message
        formMessage.textContent = "Your message has been sent successfully. We'll get back to you soon!"
        formMessage.classList.add("success")
        formMessage.style.display = "block"

        // Reset form
        contactForm.reset()
      })
      .catch((error) => {
        // Show error message
        formMessage.textContent = "There was a problem sending your message. Please try again later."
        formMessage.classList.add("error")
        formMessage.style.display = "block"
      })
      .finally(() => {
        // Reset button state
        submitBtn.textContent = originalBtnText
        submitBtn.disabled = false
      })
  })
}
