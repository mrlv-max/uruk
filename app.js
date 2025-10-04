// Uruk Healthcare Platform JavaScript

// Application data
const appData = {
  "user": {
    "name": "Rajesh Kumar",
    "age": 28,
    "bloodType": "O+",
    "emergencyContact": "+91-9876543210",
    "uCardNumber": "URK2024001234"
  },
  "vitals": [
    {"date": "2024-10-04", "heartRate": 72, "bloodPressure": "120/80", "temperature": 98.6, "oxygenSaturation": 98},
    {"date": "2024-10-03", "heartRate": 75, "bloodPressure": "122/82", "temperature": 98.4, "oxygenSaturation": 97},
    {"date": "2024-10-02", "heartRate": 68, "bloodPressure": "118/78", "temperature": 98.7, "oxygenSaturation": 99}
  ],
  "doctors": [
    {"id": 1, "name": "Dr. Priya Sharma", "specialty": "Cardiology", "rating": 4.8, "distance": "1.2 km", "available": true},
    {"id": 2, "name": "Dr. Amit Patel", "specialty": "General Medicine", "rating": 4.6, "distance": "0.8 km", "available": true},
    {"id": 3, "name": "Dr. Sunita Rao", "specialty": "Dermatology", "rating": 4.9, "distance": "2.1 km", "available": false},
    {"id": 4, "name": "Dr. Vikram Singh", "specialty": "Orthopedics", "rating": 4.7, "distance": "1.5 km", "available": true}
  ],
  "pharmacies": [
    {"id": 1, "name": "MedPlus Pharmacy", "distance": "0.5 km", "stock": {"Paracetamol": "In Stock", "Aspirin": "Low Stock", "Vitamin D": "In Stock"}},
    {"id": 2, "name": "Apollo Pharmacy", "distance": "0.8 km", "stock": {"Paracetamol": "In Stock", "Aspirin": "In Stock", "Vitamin D": "Out of Stock"}},
    {"id": 3, "name": "Wellness Pharmacy", "distance": "1.2 km", "stock": {"Paracetamol": "In Stock", "Aspirin": "In Stock", "Vitamin D": "In Stock"}}
  ],
  "medicines": [
    {"id": 1, "name": "Paracetamol", "price": 25, "description": "Pain relief medication"},
    {"id": 2, "name": "Aspirin", "price": 30, "description": "Anti-inflammatory drug"},
    {"id": 3, "name": "Vitamin D", "price": 150, "description": "Vitamin supplement"},
    {"id": 4, "name": "Amoxicillin", "price": 120, "description": "Antibiotic medication"}
  ],
  "appointments": [
    {"id": 1, "doctor": "Dr. Priya Sharma", "date": "2024-10-06", "time": "10:00 AM", "department": "Cardiology", "status": "Confirmed"},
    {"id": 2, "doctor": "Dr. Amit Patel", "date": "2024-10-08", "time": "2:30 PM", "department": "General Medicine", "status": "Pending"}
  ],
  "medicalRecords": [
    {"id": 1, "type": "Blood Test", "date": "2024-09-15", "doctor": "Dr. Amit Patel", "summary": "Normal blood parameters"},
    {"id": 2, "type": "X-Ray", "date": "2024-08-22", "doctor": "Dr. Vikram Singh", "summary": "No fractures detected"},
    {"id": 3, "type": "ECG", "date": "2024-07-10", "doctor": "Dr. Priya Sharma", "summary": "Normal heart rhythm"}
  ],
  "alerts": [
    {"id": 1, "type": "High Blood Pressure", "message": "Your blood pressure reading was higher than normal", "date": "2024-10-03", "severity": "medium"},
    {"id": 2, "type": "Appointment Reminder", "message": "You have an appointment with Dr. Priya Sharma tomorrow", "date": "2024-10-04", "severity": "low"}
  ],
  "emergencyContacts": [
    {"name": "Uruk Emergency", "number": "1800-URUK-911"},
    {"name": "Local Hospital", "number": "+91-11-26588700"},
    {"name": "Family Doctor", "number": "+91-9876543210"}
  ]
};

