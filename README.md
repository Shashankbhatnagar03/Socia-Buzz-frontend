# Sociabuzz Frontend

The frontend of Sociabuzz is a dynamic, user-friendly interface for the Sociabuzz social media platform. It's built with React, a popular JavaScript library for building user interfaces, and Vite, a next-generation frontend tooling. The application leverages TypeScript for type safety, enhancing code reliability and maintainability. It also uses Recoil for efficient state management.

# Explore SociaBuzz Live

[Access the SociaBuzz here](https://socia-buzzz.netlify.app/)

## Key Features

- **Social Media Posting**: Users can create and share posts, expressing their thoughts and experiences. This feature allows users to share text, images, and videos, providing a rich content sharing experience.

- **Post Interaction**: Users can engage with posts by liking and commenting, fostering a sense of community and interaction. This feature encourages user engagement and interaction, making the platform more lively and social.

- **User Following**: Users can follow other users, keeping up-to-date with their latest posts. This feature allows users to curate their feed based on their interests and the people they care about.

- **Real-Time Messaging**: The application integrates Socket.IO for real-time communication, allowing users to chat with each other instantaneously. This feature enhances the user experience by providing a real-time, interactive communication platform.

- **Account Freezing**: Users have the option to freeze their account, providing a way to take a break from the social media platform when needed. This feature respects user's need for digital wellbeing and provides them with more control over their social media usage.

## Getting Started

To get the frontend running locally:

- Clone this repo
- `npm install` to install all required dependencies
- `npm run dev` to start the local server

## Code Overview

The application follows a component-based architecture, a standard design pattern for React applications. Here's a brief overview of the main directories:

- **Components**: Located in the `components` directory, these are reusable pieces of code that return a React element to be rendered to the page.

- **Pages**: The `pages` directory contains the different pages of the application. Each page is a React component.

- **Hooks**: The `hooks` directory contains custom React hooks. Hooks are a new addition in React that lets you use state and other React features without writing a class.

- **State Management**: The application uses Recoil for state management. Recoil atoms, located in the `atoms` directory, represent pieces of state that components can subscribe to.
