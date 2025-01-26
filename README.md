# Complaint and Suggestion Management System

This project was created to learn Firebase integration with React and explore the capabilities of Tailwind CSS. The primary goal is to build a functional web application that allows users to submit complaints and suggestions, while also providing an admin dashboard to manage and respond to these submissions.

## Key Learning Objectives

### Firebase Integration
- **Authentication**: Implement user authentication using Firebase Auth, allowing users to sign up, log in, and log out.
- **Firestore Database**: Use Firebase Firestore to store and retrieve user data, complaints, and suggestions.
- **Real-time Updates**: Leverage Firestore's real-time capabilities to dynamically update the UI as data changes.

### React
- **Component-based Architecture**: Build reusable and modular components to create a scalable and maintainable codebase.
- **React Router**: Implement client-side routing to navigate between different pages and components.
- **State Management**: Manage application state using React's built-in hooks like `useState` and `useEffect`.

### Tailwind CSS
- **Utility-first CSS**: Use Tailwind CSS to style the application with utility classes, enabling rapid and consistent design.
- **Responsive Design**: Create a responsive layout that adapts to different screen sizes and devices.
- **Custom Styling**: Extend Tailwind's default configuration to include custom colors, border-radius, and other design elements.

## Project Structure

### Features
- **Authentication**: Users can sign up, log in, and log out. Admins have additional privileges to manage complaints and suggestions.
- **User Dashboard**: Students can view their submitted complaints and suggestions, along with the status and feedback from admins.
- **Admin Dashboard**: Admins can view, filter, and manage complaints and suggestions, provide feedback, and update statuses.
- **Forms**: Users can submit new complaints and suggestions through dedicated forms with validation and feedback mechanisms.

## Technologies Used
- **React**: For building the user interface and managing state.
- **Firebase**: For authentication, Firestore database, and real-time updates.
- **Tailwind CSS**: For styling the application with a utility-first approach.
- **React Router**: For client-side routing and navigation.
- **React Toastify**: For displaying notifications and feedback messages.

## Getting Started

### Prerequisites
- Node.js installed on your system.
- Firebase account set up.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/complaint-suggestion-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd complaint-suggestion-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and configure Firebase credentials.
5. Start the development server:
   ```bash
   npm start
   ```
