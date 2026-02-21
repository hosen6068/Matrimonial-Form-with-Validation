const form = document.getElementById('biodataForm');

// Validation rules – light matrimonial theme, all fields empty by default
const validationRules = {
    name: {
        required: 'Full name is required',
        minLength: { value: 3, message: 'Name must be at least 3 characters' },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Name can only contain letters and spaces' }
    },
    gender: {
        required: 'Please select a gender'
    },
    birthDay: {
        required: 'Birth date is required',
        pattern: { regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/, message: 'Date format must be DD/MM/YYYY (e.g., 15/05/1995)' }
    },
    birthPlace: {
        required: 'Birth place is required',
        minLength: { value: 2, message: 'Birth place must be at least 2 characters' },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Birth place can only contain letters and spaces' }
    },
    religion: {
        required: 'Please select a religion'
    },
    country: {
        required: 'Country is required',
        minLength: { value: 2, message: 'Country must be at least 2 characters' },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Country can only contain letters and spaces' }
    },
    height: {
        required: 'Height is required',
        pattern: { regex: /^[\d\s\.ft\-in]+$/, message: 'Height format: e.g., 5 ft. 11 in.' }
    },
    bloodGroup: {
        required: 'Please select a blood group'
    },
    complexion: {
        required: 'Please select a complexion'
    },
    education: {
        required: 'Please select an education level'
    },
    occupation: {
        required: 'Occupation is required',
        minLength: { value: 2, message: 'Occupation must be at least 2 characters' },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Occupation can only contain letters and spaces' }
    },
    fatherName: {
        required: "Father's name is required",
        minLength: { value: 2, message: "Father's name must be at least 2 characters" },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Father name can only contain letters and spaces' }
    },
    fatherOccupation: {
        required: "Father's occupation is required",
        minLength: { value: 2, message: "Father's occupation must be at least 2 characters" },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Occupation can only contain letters and spaces' }
    },
    motherName: {
        required: "Mother's name is required",
        minLength: { value: 2, message: "Mother's name must be at least 2 characters" },
        pattern: { regex: /^[a-zA-Z\s]+$/, message: 'Mother name can only contain letters and spaces' }
    },
    sisters: {
        required: 'Number of sisters is required',
        pattern: { regex: /^(None|\d+)$/i, message: 'Enter "None" or a number' }
    },
    brothers: {
        required: 'Number of brothers is required',
        pattern: { regex: /^(None|\d+)$/i, message: 'Enter "None" or a number' }
    },
    contactNo: {
        required: 'Contact number is required',
        pattern: { regex: /^[\d+\-\s()]{10,}$/, message: 'Enter a valid contact number (at least 10 digits)' }
    },
    address: {
        required: 'Address is required',
        minLength: { value: 5, message: 'Address must be at least 5 characters' },
        pattern: { regex: /^[a-zA-Z0-9\s,.\-]+$/, message: 'Address contains invalid characters' }
    }
};

// Helper: create error element (positioned after the row)
function createErrorElement(fieldName) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `error-${fieldName}`;
    return errorDiv;
}

// Initialize error placeholders
function initializeErrorMessages() {
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            // Find the parent row (form-row or gender-row)
            const parentRow = field.closest('.form-row') || field.closest('.gender-row');
            if (parentRow) {
                let existingError = parentRow.querySelector('.error-message');
                if (!existingError) {
                    parentRow.appendChild(createErrorElement(fieldName));
                }
            }
        }
    });
}

// Validate single field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return true;

    const rules = validationRules[fieldName];
    let isValid = true;
    let errorMessage = '';

    // Required rule
    if (rules.required) {
        if (fieldName === 'gender') {
            const radioGroup = document.getElementsByName(fieldName);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                isValid = false;
                errorMessage = rules.required;
            }
        } else {
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = rules.required;
            }
        }
    }

    // MinLength
    if (isValid && rules.minLength && field.value.trim()) {
        if (field.value.trim().length < rules.minLength.value) {
            isValid = false;
            errorMessage = rules.minLength.message;
        }
    }

    // Pattern
    if (isValid && rules.pattern && field.value.trim()) {
        if (!rules.pattern.regex.test(field.value)) {
            isValid = false;
            errorMessage = rules.pattern.message;
        }
    }

    const errorDiv = document.getElementById(`error-${fieldName}`);
    if (errorDiv) {
        if (!isValid) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
            field.classList.add('input-error');
        } else {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            field.classList.remove('input-error');
        }
    }

    return isValid;
}

// Validate all fields
function validateAllFields() {
    let allValid = true;
    Object.keys(validationRules).forEach(fieldName => {
        if (!validateField(fieldName)) {
            allValid = false;
        }
    });
    return allValid;
}

// Real-time validation
function setupRealTimeValidation() {
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field) return;

        if (fieldName === 'gender') {
            const radios = document.getElementsByName(fieldName);
            radios.forEach(radio => {
                radio.addEventListener('change', () => validateField(fieldName));
            });
        } else {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => validateField(fieldName));
            field.addEventListener('change', () => validateField(fieldName));
        }
    });
}

// Submit handler
form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (validateAllFields()) {
        alert('✅ Matrimonial biodata submitted successfully!');
    } else {
        alert('⚠️ Please fix the errors in the form.');
    }
});

// Reset handler – clear errors and reset photo to default silhouette
form.addEventListener('reset', function() {
    setTimeout(() => {
        // Clear all error messages and error classes
        Object.keys(validationRules).forEach(fieldName => {
            const errorDiv = document.getElementById(`error-${fieldName}`);
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.style.display = 'none';
            }
            const field = document.getElementById(fieldName);
            if (field) field.classList.remove('input-error');
        });
        // Reset photo preview to default light silhouette
        document.getElementById('photoPreview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='25' fill='%23d4e6f1'/%3E%3Ccircle cx='50' cy='95' r='35' fill='%23b2d3ea'/%3E%3C/svg%3E";
    }, 10);
});

// Photo upload preview with validation
document.getElementById('photoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            alert('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
            this.value = '';
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            this.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('photoPreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeErrorMessages();
    setupRealTimeValidation();
});