// Application state
let currentPage = 'dashboard';
let vitalsChart = null;
let shoppingCart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupForms();
    setupSearch();
    loadDashboardData();
    loadVitalsData();
    loadMedicalRecords();
    loadDoctors();
    loadPharmacies();
    loadMedicines();
    loadEmergencyContacts();
    loadAlerts();
    loadAppointments();
    updateUserProfile();
    
    // Set minimum date for appointment booking
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        appointmentDateInput.min = formattedDate;
        appointmentDateInput.value = formattedDate; // Set default value to tomorrow
    }
}

// Navigation
function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar__link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.sidebar__link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    currentPage = pageId;
    
    // Load page-specific data
    if (pageId === 'vitals' && !vitalsChart) {
        setTimeout(createVitalsChart, 100);
    }
}

// Forms
function setupForms() {
    // Vitals form
    const vitalsForm = document.getElementById('vitalsForm');
    if (vitalsForm) {
        vitalsForm.addEventListener('submit', handleVitalsSubmit);
    }
    
    // Symptom form
    const symptomForm = document.getElementById('symptomForm');
    if (symptomForm) {
        symptomForm.addEventListener('submit', handleSymptomSubmit);
    }
    
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Department change handler
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', updateDoctorOptions);
    }
}

function handleVitalsSubmit(e) {
    e.preventDefault();
    
    const heartRate = document.getElementById('heartRate').value;
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;
    const temperature = document.getElementById('temperature').value;
    const oxygen = document.getElementById('oxygen').value;
    
    const newVital = {
        date: new Date().toISOString().split('T')[0],
        heartRate: parseInt(heartRate),
        bloodPressure: `${systolic}/${diastolic}`,
        temperature: parseFloat(temperature),
        oxygenSaturation: parseInt(oxygen)
    };
    
    appData.vitals.unshift(newVital);
    
    // Reset form
    document.getElementById('vitalsForm').reset();
    
    // Update displays
    loadDashboardData();
    loadVitalsData();
    updateVitalsChart();
    
    showMessage('Vitals recorded successfully!', 'success');
}

function handleSymptomSubmit(e) {
    e.preventDefault();
    
    const symptom = document.getElementById('symptom').value;
    const severity = document.getElementById('severity').value;
    const notes = document.getElementById('notes').value;
    
    // Add to alerts (simulating symptom reporting)
    const newAlert = {
        id: appData.alerts.length + 1,
        type: 'Symptom Report',
        message: `Reported: ${symptom} (${severity})`,
        date: new Date().toISOString().split('T')[0],
        severity: severity === 'severe' ? 'high' : severity === 'moderate' ? 'medium' : 'low'
    };
    
    appData.alerts.unshift(newAlert);
    
    // Reset form
    document.getElementById('symptomForm').reset();
    
    closeModal('symptomModal');
    loadAlerts();
    showMessage('Symptom reported successfully!', 'success');
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const department = document.getElementById('department').value;
    const doctor = document.getElementById('doctorSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('timeSlot').value;
    
    // Validate all required fields
    if (!department || !doctor || !date || !time) {
        showMessage('Please fill all required fields', 'error');
        return;
    }
    
    const newAppointment = {
        id: appData.appointments.length + 1,
        doctor: doctor,
        date: date,
        time: time,
        department: department,
        status: 'Pending'
    };
    
    appData.appointments.push(newAppointment);
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
    closeModal('bookingModal');
    loadAppointments();
    loadDashboardData();
    showMessage('Appointment booked successfully!', 'success');
}

function handleProfileSubmit(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const age = document.getElementById('age').value;
    const bloodType = document.getElementById('bloodTypeSelect').value;
    const emergencyPhone = document.getElementById('emergencyPhone').value;
    
    appData.user.name = fullName;
    appData.user.age = parseInt(age);
    appData.user.bloodType = bloodType;
    appData.user.emergencyContact = emergencyPhone;
    
    updateUserProfile();
    showMessage('Profile updated successfully!', 'success');
}

// Search functionality
function setupSearch() {
    // Medicine search
    const medicineSearch = document.getElementById('medicineSearch');
    if (medicineSearch) {
        medicineSearch.addEventListener('input', (e) => {
            filterMedicines(e.target.value);
        });
    }
    
    // Record search
    const recordSearch = document.getElementById('recordSearch');
    if (recordSearch) {
        recordSearch.addEventListener('input', (e) => {
            filterRecords(e.target.value);
        });
    }
    
    // Specialty filter
    const specialtyFilter = document.getElementById('specialtyFilter');
    if (specialtyFilter) {
        specialtyFilter.addEventListener('change', (e) => {
            filterDoctors(e.target.value);
        });
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            setActiveFilter(e.target);
            filterRecords('', filter);
        });
    });
}

