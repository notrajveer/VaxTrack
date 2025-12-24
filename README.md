# VaxTrack - Vaccination Tracking System

A simple and efficient vaccination tracking system with React frontend and Spring Boot backend.

## Features

- 📊 **Dashboard** - Overview of vaccinations with statistics
- 💉 **Vaccine Management** - Add, edit, delete, and search vaccine records
- ➕ **Add New** - Schedule vaccinations and manage vaccine types
- 🔔 **Reminders** - Automatic reminders for upcoming vaccinations
- ⚙️ **Settings** - Customize clinic information
- 📱 **Responsive Design** - Works on all devices

## Quick Start

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will run on **http://localhost:8080**

### 2. Open the Frontend

Simply open `index.html` in your web browser, or use a local server:

```bash
python -m http.server 3000
```

Then visit **http://localhost:3000**

## API Endpoints

- `GET /api/vaccines` - Get all vaccines
- `POST /api/vaccines` - Create new vaccine
- `PUT /api/vaccines/{id}` - Update vaccine
- `DELETE /api/vaccines/{id}` - Delete vaccine

## Tech Stack

- **Frontend**: React 18, Vanilla CSS
- **Backend**: Spring Boot 3.2.0, Java 17
- **Build Tool**: Maven

## Usage

1. **Add Vaccination**: Go to "Add New" → "Schedule Vaccination"
2. **View All**: Click "Vaccines" tab to see all records
3. **Search**: Use the search box to find specific vaccines
4. **Mark Complete**: Click button on vaccine cards
5. **Reminders**: Check "Reminders" tab for upcoming vaccinations

## License

Educational project.
