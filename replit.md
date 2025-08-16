# Overview

ARMOR (AI Tactical Response) is a tactical law enforcement dashboard application built with React and Express. It provides real-time situational awareness for police officers, featuring route optimization, alert management, incident tracking, and emergency response coordination. The application uses a modern full-stack architecture with TypeScript throughout and focuses on delivering a professional, dark-themed tactical interface optimized for field operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom tactical color scheme and dark theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: WebSocket integration for live updates

## Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **API Design**: RESTful API with structured route handlers
- **Real-time Features**: WebSocket server for broadcasting alerts and updates
- **Development Tools**: Custom Vite integration for hot module replacement
- **Error Handling**: Centralized error middleware with structured responses

## Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL with Neon serverless integration
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Development Storage**: In-memory storage implementation for testing
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL backing store
- **Officer Identification**: Badge-based officer lookup system
- **Connection Status**: Real-time connection monitoring via WebSocket

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Framework**: Radix UI primitives for accessible components
- **Build Tools**: Vite with React plugin and TypeScript support
- **Development**: Replit-specific plugins for cartographer and error overlay
- **Fonts**: Google Fonts integration (Roboto, DM Sans, Fira Code, Geist Mono)
- **Icons**: Lucide React icon library
- **Real-time**: WebSocket (ws) library for server-side WebSocket implementation

## Key Design Patterns
- **Type Safety**: Full TypeScript implementation with shared types between client and server
- **Component Architecture**: Modular React components with separation of concerns
- **Data Flow**: Unidirectional data flow with TanStack Query for caching and synchronization
- **Real-time Updates**: WebSocket-based pub/sub pattern for live data updates
- **Responsive Design**: Mobile-first responsive design with tactical color scheme
- **Error Boundaries**: Comprehensive error handling and user feedback systems