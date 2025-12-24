const { useState, useEffect } = React;

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Main App Component
function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showSettings, setShowSettings] = useState(false);
    const [vaccineTypes, setVaccineTypes] = useState([
        "COVID-19",
        "COVID-19 Booster",
        "Influenza",
        "Tetanus",
        "Hepatitis B",
        "MMR (Measles, Mumps, Rubella)",
        "Polio",
        "HPV",
        "Pneumococcal",
        "Varicella (Chickenpox)",
        "Rotavirus",
        "Meningococcal",
        "DTaP (Diphtheria, Tetanus, Pertussis)"
    ]);
    const [previousVaccineCount, setPreviousVaccineCount] = useState(0);
    const [doctorName, setDoctorName] = useState(() => {
        const saved = localStorage.getItem('clinicSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            return settings.doctorName || 'Dr. Sarah Smith';
        }
        return 'Dr. Sarah Smith';
    });
    const [doctorRole, setDoctorRole] = useState(() => {
        const saved = localStorage.getItem('clinicSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            return settings.doctorRole || 'Healthcare Provider';
        }
        return 'Healthcare Provider';
    });

    // Fetch vaccines from backend
    useEffect(() => {
        fetchVaccines(true); // Initial load with loading state
        // Poll for updates every 3 seconds
        const interval = setInterval(() => {
            fetchVaccines(false); // Silent refresh without loading state
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchVaccines = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const response = await fetch(`${API_BASE_URL}/vaccines`);
            if (response.ok) {
                const data = await response.json();
                setPreviousVaccineCount(data.length);
                setVaccines(data);
            } else {
                showNotification('Failed to load vaccines', 'error');
            }
        } catch (error) {
            console.error('Error fetching vaccines:', error);
            if (showLoading) showNotification('Error connecting to server', 'error');
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Calculate statistics
    const stats = {
        total: vaccines.length,
        completed: vaccines.filter(v => v.status === 'completed').length,
        upcoming: vaccines.filter(v => v.status === 'upcoming').length,
        overdue: vaccines.filter(v => {
            const today = new Date();
            const dueDate = new Date(v.dueDate);
            return v.status !== 'completed' && dueDate < today;
        }).length
    };

    // Calculate active reminders
    const activeReminders = vaccines.filter(v => {
        if (v.status === 'completed') return false;
        const today = new Date();
        const dueDate = new Date(v.dueDate);
        const timeDiff = dueDate - today;
        const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysUntilDue <= v.reminderDays;
    }).length;

    // Filter vaccines
    const filteredVaccines = vaccines.filter(vaccine => {
        const matchesSearch = vaccine.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            vaccine.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || vaccine.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="app-container">
            <Header setActiveTab={setActiveTab} setShowSettings={setShowSettings} doctorName={doctorName} doctorRole={doctorRole} />
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} reminderCount={activeReminders} />
            <div className="content-area">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '3em', marginBottom: '20px' }}>⏳</div>
                        <h3>Loading vaccines...</h3>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && (
                            <Dashboard 
                                stats={stats} 
                                vaccines={vaccines}
                                setActiveTab={setActiveTab}
                            />
                        )}
                        {activeTab === 'vaccines' && (
                            <VaccineManagement
                                vaccines={filteredVaccines}
                                allVaccines={vaccines}
                                setVaccines={setVaccines}
                                showNotification={showNotification}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filterStatus={filterStatus}
                                setFilterStatus={setFilterStatus}
                                setActiveTab={setActiveTab}
                                fetchVaccines={fetchVaccines}
                            />
                        )}
                        {activeTab === 'add' && (
                            <AddNew
                                vaccines={vaccines}
                                setVaccines={setVaccines}
                                showNotification={showNotification}
                                setActiveTab={setActiveTab}
                                vaccineTypes={vaccineTypes}
                                setVaccineTypes={setVaccineTypes}
                                fetchVaccines={fetchVaccines}
                            />
                        )}
                        {activeTab === 'reminders' && (
                            <Reminders vaccines={vaccines} />
                        )}
                    </>
                )}
            </div>
            {notification && (
                <Notification message={notification.message} type={notification.type} />
            )}
            <SettingsPanel showSettings={showSettings} setShowSettings={setShowSettings} showNotification={showNotification} setDoctorName={setDoctorName} setDoctorRole={setDoctorRole} />
        </div>
    );
}

