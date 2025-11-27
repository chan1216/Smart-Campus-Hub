// Lab Room Reservation System JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const roomSelect = document.getElementById('room-select');
    const dateInput = document.getElementById('reservation-date');
    const timetableContainer = document.getElementById('timetable-container');
    const timetableInfo = document.getElementById('timetable-info');
    const submitBtn = document.getElementById('submit-btn');
    const modal = document.getElementById('confirmation-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    // State
    let selectedRoom = null;
    let selectedDate = null;
    let selectedTimeSlots = [];
    
    // Room labels for display
    const roomLabels = {
        'lab-101': '컴퓨터 실습실 101',
        'lab-102': '컴퓨터 실습실 102',
        'lab-201': '소프트웨어 실습실 201',
        'lab-202': '네트워크 실습실 202',
        'room-301': '강의실 301',
        'room-302': '강의실 302',
        'room-401': '세미나실 401'
    };
    
    // Time periods for the timetable
    const timePeriods = [
        { id: 1, time: '09:00 - 10:00', label: '1교시' },
        { id: 2, time: '10:00 - 11:00', label: '2교시' },
        { id: 3, time: '11:00 - 12:00', label: '3교시' },
        { id: 4, time: '12:00 - 13:00', label: '점심시간' },
        { id: 5, time: '13:00 - 14:00', label: '4교시' },
        { id: 6, time: '14:00 - 15:00', label: '5교시' },
        { id: 7, time: '15:00 - 16:00', label: '6교시' },
        { id: 8, time: '16:00 - 17:00', label: '7교시' },
        { id: 9, time: '17:00 - 18:00', label: '8교시' }
    ];
    
    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    
    // Generate mock reservation data based on room and date
    function getReservationData(room, date) {
        // This simulates backend data
        // In a real application, this would be fetched from a server
        const reservations = {};
        
        // Create a seed based on room and date for consistent results
        const seed = (room + date).split('').reduce((a, b) => {
            return ((a << 5) - a) + b.charCodeAt(0);
        }, 0);
        
        // Generate some reservations based on the seed
        timePeriods.forEach((period, index) => {
            // Use seed to determine if this slot is reserved
            const isReserved = ((seed + index * 7) % 5) < 2;
            if (isReserved && period.label !== '점심시간') {
                reservations[period.id] = {
                    reserved: true,
                    reservedBy: '예약됨'
                };
            }
        });
        
        return reservations;
    }
    
    // Generate and display the timetable
    function generateTimetable() {
        if (!selectedRoom || !selectedDate) {
            timetableContainer.innerHTML = '';
            timetableInfo.textContent = '실습실과 날짜를 선택하면 시간표가 표시됩니다.';
            return;
        }
        
        // Update info text
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        timetableInfo.innerHTML = `
            <strong>${roomLabels[selectedRoom]}</strong> - ${formattedDate}<br>
            <span style="color: #2e7d32;">🟢 예약 가능</span> | 
            <span style="color: #c62828;">🔴 예약됨</span> |
            <span style="color: #667eea;">🔵 선택됨</span>
        `;
        
        // Get reservation data
        const reservations = getReservationData(selectedRoom, selectedDate);
        
        // Create table
        const table = document.createElement('table');
        table.className = 'timetable';
        
        // Create header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>교시</th>
                <th>시간</th>
                <th>상태</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create body
        const tbody = document.createElement('tbody');
        
        timePeriods.forEach(period => {
            const tr = document.createElement('tr');
            const reservation = reservations[period.id];
            const isReserved = reservation && reservation.reserved;
            const isLunchBreak = period.label === '점심시간';
            const isSelected = selectedTimeSlots.includes(period.id);
            
            // Period label cell
            const tdLabel = document.createElement('td');
            tdLabel.className = 'header-cell';
            tdLabel.textContent = period.label;
            tr.appendChild(tdLabel);
            
            // Time cell
            const tdTime = document.createElement('td');
            tdTime.className = 'header-cell';
            tdTime.textContent = period.time;
            tr.appendChild(tdTime);
            
            // Status cell
            const tdStatus = document.createElement('td');
            tdStatus.dataset.periodId = period.id;
            
            if (isLunchBreak) {
                tdStatus.className = 'header-cell';
                tdStatus.textContent = '휴식';
            } else if (isReserved) {
                tdStatus.className = 'reserved';
                tdStatus.textContent = '예약됨';
            } else if (isSelected) {
                tdStatus.className = 'selected';
                tdStatus.textContent = '선택됨';
            } else {
                tdStatus.className = 'available';
                tdStatus.textContent = '예약 가능';
            }
            
            // Add click handler for available slots
            if (!isReserved && !isLunchBreak) {
                tdStatus.addEventListener('click', function() {
                    toggleTimeSlotSelection(period.id);
                });
            }
            
            tr.appendChild(tdStatus);
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        timetableContainer.innerHTML = '';
        timetableContainer.appendChild(table);
        
        updateSubmitButton();
    }
    
    // Toggle time slot selection
    function toggleTimeSlotSelection(periodId) {
        const index = selectedTimeSlots.indexOf(periodId);
        if (index > -1) {
            selectedTimeSlots.splice(index, 1);
        } else {
            selectedTimeSlots.push(periodId);
        }
        selectedTimeSlots.sort((a, b) => a - b);
        generateTimetable();
    }
    
    // Update submit button state
    function updateSubmitButton() {
        if (selectedRoom && selectedDate && selectedTimeSlots.length > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }
    
    // Event listener for room selection
    roomSelect.addEventListener('change', function() {
        selectedRoom = this.value;
        selectedTimeSlots = [];
        generateTimetable();
    });
    
    // Event listener for date selection
    dateInput.addEventListener('change', function() {
        selectedDate = this.value;
        selectedTimeSlots = [];
        generateTimetable();
    });
    
    // Submit button click
    submitBtn.addEventListener('click', function() {
        if (!selectedRoom || !selectedDate || selectedTimeSlots.length === 0) return;
        
        // Format date for display
        const dateObj = new Date(selectedDate);
        const formattedDate = dateObj.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
        
        // Format selected time slots
        const selectedTimes = selectedTimeSlots.map(id => {
            const period = timePeriods.find(p => p.id === id);
            return `${period.label} (${period.time})`;
        }).join(', ');
        
        // Update modal content
        document.getElementById('confirm-room').textContent = roomLabels[selectedRoom];
        document.getElementById('confirm-date').textContent = formattedDate;
        document.getElementById('confirm-time').textContent = selectedTimes;
        
        // Show modal
        modal.classList.add('active');
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        // Reset form
        roomSelect.value = '';
        dateInput.value = '';
        selectedRoom = null;
        selectedDate = null;
        selectedTimeSlots = [];
        timetableContainer.innerHTML = '';
        timetableInfo.textContent = '실습실과 날짜를 선택하면 시간표가 표시됩니다.';
        updateSubmitButton();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalBtn.click();
        }
    });
});
