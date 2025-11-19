# Project Structure and Page Details

This document provides a comprehensive breakdown of all pages and major components in the application, mapping routes to their source files and describing their purpose.

---

## 1. Main Sections & Core Pages

These pages form the primary public-facing parts of the website.

- **Route**: `/`
- **File**: `src/app/page.tsx`
- **Description**: The main landing page. It features a hero section introducing Vishwa Vidarshana, a grid of offered services (Web Development, Design, Game Top-ups), client testimonials in an auto-playing carousel, and a final call-to-action to start a project.

- **Route**: `/about`
- **File**: `src/app/about/page.tsx`
- **Description**: A detailed personal portfolio page. It showcases your professional journey, skills with animated progress bars, a timeline of your career, and key achievements.

- **Route**: `/contact`
- **File**: `src/app/contact/page.tsx`
- **Description**: A comprehensive contact page with a form for sending messages, direct contact information (email, phone), and quick action buttons for WhatsApp and booking appointments. Includes an embedded map placeholder.

- **Route**: `/privacy`, `/terms`, `/refund-policy`
- **Files**: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/refund-policy/page.tsx`
- **Description**: Standard legal and informational pages, accessible from the footer. They provide users with the site's policies.

---

## 2. Business & Service Pages

These pages are dedicated to your specific business offerings.

- **Route**: `/esystemlk`
- **File**: `src/app/esystemlk/page.tsx`
- **Description**: A marketing page for your software company, ESystemLK. It lists services, highlights key features (fast delivery, security), and includes a portfolio section.

- **Route**: `/design-services`
- **File**: `src/app/design-services/page.tsx`
- **Description**: Details your creative services, focusing on logo and post design. It displays pricing packages, explains the design process, and includes a call-to-action directing users to the Design Studio.

- **Route**: `/design-studio`
- **File**: `src/app/design-studio/page.tsx`
- **Description**: An interactive portal for clients to order new design projects. It contains a form for submitting a design brief and placeholder components for scheduling and client chat.

- **Route**: `/quotation` & `/quotation-generator`
- **Files**: `src/app/quotation/page.tsx`, `src/app/quotation-generator/page.tsx`
- **Description**: An automated tool for generating project quotes. Clients select a service category, a specific service, a pricing tier, and optional add-ons. An AI flow generates a detailed Markdown quotation, and the project is automatically saved for admin review.

---

## 3. E-commerce & Gaming Features

Functionality related to the Dark Diamond Store and e-sports tournaments.

- **Route**: `/freefire-topup`
- **File**: `src/app/freefire-topup/page.tsx`
- **Description**: The "Dark Diamond Store." Users can enter their Player ID, add top-up packages to a cart, and place an order. It requires users to be logged in and have a complete profile to place an order.

- **Route**: `/games`
- **File**: `src/app/games/page.tsx`
- **Description**: The "Game Center" hub page that links to all gaming-related tools, including the Point Calculator, Budget Calculator, and tournament submission/listing pages.

- **Route**: `/tournaments`
- **File**: `src/app/tournaments/page.tsx`
- **Description**: A public listing of all approved and "published" e-sports tournaments, displayed as a grid of cards with key information.

- **Route**: `/tournaments/submit`
- **File**: `src/app/tournaments/submit/page.tsx`
- **Description**: A form that allows authenticated users to submit their own e-sports tournaments for admin approval. It includes fields for all tournament details and a required poster upload.

- **Route**: `/tournaments/[id]`
- **File**: `src/app/tournaments/[id]/page.tsx`
- **Description**: The public detail page for a single tournament. It displays the poster, description, rules, prize pool, and a live public leaderboard of team scores.

- **Route**: `/games/point-calculator`
- **File**: `src/app/games/point-calculator/page.tsx`
- **Description**: A powerful, client-side tool for calculating e-sports points. Organizers can add teams, input kills and placements for multiple matches, and view a real-time leaderboard. All data is saved locally in the browser.

- **Route**: `/games/tournament-budget-calculator`
- **File**: `src/app/games/tournament-budget-calculator/page.tsx`
- **Description**: A multi-step financial planning tool. It guides organizers through setting up a tournament, breaking down detailed income/expenses, and provides a final summary with estimated profit/loss.

- **Route**: `/marketplace`
- **File**: `src/app/marketplace/page.tsx`
- **Description**: A "Coming Soon" page for a future online marketplace. It showcases planned features and includes an email signup form to notify users upon launch.

---

## 4. User & Admin Functionality

Pages related to user accounts, dashboards, and site management.

- **Route**: `/auth`
- **File**: `src/app/auth/page.tsx`
- **Description**: The main authentication page, which dynamically shows either the Sign In or Sign Up form.

- **Route**: `/auth/complete-profile`
- **File**: `src/app/auth/complete-profile/page.tsx`
- **Description**: A required step for new users who need to set a username before they can access certain features like placing top-up orders.

- **Route**: `/dashboard`
- **File**: `src/app/dashboard/page.tsx`
- **Description**: A central hub for logged-in users. It displays a welcome message and provides quick links to "My Orders," "My Tournaments," "Messages," and the "Admin Panel" (for authorized users).

- **Route**: `/my-orders`
- **File**: `src/app/my-orders/page.tsx`
- **Description**: A private page where a logged-in user can view their history of top-up orders, including items, total price, and status.

- **Route**: `/dashboard/my-tournaments`
- **File**: `src/app/dashboard/my-tournaments/page.tsx`
- **Description**: A private dashboard where a user can see a list of all tournaments they have submitted, along with their status (pending, published, rejected) and links to manage or edit them.

- **Route**: `/dashboard/my-tournaments/edit/[id]`
- **File**: `src/app/dashboard/my-tournaments/edit/[id]/page.tsx`
- **Description**: Allows a tournament owner to edit the details of their own submitted tournament.

- **Route**: `/dashboard/my-tournaments/manage/[id]`
- **File**: `src/app/dashboard/my-tournaments/manage/[id]/page.tsx`
- **Description**: Provides the tournament owner with the full Point Calculator interface, but connected to Firestore. This allows them to manage teams and scores for their specific event, with data saved online.

- **Route**: `/messages`
- **File**: `src/app/messages/page.tsx`
- **Description**: A dedicated page for the real-time chat interface, allowing a logged-in user to communicate with an admin.

- **Route**: `/admin`
- **File**: `src/app/admin/page.tsx`
- **Description**: A role-protected dashboard for site administrators. It uses tabs to provide access to various management panels:
  - **Chat**: View all user conversations and respond in real-time.
  - **Tournament Approvals**: Approve or reject user-submitted tournaments.
  - **Top-up Orders**: View and manage all top-up orders.
  - **Top-up Packages**: Add, edit, or delete the packages available in the store.
  - **Testimonials**: Manage the client testimonials displayed on the homepage.
  - **User Management**: View all users and manage their roles (admin, developer, customer).
  - **Payment Settings**: Enable or disable different payment methods for the store.

---

## 5. Developer Tools Suite

A collection of free, secure, client-side utilities for developers and other users.

- **Route**: `/tools`
- **File**: `src/app/tools/page.tsx`
- **Description**: The main directory page for the tools suite. It includes a search bar and category filters to easily find a specific tool.

- **Image & File Converters**:
  - **Route**: `/tools/file-converter` (Handles images)
  - **Description**: Convert image files between JPG, PNG, WEBP, and BMP. Supports batch processing and download as a ZIP.
  - **Route**: `/tools/pdf-suite`
  - **Description**: A two-in-one tool to convert multiple images into a single PDF or extract all pages from a PDF into individual images.

- **Image Utilities**:
  - **Route**: `/tools/image-resizer`
  - **Description**: Resize images to custom dimensions while maintaining aspect ratio.
  - **Route**: `/tools/image-cropper`
  - **Description**: Visually crop images with a selection box.

- **Security Tools**:
  - **Route**: `/tools/file-encryption`
  - **Description**: Encrypt and decrypt any file using AES-256 with a password.
  - **Route**: `/tools/password-generator`
  - **Description**: Create strong, random passwords with customizable rules (length, characters).
  - **Route**: `/tools/jwt-decoder`
  - **Description**: Decode JSON Web Tokens to inspect their header and payload.

- **Code & Data Tools**:
  - **Route**: `/tools/json-csv-converter`
  - **Description**: Convert data between JSON and CSV formats.
  - **Route**: `/tools/code-minifier`
  - **Description**: Reduce the file size of HTML, CSS, and JavaScript code.
  - **Route**: `/tools/regex-tester`
  - **Description**: Test and debug regular expressions with live highlighting.
  - **Route**: `/tools/api-tester`
  - **Description**: A mini-Postman to make HTTP requests (GET, POST, etc.) and inspect responses.
  - **Route**: `/tools/markdown-converter`
  - **Description**: Convert Markdown text into clean HTML with a live preview.

- **Generators & Scanners**:
  - **Route**: `/tools/qr-generator` & `/tools/barcode-generator`
  - **Description**: Create QR codes and standard barcodes from text or URLs.
  - **Route**: `/tools/qr-scanner`
  - **Description**: Scan QR codes using the device camera or an uploaded image file.

- **Design Tools**:
  - **Route**: `/tools/color-palette-generator`
  - **Description**: Generate harmonious color schemes (complementary, analogous, etc.) from a base color.
