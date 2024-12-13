// chef24-form.js

class Chef24Form {
  constructor() {
    this.form = document.getElementById("bookingForm");
    this.progressBar = document.querySelector(".progress-bar");
    this.formGroups = document.querySelectorAll(".form-group");
    this.currentStep = 0;

    this.initialize();
  }

  initialize() {
    // Set minimum date to today
    const dateInput = document.getElementById("date");
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
    }

    // Event listeners
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.setupInputValidation();
    this.setupProgressTracking();
  }

  setupProgressTracking() {
    this.formGroups.forEach((group) => {
      const input = group.querySelector("input, select, textarea");
      if (input) {
        input.addEventListener("change", () => {
          this.updateProgress();
        });
        input.addEventListener("input", () => {
          this.updateProgress();
        });
      }
    });
  }

  updateProgress() {
    const inputs = Array.from(
      this.form.querySelectorAll("input, select, textarea")
    );
    const filledInputs = inputs.filter((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        return input.checked;
      }
      return input.value.trim() !== "";
    }).length;

    const progress = (filledInputs / inputs.length) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  setupInputValidation() {
    // Phone number formatting
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        e.target.value = this.formatPhoneNumber(e.target.value);
        this.validateField(e.target);
      });
    }

    // Real-time validation
    this.form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("blur", (e) => this.validateField(e.target));
    });
  }

  validateField(field) {
    const group = field.closest(".form-group");
    let isValid = true;
    let errorMessage = "";

    switch (field.type) {
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        errorMessage = "Please enter a valid email address";
        break;
      case "tel":
        isValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(field.value);
        errorMessage = "Please enter a valid phone number";
        break;
      case "number":
        isValid = field.value > 0;
        errorMessage = "Please enter a valid number";
        break;
      case "date":
        const selectedDate = new Date(field.value);
        const today = new Date();
        isValid = selectedDate >= today;
        errorMessage = "Please select a future date";
        break;
      default:
        isValid = field.value.trim() !== "";
        errorMessage = "This field is required";
    }

    this.toggleError(group, isValid ? "" : errorMessage);
    return isValid;
  }

  toggleError(group, message) {
    const errorElement =
      group.querySelector(".error-message") || this.createErrorElement(group);

    if (message) {
      group.classList.add("error");
      errorElement.textContent = message;
    } else {
      group.classList.remove("error");
      errorElement.textContent = "";
    }
  }

  createErrorElement(group) {
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    group.appendChild(errorElement);
    return errorElement;
  }

  formatPhoneNumber(input) {
    const cleaned = input.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (!match) return input;

    const [, area, prefix, line] = match;
    let formatted = "";

    if (area) {
      formatted += `(${area}`;
      if (prefix) {
        formatted += `) ${prefix}`;
        if (line) {
          formatted += `-${line}`;
        }
      }
    }

    return formatted;
  }

  createEmailContent(formData) {
    return `
New Booking Request

Client Information:
------------------
Name: ${formData.get("name")}
Email: ${formData.get("email")}
Phone: ${formData.get("phone")}

Event Details:
-------------
Date: ${formData.get("date")}
Time: ${formData.get("time")}
Guests: ${formData.get("guests")}
Service: ${formData.get("serviceType")}

Dietary Restrictions:
-------------------
${formData.get("dietary") || "None specified"}

Additional Notes:
----------------
${formData.get("notes") || "None provided"}
        `.trim();
  }

  async handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    let isValid = true;
    this.form.querySelectorAll("input, select, textarea").forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      this.showNotification(
        "Please fill in all required fields correctly",
        "error"
      );
      return;
    }

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(this.form);
      const emailContent = this.createEmailContent(formData);
      const mailtoLink = `mailto:724chef@gmail.com?subject=Booking Request - ${formData.get(
        "name"
      )}&body=${encodeURIComponent(emailContent)}`;

      window.location.href = mailtoLink;

      this.showNotification("Request sent successfully!", "success");
      this.form.reset();
      this.updateProgress();
      closeBookingModal();
    } catch (error) {
      this.showNotification(
        "Error sending request. Please try again.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize form
document.addEventListener("DOMContentLoaded", () => {
  new Chef24Form();
});

// Modal functions
function openBookingModal() {
  const modal = document.getElementById("bookingModal");
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("bookingModal");
  if (event.target === modal) {
    closeBookingModal();
  }
});