function filterMedicines(searchTerm) {
    const filtered = appData.medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayMedicines(filtered);
}

function filterRecords(searchTerm, filter = 'all') {
    let filtered = appData.medicalRecords;
    
    if (searchTerm) {
        filtered = filtered.filter(record =>
            record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.summary.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filter !== 'all') {
        // Simple filtering based on type (this would be more sophisticated in a real app)
        filtered = filtered.filter(record => {
            switch(filter) {
                case 'consultations':
                    return record.type.includes('Test') || record.type.includes('ECG');
                case 'diagnoses':
                    return record.summary.includes('Normal') || record.summary.includes('No');
                case 'treatments':
                    return record.type.includes('X-Ray');
                default:
                    return true;
            }
        });
    }
    
    displayMedicalRecords(filtered);
}

function filterDoctors(specialty) {
    let filtered = appData.doctors;
    
    if (specialty) {
        filtered = filtered.filter(doctor => doctor.specialty === specialty);
    }
    
    displayDoctors(filtered);
}

function setActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Data loading functions
function loadDashboardData() {
    // Latest vitals
    if (appData.vitals.length > 0) {
        const latest = appData.vitals[0];
        document.getElementById('latestVitals').textContent = 
            `HR: ${latest.heartRate} bpm | BP: ${latest.bloodPressure}`;
    }
    
    // Next appointment
    if (appData.appointments.length > 0) {
        const next = appData.appointments[0];
        const date = new Date(next.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        document.getElementById('nextAppointment').textContent = 
            `${formattedDate}, ${next.time}`;
    }
    
    // Active alerts
    document.getElementById('activeAlerts').textContent = 
        `${appData.alerts.length} notifications`;
    
    // U-Card status
    document.getElementById('uCardStatus').textContent = 
        `Active - ${appData.user.uCardNumber}`;
    
    // Load recent notifications
    loadRecentNotifications();
}

function loadRecentNotifications() {
    const container = document.getElementById('recentNotifications');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.alerts.slice(0, 3).forEach(alert => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification-item';
        
        notificationDiv.innerHTML = `
            <div class="notification-item__icon">
                <i class="fas fa-${alert.type.includes('Appointment') ? 'calendar' : 'exclamation-triangle'}"></i>
            </div>
            <div class="notification-item__content">
                <h4>${alert.type}</h4>
                <p>${alert.message}</p>
            </div>
        `;
        
        container.appendChild(notificationDiv);
    });
}

function loadVitalsData() {
    const container = document.getElementById('vitalsHistory');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.vitals.slice(0, 5).forEach(vital => {
        const vitalDiv = document.createElement('div');
        vitalDiv.className = 'vitals-entry';
        
        const date = new Date(vital.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        vitalDiv.innerHTML = `
            <div class="vitals-entry__date">${formattedDate}</div>
            <div class="vitals-entry__values">
                <span>HR: ${vital.heartRate}</span>
                <span>BP: ${vital.bloodPressure}</span>
                <span>Temp: ${vital.temperature}°F</span>
                <span>O2: ${vital.oxygenSaturation}%</span>
            </div>
        `;
        
        container.appendChild(vitalDiv);
    });
}

function loadMedicalRecords(records = appData.medicalRecords) {
    displayMedicalRecords(records);
}

function displayMedicalRecords(records) {
    const container = document.getElementById('medicalRecordsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    records.forEach(record => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';
        
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        recordDiv.innerHTML = `
            <div class="record-item__info">
                <h4>${record.type}</h4>
                <p>${formattedDate} • ${record.doctor}</p>
                <p>${record.summary}</p>
            </div>
            <div class="record-item__actions">
                <button class="btn btn--sm btn--outline">View</button>
                <button class="btn btn--sm btn--outline">Download</button>
            </div>
        `;
        
        container.appendChild(recordDiv);
    });
}

function loadDoctors(doctors = appData.doctors) {
    displayDoctors(doctors);
}

function displayDoctors(doctors) {
    const container = document.getElementById('doctorsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    doctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'doctor-card';
        
        const stars = '★'.repeat(Math.floor(doctor.rating)) + '☆'.repeat(5 - Math.floor(doctor.rating));
        
        doctorDiv.innerHTML = `
            <div class="doctor-card__header">
                <div class="doctor-card__info">
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialty}</p>
                </div>
                <div class="doctor-card__status ${doctor.available ? 'available' : 'unavailable'}">
                    ${doctor.available ? 'Available' : 'Unavailable'}
                </div>
            </div>
            <div class="doctor-card__details">
                <div class="rating">
                    <span style="color: #fbbf24;">${stars}</span>
                    <span>${doctor.rating}</span>
                </div>
                <div class="distance">${doctor.distance}</div>
            </div>
            <button class="btn btn--primary btn--full-width" 
                    ${doctor.available ? 'onclick="bookWithDoctor(\'' + doctor.name + '\', \'' + doctor.specialty + '\')"' : 'disabled'}>
                ${doctor.available ? 'Book Appointment' : 'Not Available'}
            </button>
        `;
        
        container.appendChild(doctorDiv);
    });
}