// Header Component
function Header({ setActiveTab, setShowSettings, doctorName, doctorRole }) {
    const avatarName = doctorName.replace('Dr. ', '').replace(/\s+/g, '+');
    
    return (
        <header className="app-header">
            <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                <div className="header-title" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', flex: '1' }}>
                    <h1>
                        <span className="header-icon">💉</span>
                        VaxTrack
                    </h1>
                    <p>Smart Vaccination Management System</p>
                </div>
                <div className="user-profile" onClick={() => setShowSettings(true)} style={{ cursor: 'pointer' }}>
                    <div className="user-info">
                        <span className="user-name">{doctorName}</span>
                        <span className="user-role">{doctorRole}</span>
                    </div>
                    <div className="user-avatar">
                        <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0EA5E9&color=fff&size=80&bold=true`} alt={doctorName} />
                    </div>
                </div>
            </div>
        </header>
    );
}

// Navigation Component
function Navigation({ activeTab, setActiveTab, reminderCount }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const tabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'vaccines', label: '💉 Vaccines', icon: '💉' },
        { id: 'add', label: '➕ Add New', icon: '➕' },
        { id: 'reminders', label: '🔔 Reminders', icon: '🔔', badge: reminderCount }
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <button 
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? '✕' : '☰'} Menu
            </button>
            <nav className={`nav-tabs ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label.split(' ').slice(1).join(' ')}</span>
                        {tab.badge > 0 && (
                            <span className="nav-badge">{tab.badge}</span>
                        )}
                    </button>
                ))}
            </nav>
        </>
    );
}

