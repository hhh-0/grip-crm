# Grip CRM - Zero-Config Customer Management System

Grip is a hybrid customer management and ticket system designed for rapid deployment and immediate productivity. The system combines simple customer relationship management with task-based ticket handling, enabling small teams to manage customer interactions and tasks without complex configuration.

## Features

- **Instant Customer Import**: Drag-and-drop CSV import with automatic field mapping
- **Pre-Built Task Pipeline**: Ready-to-use workflow with standard stages (New, In Progress, Waiting, Completed)
- **Unified Command Center**: Single view for managing all customer tickets and communications
- **Customer-Ticket Management**: Track all tickets associated with each customer
- **Ticket Assignment**: Assign tickets to team members with notifications
- **Data Export**: Export customer and ticket data at any time
- **Auto-save**: Automatic saving every 30 seconds to prevent data loss

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Testing**: Jest with fast-check for property-based testing

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 13+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd grip-crm
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your database and email configuration
```

⚠️ **SECURITY NOTICE**: Before running in production, read [SECURITY.md](./SECURITY.md) for critical security configuration steps.

4. Set up the database:
```bash
# Create PostgreSQL database
createdb grip_crm

# Run migrations (after implementing database setup)
npm run migrate
```

5. Start development servers:
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend React app on http://localhost:3000

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint all code

### Project Structure

```
grip-crm/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   └── package.json
└── package.json             # Root package.json
```

## Testing

The project uses a dual testing approach:

- **Unit Tests**: Test specific examples, edge cases, and error conditions
- **Property Tests**: Test universal properties across all inputs using fast-check

Run tests with:
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details