function loadPharmacies() {
    const container = document.getElementById('pharmaciesList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.pharmacies.forEach(pharmacy => {
        const pharmacyDiv = document.createElement('div');
        pharmacyDiv.className = 'pharmacy-card';
        
        let stockHtml = '';
        Object.entries(pharmacy.stock).forEach(([medicine, status]) => {
            const statusClass = status.toLowerCase().replace(' ', '-');
            stockHtml += `
                <div class="stock-item">
                    <span>${medicine}</span>
                    <span class="stock-status ${statusClass}">${status}</span>
                </div>
            `;
        });
        
        pharmacyDiv.innerHTML = `
            <div class="pharmacy-card__header">
                <h4>${pharmacy.name}</h4>
                <span class="distance">${pharmacy.distance}</span>
            </div>
            <div class="stock-list">
                ${stockHtml}
            </div>
        `;
        
        container.appendChild(pharmacyDiv);
    });
}

function loadMedicines(medicines = appData.medicines) {
    displayMedicines(medicines);
}

function displayMedicines(medicines) {
    const container = document.getElementById('medicineResults');
    if (!container) return;
    
    container.innerHTML = '';
    
    medicines.forEach(medicine => {
        const medicineDiv = document.createElement('div');
        medicineDiv.className = 'medicine-card';
        
        medicineDiv.innerHTML = `
            <h4>${medicine.name}</h4>
            <p>${medicine.description}</p>
            <div class="medicine-card__footer">
                <span class="price">₹${medicine.price}</span>
                <button class="btn btn--sm btn--primary" onclick="addToCart(${medicine.id})">
                    Add to Cart
                </button>
            </div>
        `;
        
        container.appendChild(medicineDiv);
    });
}

function loadEmergencyContacts() {
    const container = document.getElementById('emergencyContactsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.emergencyContacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'emergency-contact';
        
        contactDiv.innerHTML = `
            <div>
                <h4>${contact.name}</h4>
                <p>${contact.number}</p>
            </div>
            <button class="btn btn--primary" onclick="callNumber('${contact.number}')">
                <i class="fas fa-phone"></i>
            </button>
        `;
        
        container.appendChild(contactDiv);
    });
}