// Dashboard Component
function Dashboard({ stats, vaccines, setActiveTab }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [modalVaccines, setModalVaccines] = useState([]);

    const upcomingVaccines = vaccines
        .filter(v => v.status === 'upcoming')
        .slice(0, 3);

    const handleStatCardClick = (status) => {
        let filtered = [];
        if (status === 'total') {
            filtered = vaccines;
        } else if (status === 'overdue') {
            const today = new Date();
            filtered = vaccines.filter(v => {
                const dueDate = new Date(v.dueDate);
                return v.status !== 'completed' && dueDate < today;
            });
        } else {
            filtered = vaccines.filter(v => v.status === status);
        }
        setModalVaccines(filtered);
        setSelectedStatus(status);
        setShowModal(true);
    };

    const getStatusTitle = () => {
        if (selectedStatus === 'total') return 'All Vaccines';
        if (selectedStatus === 'overdue') return 'Overdue Vaccines';
        return selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) + ' Vaccines';
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px', fontSize: '1.8em' }}>Dashboard Overview</h2>
            <div className="dashboard">
                <div className="stat-card" onClick={() => handleStatCardClick('total')} style={{ cursor: 'pointer' }}>
                    <h3>Total Vaccines</h3>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat-card" onClick={() => handleStatCardClick('completed')} style={{ cursor: 'pointer' }}>
                    <h3>Completed</h3>
                    <div className="stat-value">{stats.completed}</div>
                </div>
                <div className="stat-card" onClick={() => handleStatCardClick('upcoming')} style={{ cursor: 'pointer' }}>
                    <h3>Upcoming</h3>
                    <div className="stat-value">{stats.upcoming}</div>
                </div>
                <div className="stat-card" onClick={() => handleStatCardClick('overdue')} style={{ cursor: 'pointer' }}>
                    <h3>Overdue</h3>
                    <div className="stat-value">{stats.overdue}</div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{getStatusTitle()}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            {modalVaccines.length > 0 ? (
                                <div className="vaccine-list">
                                    {modalVaccines.map(vaccine => (
                                        <VaccineCard key={vaccine.id} vaccine={vaccine} showActions={false} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📋</div>
                                    <h3>No Vaccines Found</h3>
                                    <p>No vaccines match this status</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5em' }}>Upcoming Vaccinations</h3>
                {upcomingVaccines.length > 0 ? (
                    <div className="vaccine-list">
                        {upcomingVaccines.map(vaccine => (
                            <VaccineCard key={vaccine.id} vaccine={vaccine} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <h3>No Upcoming Vaccinations</h3>
                        <p>All vaccinations are up to date!</p>
                    </div>
                )}
                {upcomingVaccines.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setActiveTab('vaccines')}
                        >
                            View All Vaccines
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Vaccine Management Component
function VaccineManagement({ 
    vaccines, 
    allVaccines,
    setVaccines, 
    showNotification,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    setActiveTab,
    fetchVaccines
}) {
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Prevent body scroll when popup is open
    useEffect(() => {
        if (confirmDelete) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [confirmDelete]);

    const handleDelete = (id) => {
        setConfirmDelete(id);
    };

    const confirmDeleteAction = async () => {
        if (confirmDelete) {
            setDeletingId(confirmDelete);
            setConfirmDelete(null);
            
            try {
                const response = await fetch(`${API_BASE_URL}/vaccines/${confirmDelete}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setTimeout(async () => {
                        await fetchVaccines();
                        showNotification('Vaccine record deleted successfully', 'success');
                        setDeletingId(null);
                    }, 500);
                } else {
                    showNotification('Failed to delete vaccine record', 'error');
                    setDeletingId(null);
                }
            } catch (error) {
                console.error('Error deleting vaccine:', error);
                showNotification('Error connecting to server', 'error');
                setDeletingId(null);
            }
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
    };

    const handleMarkComplete = async (id) => {
        const vaccine = allVaccines.find(v => v.id === id);
        if (!vaccine) return;

        const updatedVaccine = {
            ...vaccine,
            status: 'completed',
            administeredDate: new Date().toISOString().split('T')[0]
        };

        try {
            const response = await fetch(`${API_BASE_URL}/vaccines/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedVaccine)
            });

            if (response.ok) {
                await fetchVaccines();
                showNotification('Vaccine marked as completed', 'success');
            } else {
                showNotification('Failed to update vaccine record', 'error');
            }
        } catch (error) {
            console.error('Error updating vaccine:', error);
            showNotification('Error connecting to server', 'error');
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px', fontSize: '1.8em' }}>Vaccine Management</h2>
            
            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search by patient or vaccine name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </div>

            {allVaccines.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💉</div>
                    <h3>No Vaccine Records Found</h3>
                    <p>Start by adding a new vaccine record</p>
                </div>
            ) : vaccines.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No Results Found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div className="vaccine-list">
                    {vaccines.map(vaccine => (
                        <VaccineCard 
                            key={vaccine.id} 
                            vaccine={vaccine}
                            onDelete={handleDelete}
                            onMarkComplete={handleMarkComplete}
                            showActions={true}
                            isDeleting={deletingId === vaccine.id}
                        />
                    ))}
                </div>
            )}

            {confirmDelete && (
                <div className="confirm-overlay" onClick={cancelDelete}>
                    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-icon">⚠️</div>
                        <h3>Delete Vaccine Record?</h3>
                        <p>This action cannot be undone. The vaccine record will be permanently deleted.</p>
                        <div className="confirm-actions">
                            <button className="btn btn-secondary" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={confirmDeleteAction}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Vaccine Card Component
function VaccineCard({ vaccine, onDelete, onMarkComplete, showActions = false, isDeleting = false }) {
    const [isCompleting, setIsCompleting] = useState(false);
    
    const getStatusClass = () => {
        const today = new Date();
        const dueDate = new Date(vaccine.dueDate);
        
        if (vaccine.status === 'completed') return 'completed';
        if (dueDate < today) return 'overdue';
        if (vaccine.status === 'upcoming') return 'upcoming';
        return '';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const handleComplete = (id) => {
        setIsCompleting(true);
        setTimeout(() => {
            onMarkComplete(id);
        }, 800);
    };

    return (
        <div className={`vaccine-card ${getStatusClass()} ${isCompleting ? 'completing' : ''} ${isDeleting ? 'deleting' : ''}`}>
            <div className="vaccine-card-header">
                <div className="vaccine-info">
                    <h3>{vaccine.vaccineName}</h3>
                    <p className="patient-name">Patient: {vaccine.patientName}</p>
                </div>
            </div>
            
            <div className="status-row">
                <span className={`status-badge ${vaccine.status}`}>
                    {vaccine.status}
                </span>
            </div>
            
            <div className="vaccine-details">
                <div className="detail-item">
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">{formatDate(vaccine.dueDate)}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Administered Date</span>
                    <span className="detail-value">
                        {vaccine.administeredDate ? formatDate(vaccine.administeredDate) : 'Not yet'}
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Dosage</span>
                    <span className="detail-value">{vaccine.dosage}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Batch Number</span>
                    <span className="detail-value">{vaccine.batchNumber}</span>
                </div>
            </div>

            {vaccine.notes && (
                <div className="vaccine-notes">
                    <strong>Notes:</strong> {vaccine.notes}
                </div>
            )}

            {showActions && (
                <div className="vaccine-actions">
                    {vaccine.status !== 'completed' && (
                        <button 
                            className="btn btn-success btn-small"
                            onClick={() => handleComplete(vaccine.id)}
                            disabled={isCompleting}
                        >
                            ✓ Mark Complete
                        </button>
                    )}
                    <button 
                        className="btn btn-danger btn-small"
                        onClick={() => onDelete(vaccine.id)}
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
}

// Add New Component (Main selector)
function AddNew({ vaccines, setVaccines, showNotification, setActiveTab, vaccineTypes, setVaccineTypes, fetchVaccines }) {
    const [addMode, setAddMode] = useState(null); // 'vaccine-type' or 'vaccination'

    if (addMode === 'vaccine-type') {
        return (
            <ManageVaccineTypes
                vaccineTypes={vaccineTypes}
                setVaccineTypes={setVaccineTypes}
                showNotification={showNotification}
                onBack={() => setAddMode(null)}
            />
        );
    }

    if (addMode === 'vaccination') {
        return (
            <AddVaccination
                vaccines={vaccines}
                setVaccines={setVaccines}
                showNotification={showNotification}
                setActiveTab={setActiveTab}
                vaccineTypes={vaccineTypes}
                onBack={() => setAddMode(null)}
                fetchVaccines={fetchVaccines}
            />
        );
    }

    return (
        <div>
            <h2 style={{ marginBottom: '30px', fontSize: '1.8em', textAlign: 'center' }}>What would you like to add?</h2>
            
            <div className="add-new-selector">
                <div className="add-option-card" onClick={() => setAddMode('vaccine-type')}>
                    <div className="add-option-icon">⚕️</div>
                    <h3>Add New Vaccine Type</h3>
                    <p>Add a new vaccine for diseases (e.g., COVID-19, Measles)</p>
                    <button className="btn btn-select">
                        Select
                    </button>
                </div>

                <div className="add-option-card" onClick={() => setAddMode('vaccination')}>
                    <div className="add-option-icon">💉</div>
                    <h3>Schedule Vaccination</h3>
                    <p>Record a vaccination schedule for a patient</p>
                    <button className="btn btn-select">
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
}

// Manage Vaccine Types Component
function ManageVaccineTypes({ vaccineTypes, setVaccineTypes, showNotification, onBack }) {
    const [newVaccineType, setNewVaccineType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddVaccineType = () => {
        if (!newVaccineType.trim()) {
            showNotification('Please enter a vaccine type name', 'error');
            return;
        }
        if (vaccineTypes.includes(newVaccineType.trim())) {
            showNotification('This vaccine type already exists', 'error');
            return;
        }
        setVaccineTypes([...vaccineTypes, newVaccineType.trim()]);
        showNotification('Vaccine type added successfully', 'success');
        setNewVaccineType('');
    };

    const handleDeleteVaccineType = (type) => {
        if (vaccineTypes.length <= 1) {
            showNotification('You must have at least one vaccine type', 'error');
            return;
        }
        if (confirm(`Are you sure you want to delete "${type}" from vaccine types?`)) {
            setVaccineTypes(vaccineTypes.filter(t => t !== type));
            showNotification('Vaccine type deleted successfully', 'success');
        }
    };

    const filteredTypes = vaccineTypes.filter(type => 
        type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    style={{ padding: '10px 20px' }}
                >
                    ← Back
                </button>
                <h2 style={{ fontSize: '1.8em', margin: 0 }}>Manage Vaccine Types</h2>
            </div>

            <div className="vaccine-form">
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Add New Vaccine Type</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                value={newVaccineType}
                                onChange={(e) => setNewVaccineType(e.target.value)}
                                placeholder="Enter vaccine type name (e.g., COVID-19, Measles)"
                                style={{ 
                                    width: '100%',
                                    padding: '12px', 
                                    border: '2px solid #E0E6ED', 
                                    borderRadius: '8px',
                                    fontSize: '1em'
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddVaccineType()}
                            />
                        </div>
                        <button 
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddVaccineType}
                            style={{ whiteSpace: 'nowrap', padding: '12px 30px' }}
                        >
                            ➕ Add Vaccine
                        </button>
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '15px' }}>Existing Vaccine Types ({vaccineTypes.length})</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="🔍 Search vaccine types..."
                            style={{ 
                                width: '100%',
                                padding: '12px', 
                                border: '2px solid #E0E6ED', 
                                borderRadius: '8px',
                                fontSize: '1em'
                            }}
                        />
                    </div>
                    <div className="vaccine-type-list">
                        {filteredTypes.sort().map((type, index) => (
                            <div key={index} className="vaccine-type-item">
                                <span style={{ fontSize: '1.1em' }}>{type}</span>
                                <button
                                    type="button"
                                    className="btn-delete-small"
                                    onClick={() => handleDeleteVaccineType(type)}
                                    title="Delete vaccine type"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add Vaccination Component (Schedule for a patient)
function AddVaccination({ vaccines, setVaccines, showNotification, setActiveTab, vaccineTypes, onBack, fetchVaccines }) {
    const [formData, setFormData] = useState({
        patientName: '',
        vaccineName: '',
        dueDate: '',
        dosage: '',
        batchNumber: '',
        notes: '',
        reminderDays: 7
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.patientName || !formData.vaccineName || !formData.dueDate) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const newVaccine = {
            ...formData,
            reminderDays: parseInt(formData.reminderDays),
            administeredDate: null,
            status: 'pending'
        };

        try {
            setSubmitting(true);
            const response = await fetch(`${API_BASE_URL}/vaccines`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVaccine)
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                await fetchVaccines();
                showNotification('Vaccine record added successfully!', 'success');
                
                // Reset form
                setFormData({
                    patientName: '',
                    vaccineName: '',
                    dueDate: '',
                    dosage: '',
                    batchNumber: '',
                    notes: '',
                    reminderDays: 7
                });

                // Switch to vaccines tab after a short delay
                setTimeout(() => setActiveTab('vaccines'), 1500);
            } else {
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                showNotification(`Failed to add vaccine record: ${response.status}`, 'error');
            }
        } catch (error) {
            console.error('Error adding vaccine:', error);
            showNotification(`Error connecting to server: ${error.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            patientName: '',
            vaccineName: '',
            dueDate: '',
            dosage: '',
            batchNumber: '',
            notes: '',
            reminderDays: 7
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={onBack}
                    style={{ padding: '10px 20px' }}
                >
                    ← Back
                </button>
                <h2 style={{ fontSize: '1.8em', margin: 0 }}>Schedule Vaccination</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="vaccine-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="patientName">Patient Name *</label>
                        <input
                            type="text"
                            id="patientName"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            placeholder="Enter patient name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="vaccineName">Vaccine Type *</label>
                        <select
                            id="vaccineName"
                            name="vaccineName"
                            value={formData.vaccineName}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select vaccine type</option>
                            {vaccineTypes.sort().map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date *</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dosage">Dosage</label>
                        <input
                            type="text"
                            id="dosage"
                            name="dosage"
                            value={formData.dosage}
                            onChange={handleChange}
                            placeholder="e.g., 0.5ml"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="batchNumber">Batch Number</label>
                        <input
                            type="text"
                            id="batchNumber"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleChange}
                            placeholder="Enter batch number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reminderDays">Reminder (days before)</label>
                        <input
                            type="number"
                            id="reminderDays"
                            name="reminderDays"
                            value={formData.reminderDays}
                            onChange={handleChange}
                            min="0"
                            max="90"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any additional notes..."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={submitting}>
                        Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? '⏳ Scheduling...' : '💾 Schedule Vaccination'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Reminders Component
function Reminders({ vaccines }) {
    const getReminders = () => {
        const today = new Date();
        
        return vaccines
            .filter(v => v.status !== 'completed')
            .map(v => {
                const dueDate = new Date(v.dueDate);
                const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                const reminderDate = new Date(dueDate);
                reminderDate.setDate(reminderDate.getDate() - v.reminderDays);
                
                return {
                    ...v,
                    daysUntilDue,
                    isUrgent: daysUntilDue <= v.reminderDays && daysUntilDue >= 0,
                    isOverdue: daysUntilDue < 0
                };
            })
            .filter(v => v.isUrgent || v.isOverdue)
            .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    };

    const reminders = getReminders();

    const formatDaysMessage = (days) => {
        if (days < 0) {
            return `Overdue by ${Math.abs(days)} day(s)`;
        } else if (days === 0) {
            return 'Due today';
        } else {
            return `Due in ${days} day(s)`;
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '20px', fontSize: '1.8em' }}>🔔 Vaccination Reminders</h2>
            
            <div className="reminders-section">
                <h3 style={{ marginBottom: '15px' }}>Active Reminders</h3>
                
                {reminders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">✅</div>
                        <h3>No Active Reminders</h3>
                        <p>You're all caught up! No upcoming vaccinations requiring attention.</p>
                    </div>
                ) : (
                    <div className="reminder-list">
                        {reminders.map(reminder => (
                            <div 
                                key={reminder.id} 
                                className={`reminder-card ${reminder.isOverdue ? 'urgent' : ''}`}
                            >
                                <div className="reminder-info">
                                    <h4>{reminder.vaccineName}</h4>
                                    <p>Patient: {reminder.patientName}</p>
                                    <p style={{ 
                                        color: reminder.isOverdue ? '#E74C3C' : '#F39C12',
                                        fontWeight: 'bold',
                                        marginTop: '5px'
                                    }}>
                                        {formatDaysMessage(reminder.daysUntilDue)}
                                    </p>
                                </div>
                                <div className="reminder-date">
                                    {new Date(reminder.dueDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#E8F4FD', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '10px' }}>💡 Reminder Tips</h4>
                <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Reminders are automatically generated based on the due date and reminder settings</li>
                    <li>Urgent reminders (overdue) are highlighted in red</li>
                    <li>Check this section regularly to stay on top of vaccinations</li>
                    <li>Mark vaccines as complete to remove them from reminders</li>
                </ul>
            </div>
        </div>
    );
}

// Notification Component
function Notification({ message, type }) {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
}

// Settings Panel Component
function SettingsPanel({ showSettings, setShowSettings, showNotification, setDoctorName, setDoctorRole }) {
    const [settings, setSettings] = useState(() => {
        // Load from localStorage or use defaults
        const saved = localStorage.getItem('clinicSettings');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            doctorName: 'Dr. Sarah Smith',
            doctorRole: 'Healthcare Provider',
            clinicName: 'Health Care Clinic',
            clinicPhone: '555-1234',
            clinicEmail: 'clinic@healthcare.com',
            defaultReminderDays: 7
        };
    });
    const [originalSettings, setOriginalSettings] = useState(settings);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleEdit = () => {
        setOriginalSettings(settings); // Save current state before editing
        setIsEditing(true);
    };

    const handleSave = () => {
        // Save to localStorage
        localStorage.setItem('clinicSettings', JSON.stringify(settings));
        setOriginalSettings(settings);
        setIsEditing(false);
        // Update App state
        setDoctorName(settings.doctorName);
        setDoctorRole(settings.doctorRole);
        showNotification('✅ Settings saved successfully', 'success');
    };

    const handleCancel = () => {
        setSettings(originalSettings); // Restore original settings
        setIsEditing(false);
    };

    if (!showSettings) return null;

    return (
        <>
            <div className="settings-overlay" onClick={() => setShowSettings(false)}></div>
            <div className={`settings-panel ${showSettings ? 'open' : ''}`}>
                <div className="settings-header">
                    <h2>⚙️ Account Settings</h2>
                    <button className="settings-close" onClick={() => setShowSettings(false)}>✕</button>
                </div>
                <div className="settings-body">

            <form className="vaccine-form">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Personal Information</h3>
                    {!isEditing && (
                        <button type="button" className="btn btn-secondary" onClick={handleEdit} style={{ padding: '8px 16px' }}>
                            ✏️ Edit
                        </button>
                    )}
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Doctor Name</label>
                        <input type="text" value={settings.doctorName}
                            onChange={(e) => handleChange('doctorName', e.target.value)}
                            placeholder="e.g., Dr. Sarah Smith"
                            disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label>Role/Title</label>
                        <input type="text" value={settings.doctorRole}
                            onChange={(e) => handleChange('doctorRole', e.target.value)}
                            placeholder="e.g., Healthcare Provider"
                            disabled={!isEditing} />
                    </div>
                </div>

                <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Clinic Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Clinic Name</label>
                        <input type="text" value={settings.clinicName}
                            onChange={(e) => handleChange('clinicName', e.target.value)}
                            placeholder="e.g., Health Care Clinic"
                            disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" value={settings.clinicPhone}
                            onChange={(e) => handleChange('clinicPhone', e.target.value)}
                            placeholder="e.g., +1 (555) 123-4567"
                            disabled={!isEditing} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={settings.clinicEmail}
                            onChange={(e) => handleChange('clinicEmail', e.target.value)}
                            placeholder="e.g., clinic@healthcare.com"
                            disabled={!isEditing} />
                    </div>
                </div>

                <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Reminder Settings</h3>
                <div className="form-group">
                    <label>Default Reminder Days Before Due Date</label>
                    <input type="number" value={settings.defaultReminderDays}
                        onChange={(e) => handleChange('defaultReminderDays', e.target.value)}
                        min="0" max="90"
                        placeholder="e.g., 7"
                        disabled={!isEditing} />
                    <small style={{ display: 'block', marginTop: '8px', color: '#64748B' }}>Reminders will be shown in the web app</small>
                </div>

                {isEditing && (
                    <div className="form-actions" style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            💾 Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            ✕ Cancel
                        </button>
                    </div>
                )}
            </form>

                    <div style={{ marginTop: '30px', padding: '20px', background: '#FFF3CD', borderRadius: '8px', borderLeft: '4px solid #F39C12' }}>
                        <h4 style={{ marginBottom: '10px' }}>⚠️ About Settings</h4>
                        <p style={{ lineHeight: '1.6' }}>
                            Settings are stored locally in your browser. Changes will apply to your current session.
                            For a production environment, these settings would be stored in a database.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
