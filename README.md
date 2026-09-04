# BlackPepper Website – Feature Enhancement

A frontend-based feature enhancement project for the BlackPepper Info Services corporate website.

## 📌 Project Overview

This project focuses on improving the visual presentation, usability, interactivity, and user experience of the website while retaining its core information structure.

The project is implemented using HTML, CSS, and JavaScript.

## ✨ Features

### 🎨 Visual & Theme Enhancement
- Site-wide light/white and light-blue visual theme
- Improved contrast for text, cards, buttons, and sections
- Enhanced hero section with stronger visual effects
- Improved card styling and UI elements

### 🏠 Hero Section
- White hero background
- Darker, high-contrast hero text
- Enhanced glowing visual/orb effect
- Floating cards with improved contrast

### 🧭 Navbar & Navigation
- Sticky navigation bar
- Blurred navbar effect
- Improved navigation and CTA button contrast
- Active-section navigation highlighting
- Mobile menu toggle
- Scroll progress indicator

### 💼 Interactive Service Explorer
- Nine service categories displayed as interactive cards
- Service icons, titles, descriptions, and categories
- Clicking a service opens a detailed modal
- Modal includes service title, icon, description, and feature list

### 🔎 Client-Side Service Search
- Search field above the services section
- Filters services by:
  - Service title
  - Description
  - Service category
- Case-insensitive search
- Search query is preserved in the URL using `?q=...`
- Filtered service pages can therefore be shared or bookmarked

### ❓ FAQ Accordion
- Expandable FAQ questions
- Only one FAQ item remains open at a time
- Interactive open/close behavior

### ☁️ S.M.A.C. Interactive Section
The S.M.A.C. section provides interactive tabs for:
- Social
- Mobility
- Analytics
- Cloud

Selecting a tab dynamically updates the displayed information.

### 📦 Interactive Product Showcase
- Product cards with interactive behavior
- Product information displayed through modals
- Modal can be closed by:
  - Close button
  - Clicking outside the modal
  - Pressing Escape

### 🤝 Interactive Partner Section
- Partner cards are clickable
- Selected partners are visually highlighted
- Contextual messages are displayed for the selected partner

### ⭐ Testimonial Carousel
- Automatically rotating testimonials
- Previous and next controls
- Navigation dots
- Interactive testimonial navigation

### 📩 Contact Form Validation
Client-side validation for:
- Name
- Email
- Phone
- Message

The form provides:
- Inline validation errors
- Input feedback
- Success feedback after valid submission

### 📱 Responsive User Interface
The website adapts its layout and components for different screen sizes, including desktop, tablet, and mobile devices.

### ♿ Accessibility & UX Improvements
- Focus states
- Hover states
- Input focus outlines
- Drop shadows for visual hierarchy
- ARIA-friendly search labeling
- Keyboard support for modal interactions

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- DOM Manipulation
- Intersection Observer API
- CSS Animations
- Browser Developer Tools

## 📂 Project Structure

```text
BlackPepper-website-project/
│
├── index.html
├── style.css
├── script.js
└── assets/
    └── images/