function loadAlerts() {
    const container = document.getElementById('healthAlerts');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item severity-${alert.severity}`;
        
        const iconClass = alert.severity === 'high' ? 'exclamation-triangle' : 
                         alert.severity === 'medium' ? 'exclamation-circle' : 'info-circle';
        
        const date = new Date(alert.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        alertDiv.innerHTML = `
            <div class="alert-item__icon">
                <i class="fas fa-${iconClass}"></i>
            </div>
            <div class="alert-item__content">
                <h4>${alert.type}</h4>
                <p>${alert.message}</p>
                <small>${formattedDate}</small>
            </div>
        `;
        
        container.appendChild(alertDiv);
    });
}

function loadAppointments() {
    const container = document.getElementById('upcomingAppointments');
    if (!container) return;
    
    container.innerHTML = '';
    
    appData.appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.className = 'appointment-item';
        
        const date = new Date(appointment.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        appointmentDiv.innerHTML = `
            <div class="appointment-item__info">
                <h4>${appointment.doctor}</h4>
                <p>${formattedDate} • ${appointment.time}</p>
                <p>${appointment.department}</p>
            </div>
            <div class="status status--${appointment.status.toLowerCase() === 'confirmed' ? 'success' : 'warning'}">
                ${appointment.status}
            </div>
        `;
        
        container.appendChild(appointmentDiv);
    });
}

function updateUserProfile() {
    // Update all user name references
    document.getElementById('userName').textContent = appData.user.name;
    document.getElementById('ucardName').textContent = appData.user.name;
    document.getElementById('ucardNumber').textContent = appData.user.uCardNumber;
    document.getElementById('bloodType').textContent = appData.user.bloodType;
    document.getElementById('emergencyContact').textContent = appData.user.emergencyContact;
    
    // Update form values
    document.getElementById('fullName').value = appData.user.name;
    document.getElementById('age').value = appData.user.age;
    document.getElementById('bloodTypeSelect').value = appData.user.bloodType;
    document.getElementById('emergencyPhone').value = appData.user.emergencyContact;
}

// Chart functions
function createVitalsChart() {
    const ctx = document.getElementById('vitalsChart');
    if (!ctx) return;
    
    const dates = appData.vitals.slice(-7).reverse().map(v => {
        const date = new Date(v.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const heartRates = appData.vitals.slice(-7).reverse().map(v => v.heartRate);
    const temperatures = appData.vitals.slice(-7).reverse().map(v => v.temperature);
    const oxygenLevels = appData.vitals.slice(-7).reverse().map(v => v.oxygenSaturation);
    
    vitalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Heart Rate (bpm)',
                    data: heartRates,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Temperature (°F)',
                    data: temperatures,
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.3
                },
                {
                    label: 'Oxygen Saturation (%)',
                    data: oxygenLevels,
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function updateVitalsChart() {
    if (!vitalsChart) return;
    
    const dates = appData.vitals.slice(-7).reverse().map(v => {
        const date = new Date(v.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const heartRates = appData.vitals.slice(-7).reverse().map(v => v.heartRate);
    const temperatures = appData.vitals.slice(-7).reverse().map(v => v.temperature);
    const oxygenLevels = appData.vitals.slice(-7).reverse().map(v => v.oxygenSaturation);
    
    vitalsChart.data.labels = dates;
    vitalsChart.data.datasets[0].data = heartRates;
    vitalsChart.data.datasets[1].data = temperatures;
    vitalsChart.data.datasets[2].data = oxygenLevels;
    vitalsChart.update();
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showReportSymptomModal() {
    showModal('symptomModal');
}

function showBookingModal() {
    showModal('bookingModal');
    // Set default date to tomorrow when opening the modal
    const appointmentDateInput = document.getElementById('appointmentDate');
    if (appointmentDateInput && !appointmentDateInput.value) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        appointmentDateInput.value = formattedDate;
    }
}

function showUploadModal() {
    showMessage('Upload functionality would be implemented here', 'info');
}

// Shopping cart functions
let cartTotal = 0;

function addToCart(medicineId) {
    const medicine = appData.medicines.find(m => m.id === medicineId);
    if (!medicine) return;
    
    const existingItem = shoppingCart.find(item => item.id === medicineId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        shoppingCart.push({
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showMessage(`${medicine.name} added to cart`, 'success');
}

function removeFromCart(medicineId) {
    const index = shoppingCart.findIndex(item => item.id === medicineId);
    if (index > -1) {
        shoppingCart.splice(index, 1);
        updateCartDisplay();
    }
}

function updateQuantity(medicineId, change) {
    const item = shoppingCart.find(item => item.id === medicineId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(medicineId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Update cart modal if open
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        cartTotal = 0;
        
        shoppingCart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            
            cartItemDiv.innerHTML = `
                <div class="cart-item__info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} each</p>
                </div>
                <div class="cart-item__controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="btn btn--sm btn--outline" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            
            cartItems.appendChild(cartItemDiv);
        });
        
        if (shoppingCart.length === 0) {
            cartItems.innerHTML = '<p class="text-secondary">Your cart is empty</p>';
        }
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal;
    }
}

function showCart() {
    updateCartDisplay();
    showModal('cartModal');
}

