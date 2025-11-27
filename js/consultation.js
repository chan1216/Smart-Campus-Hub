// Consultation Reservation System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const topicInputs = document.querySelectorAll('input[name="topic"]');
    const dateInput = document.getElementById('consultation-date');
    const timeSlotsContainer = document.getElementById('time-slots');
    const submitBtn = document.getElementById('submit-btn');
    const modal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // State
    let selectedTopic = null;
    let selectedDate = null;
    let selectedTime = null;
    
    // Topic labels for display
    const topicLabels = {
        'career': '진로 상담',
        'academic': '학업 상담',
        'personal': '개인 상담',
        'employment': '취업 상담'
    };
    
    // Available time slots (9 AM to 5 PM)
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00'
    ];
    
    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Initialize time slots
    function initializeTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        
        timeSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = time;
            slot.dataset.time = time;
            
            // Randomly mark some slots as unavailable for demo purposes
            // In a real application, this would come from the backend
            if (Math.random() < 0.2) {
                slot.classList.add('unavailable');
            }
            
            slot.addEventListener('click', function() {
                if (this.classList.contains('unavailable')) return;
                
                // Deselect previous selection
                document.querySelectorAll('.time-slot.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Select this slot
                this.classList.add('selected');
                selectedTime = this.dataset.time;
                updateSubmitButton();
            });
            
            timeSlotsContainer.appendChild(slot);
        });
    }
    
    // Update submit button state
    function updateSubmitButton() {
        if (selectedTopic && selectedDate && selectedTime) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
    
    // Event listeners for topic selection
    topicInputs.forEach(input => {
        input.addEventListener('change', function() {
            selectedTopic = this.value;
            updateSubmitButton();
        });
    });
    
    // Event listener for date selection
    dateInput.addEventListener('change', function() {
        selectedDate = this.value;
        // Reset time selection and regenerate slots when date changes
        selectedTime = null;
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });
        initializeTimeSlots();
        updateSubmitButton();
    });
    
    // Submit button click
    submitBtn.addEventListener('click', function() {
        if (!selectedTopic || !selectedDate || !selectedTime) return;
        
        // Format date for display
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        // Update modal content
        document.getElementById('confirm-topic').textContent = topicLabels[selectedTopic];
        document.getElementById('confirm-date').textContent = formattedDate;
        document.getElementById('confirm-time').textContent = selectedTime;
        
        // Show modal
        modal.classList.add('active');
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        // Reset form
        topicInputs.forEach(input => input.checked = false);
        dateInput.value = '';
        selectedTopic = null;
        selectedDate = null;
        selectedTime = null;
        document.querySelectorAll('.time-slot.selected').forEach(el => {
            el.classList.remove('selected');
        });
        initializeTimeSlots();
        updateSubmitButton();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalBtn.click();
        }
    });
    
    // Initialize time slots on page load
    initializeTimeSlots();
});
