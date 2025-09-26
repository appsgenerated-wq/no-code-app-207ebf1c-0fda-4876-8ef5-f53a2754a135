# FoodieFind - A Manifest-Powered Food App

Welcome to FoodieFind, a complete web application for discovering restaurants and ordering food. This project is built entirely on the Manifest backend platform, with a React frontend utilizing the `@mnfst/sdk`.

## Features

- **User Authentication**: Customers and restaurant owners can sign up and log in.
- **Restaurant Management**: Users with an 'owner' role can create and manage their restaurant listings.
- **Public Restaurant Listings**: All users can browse a list of available restaurants.
- **Order History**: Customers can view a history of their past orders.
- **Automatic Admin Panel**: Full administrative control over all data via the auto-generated Manifest admin panel.

## Getting Started

### Prerequisites

- Node.js (v18+)
- A running Manifest backend instance for this application.

### Frontend Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the project and add the URL of your Manifest backend:
    ```
    VITE_BACKEND_URL=https://your-manifest-backend-url.com
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Accessing the Admin Panel

The Manifest admin panel provides a complete UI for managing all your application's data.

- **URL**: `https://your-manifest-backend-url.com/admin`
- **Default Admin Login**:
    - **Email**: `admin@manifest.build`
    - **Password**: `admin`

### Demo Credentials

For quick testing on the frontend, you can use these pre-seeded (or manually created) users:

- **Customer**:
    - **Email**: `customer@example.com`
    - **Password**: `password`
- **Restaurant Owner**:
    - **Email**: `owner@example.com`
    - **Password**: `password`