function checkout() {
    if (shoppingCart.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Simulate checkout process
    const orderTotal = cartTotal;
    shoppingCart = [];
    updateCartDisplay();
    closeModal('cartModal');
    
    showMessage(`Order placed successfully! Total: ₹${orderTotal}`, 'success');
}

// Utility functions
function updateDoctorOptions() {
    const department = document.getElementById('department').value;
    const doctorSelect = document.getElementById('doctorSelect');
    
    if (!doctorSelect) return;
    
    doctorSelect.innerHTML = '<option value="">Select doctor</option>';
    
    const availableDoctors = appData.doctors.filter(doctor => 
        !department || doctor.specialty === department
    );
    
    availableDoctors.forEach(doctor => {
        if (doctor.available) {
            const option = document.createElement('option');
            option.value = doctor.name;
            option.textContent = `${doctor.name} (${doctor.distance})`;
            doctorSelect.appendChild(option);
        }
    });
}

function bookWithDoctor(doctorName, specialty) {
    showModal('bookingModal');
    
    // Pre-fill the form
    setTimeout(() => {
        document.getElementById('department').value = specialty;
        updateDoctorOptions();
        setTimeout(() => {
            document.getElementById('doctorSelect').value = doctorName;
        }, 100);
    }, 100);
}

function findNearbyDoctors() {
    showMessage('Finding nearby doctors based on your location...', 'info');
    // This would integrate with a mapping service in a real application
}

function findNearbyTreatment() {
    showMessage('Locating nearest treatment centers...', 'info');
}

function callNumber(number) {
    showMessage(`Calling ${number}...`, 'info');
}

function callEmergency() {
    callNumber('1800-URUK-911');
}

function shareLocation() {
    const locationSharing = document.getElementById('locationSharing');
    if (locationSharing && locationSharing.checked) {
        showMessage('Location shared with Uruk emergency team', 'success');
    } else {
        showMessage('Please enable location sharing first', 'error');
    }
}

function showVitalsHistory() {
    showMessage('Complete vitals history would be displayed here', 'info');
}

function triggerFileUpload(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.click();
    }
}

function analyzeReport() {
    const fileInput = document.getElementById('reportUpload');
    if (!fileInput || !fileInput.files.length) {
        showMessage('Please upload a report first', 'error');
        return;
    }
    
    const results = document.getElementById('aiResults');
    if (results) {
        results.innerHTML = `
            <div class="analysis-result">
                <h3>AI Analysis Results</h3>
                <div class="analysis-item">
                    <h4>Blood Sugar Levels</h4>
                    <p>Your blood sugar levels are within normal range (95 mg/dL). Continue maintaining your current diet.</p>
                </div>
                <div class="analysis-item">
                    <h4>Cholesterol</h4>
                    <p>Cholesterol levels slightly elevated. Consider reducing saturated fat intake and increasing physical activity.</p>
                </div>
                <div class="analysis-item">
                    <h4>Recommendations</h4>
                    <ul>
                        <li>Schedule a follow-up in 3 months</li>
                        <li>Increase fiber intake</li>
                        <li>Monitor blood pressure regularly</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    showMessage('Report analyzed successfully!', 'success');
}

function scanInfection() {
    const fileInput = document.getElementById('infectionUpload');
    if (!fileInput || !fileInput.files.length) {
        showMessage('Please upload an image first', 'error');
        return;
    }
    
    const results = document.getElementById('aiResults');
    if (results) {
        results.innerHTML = `
            <div class="analysis-result">
                <h3>Infection Scan Results</h3>
                <div class="analysis-item">
                    <h4>Analysis Complete</h4>
                    <p>No signs of serious infection detected. The area appears to have minor inflammation.</p>
                </div>
                <div class="analysis-item">
                    <h4>Recommendations</h4>
                    <ul>
                        <li>Clean the area with antiseptic</li>
                        <li>Apply antibiotic ointment</li>
                        <li>Keep the area dry and covered</li>
                        <li>Monitor for 48 hours</li>
                        <li>Consult a doctor if symptoms worsen</li>
                    </ul>
                </div>
                <div class="analysis-item">
                    <h4>When to Seek Medical Help</h4>
                    <p>Contact a healthcare provider if you experience fever, increased redness, or pus formation.</p>
                </div>
            </div>
        `;
    }
    
    showMessage('Infection scan completed!', 'success');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showMessage('Logging out...', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Message system
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Trigger animation
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-scheme', 'light');
            }
        });
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Prevent modal close when clicking inside modal content
document.addEventListener('click', function(e) {
    if (e.target.closest('.modal__content')) {
        e.stopPropagation();
    }
});