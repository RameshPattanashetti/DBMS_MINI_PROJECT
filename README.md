# IntelliBank - AI-Powered Banking Management & Analytics System

A full-stack intelligent banking management application for managing a bank's database with complex SQL queries, data analysis, administrative functionality, and AI-powered natural language interaction.

The system combines traditional DBMS functionality with modern **Artificial Intelligence (AI) and Natural Language Processing (NLP)** capabilities, allowing users to query banking data using plain English, generate customer-specific financial insights, and interact with an intelligent conversational banking assistant.

## Features

### Core Banking & DBMS Features

- **Database Dashboard**: Visual analytics with branch profitability, account distribution, and employee efficiency metrics
- **Query Executor**: Execute 5 complex SQL queries with nested subqueries and CTEs
- **Data Management**: Add customers, branches, and accounts with form validation
- **Real-time Analytics**: Interactive charts and data visualization
- **RESTful API**: Complete backend with Express.js and MySQL
- **Relational Database Management**: Structured banking data with primary keys, foreign keys, and integrity constraints

### AI & Natural Language Processing

- **Text-to-SQL Search Engine**: Converts plain-English prompts such as "Show total deposits for customer 101" into executable SQL queries dynamically
- **AI Customer Insights**: Analyzes spending habits, balances, transactions, loans, and financial profiles for specific customer IDs to generate tailored financial breakdowns
- **Interactive Banking Assistant**: Floating, persistent AI assistant widget in the bottom-right corner designed to answer customer queries and assist with banking operations without disrupting navigation
- **Natural Language Database Search**: Allows users to interact with banking data without manually writing SQL queries
- **AI-Powered Financial Analysis**: Converts raw banking information into meaningful and understandable customer insights

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+
- **APIs**: REST with JSON
- **AI & NLP**: Natural Language Processing, Text-to-SQL, AI-powered customer analysis, conversational banking assistant

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ running locally
- npm or yarn package manager

### 1. Database Setup

Create the MySQL database:

\`\`\`bash
mysql -u root -p < scripts/01-init-database.sql
\`\`\`

Note: Update credentials in the SQL file if needed. The script creates:
- BankManagement database
- All required tables with constraints
- Foreign key relationships

### 2. Environment Configuration

Create a `.env.local` file in the project root:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=BankManagement

# Server Configuration
PORT=5000

# Client Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

Update `DB_PASSWORD` with your actual MySQL password.

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

Required packages:
- next, react, react-dom
- express, cors
- mysql2/promise
- recharts (for charts)
- lucide-react (for icons)
- tailwindcss

### 4. Start the Application

**Terminal 1 - Start Backend Server:**

\`\`\`bash
npm run server
\`\`\`

The API will be available at `http://localhost:5000`

**Terminal 2 - Start Frontend (in a new terminal):**

\`\`\`bash
npm run dev
\`\`\`

The frontend will be available at `http://localhost:3000`

## Project Structure

\`\`\`
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   └── page.tsx            # Main page
├── components/
│   ├── navigation.tsx      # Navigation bar
│   ├── dashboard.tsx       # Analytics dashboard
│   ├── query-executor.tsx  # Query execution interface
│   ├── data-manager.tsx    # Data management interface
│   └── forms/              # Data entry forms
├── server/
│   ├── index.ts            # Express server
│   ├── db.ts               # Database connection
│   └── routes/             # API routes
│       ├── queries.ts      # Complex query endpoints
│       ├── analysis.ts     # Analysis query endpoints
│       └── data.ts         # Data management endpoints
└── scripts/
    └── 01-init-database.sql # Database initialization
\`\`\`

## API Endpoints

### Analytics Endpoints

- `GET /api/analysis/branch-profitability` - Branch financial metrics
- `GET /api/analysis/employee-efficiency` - Employee cost efficiency

### Query Endpoints

- `POST /api/queries/high-value-customers` - High-value loan and locker holders
- `POST /api/queries/branches-without-account-type` - Branches without recurring deposits
- `POST /api/queries/stressed-customers` - Customers with high loan-to-balance ratios
- `POST /api/queries/least-active-branch-employees` - Employees in least active branch
- `POST /api/queries/digital-adoption-gap` - Digital users without online transactions

### Data Management Endpoints

- `GET /api/data/customers` - List all customers
- `POST /api/data/customers` - Add new customer
- `GET /api/data/branches` - List all branches
- `POST /api/data/branches` - Add new branch
- `GET /api/data/accounts` - List all accounts
- `POST /api/data/accounts` - Add new account

### AI & NLP Endpoints

The AI layer provides natural-language interaction with the banking database and customer data.

#### Text-to-SQL Search

- Accepts plain-English banking queries
- Converts natural-language requests into SQL queries dynamically
- Executes validated SQL queries against the MySQL database
- Returns the requested banking information

#### AI Customer Insights

- Accepts a specific customer ID
- Retrieves relevant customer financial information
- Analyzes spending habits, balances, transactions, and financial profiles
- Generates tailored customer financial insights

#### Interactive Banking Assistant

- Provides a persistent conversational interface
- Accepts natural-language banking questions
- Assists users with banking-related queries and operations
- Remains accessible while navigating through the application

> **Note:** Update the exact AI endpoint paths here if the final implementation exposes dedicated AI routes.

## Database Schema

### Tables

- **Customer**: Customer information (cust_id, name, address, DOB)
- **Branch**: Branch details (branch_id, name, location)
- **Account**: Bank accounts (acc_no, type, balance, cust_id, branch_id)
- **Employee**: Branch employees (emp_id, name, position, salary, branch_id)
- **Loan**: Customer loans (loan_id, type, amount, cust_id)
- **Locker**: Safe deposit lockers (locker_id, size, rent, cust_id)
- **Service**: Banking services (service_id, name, type)
- **Transaction**: Account transactions (acc_no, trans_id, date, amount, type, mode)
- **Avails**: Services used by customers
- **Cust_Phone**: Customer phone numbers

## Features in Detail

### Dashboard Tab

The Dashboard provides an overview of banking operations using interactive charts and analytical metrics.

- **Branch Profitability Chart**: Bar chart showing total balance and account count per branch
- **Activity Distribution**: Pie chart showing account distribution
- **Employee Efficiency Table**: Cost per customer analysis for each branch
- **Interactive Analytics**: Visual representation of important banking metrics

### Queries Tab

Execute 5 complex SQL queries:

1. **High-Value Customers**: Find customers with both high loans AND large lockers
2. **Branches Without Account Type**: Identify branches lacking certain account types
3. **Financially Stressed Customers**: Analyze customers with loan-to-balance stress ratios
4. **Least Active Branch Employees**: View staff in the lowest-activity branch
5. **Digital Adoption Gap**: Find digital users who haven't transitioned to online banking

These queries demonstrate advanced DBMS concepts including:

- Nested subqueries
- Common Table Expressions (CTEs)
- Joins
- Aggregation
- Filtering
- Relational analysis

### Data Management Tab

Add new records to the system:

- Customer registration form
- Branch creation form
- Account opening form

Form validation ensures data integrity.

### AI & Natural Language Tab

The AI and NLP layer introduces intelligent interaction with the banking database.

#### Text-to-SQL Search Engine

The Text-to-SQL engine allows users to enter banking queries using plain English instead of writing SQL manually.

For example:

**User Input:**

\`\`\`text
Show total deposits for customer 101
\`\`\`

The system processes the natural-language request, dynamically generates the appropriate SQL query, executes it against the database, and returns the result.

Example workflow:

\`\`\`
Natural Language Query
        ↓
Query Understanding
        ↓
SQL Generation
        ↓
SQL Validation
        ↓
MySQL Database
        ↓
Query Execution
        ↓
Result
\`\`\`

Example natural-language queries include:

- "Show total deposits for customer 101"
- "Show all accounts belonging to customer 205"
- "What is the current balance of customer 101?"
- "Which branch has the highest total balance?"
- "Show customers with loans greater than 5 lakh"
- "Show recent transactions for customer 101"

This allows users without SQL knowledge to interact with the banking database efficiently.

### AI Customer Insights

The AI Customer Insights module analyzes financial information associated with a specific customer.

The system can analyze:

- Account balances
- Spending habits
- Transaction history
- Deposit activity
- Loan information
- Customer financial profile
- Account activity

The general workflow is:

\`\`\`
Customer ID
    ↓
Retrieve Customer Data
    ↓
Accounts + Balances + Transactions + Loans
    ↓
Data Analysis
    ↓
AI Processing
    ↓
Customer Financial Insights
\`\`\`

Instead of presenting only raw database records, the system generates meaningful financial breakdowns that help users understand customer activity.

### Interactive Banking Assistant

The Interactive Banking Assistant is implemented as a floating and persistent AI widget in the bottom-right corner of the application.

The assistant remains accessible while the user navigates through different sections of the banking system.

Users can ask questions such as:

\`\`\`text
What is the current balance of customer 101?
\`\`\`

or:

\`\`\`text
Show the recent transactions for customer 101
\`\`\`

The assistant can assist with:

- Customer information
- Account balances
- Transactions
- Deposits
- Loans
- Banking analytics
- Customer insights
- Database-related queries

The assistant provides a conversational layer over the existing banking management system without disrupting normal navigation.

## AI Architecture

The AI features work together with the existing banking database.

\`\`\`
                    USER
                      │
                      ↓
             Natural Language Input
                      │
          ┌───────────┴───────────┐
          │                       │
          ↓                       ↓
    Text-to-SQL Engine     Banking Assistant
          │                       │
          ↓                       ↓
    SQL Generation          Query / Intent
          │                       │
          └───────────┬───────────┘
                      ↓
                SQL Validation
                      │
                      ↓
                MySQL Database
                      │
                      ↓
                Retrieved Data
                      │
             ┌────────┴────────┐
             ↓                 ↓
        Query Result      AI Analysis
                               │
                               ↓
                       Customer Insights
                               │
                               ↓
                      Natural Language
                          Response
\`\`\`

## Error Handling

The application includes:

- Database connection error handling
- Query execution error messages
- API response error handling
- Form validation messages
- User-friendly error displays
- Invalid input handling
- AI query processing error handling
- Natural-language query error handling
- Database operation error handling

## Performance Considerations

- Connection pooling for database efficiency
- Indexed primary keys and foreign keys
- Efficient SQL queries with proper joins
- Frontend data caching with React state
- Responsive pagination for large result sets
- Efficient API communication
- SQL validation before query execution
- Structured processing of AI-generated queries

## Security Considerations

Since IntelliBank includes dynamically generated SQL through natural-language input, the AI query layer must be handled securely.

The application should ensure:

- Generated SQL queries are validated before execution
- Destructive SQL operations are restricted
- Database credentials are stored securely in environment variables
- User input is not directly concatenated into SQL queries
- Sensitive customer information is protected
- Only permitted database operations are executed

## Future Enhancements

- Authentication and authorization
- Role-based access control
- Advanced filtering and search
- Export data to CSV/PDF
- Real-time data updates with WebSockets
- Mobile responsive optimization
- Stored procedures integration
- Trigger monitoring dashboard
- Transaction history tracking
- Voice-based banking assistant
- Personalized financial recommendations
- Fraud and anomaly detection
- Advanced customer segmentation
- AI-powered financial forecasting
- Multi-language banking assistant
- Automated financial reporting

## Support

For issues or questions:

1. Check that MySQL is running
2. Verify environment variables in `.env.local`
3. Ensure both backend and frontend servers are running
4. Check browser console for frontend errors
5. Check terminal logs for backend errors
6. Verify AI/NLP configuration if AI features are not responding
7. Check generated SQL when debugging Text-to-SQL functionality

---

## Project Overview

IntelliBank combines a traditional relational banking database with modern AI and NLP capabilities.

The project demonstrates:

- Relational database design
- Complex SQL queries
- Database analytics
- RESTful backend development
- Full-stack web development
- Natural Language Processing
- Text-to-SQL generation
- AI-powered customer analysis
- Conversational AI interaction

The system provides both traditional database-driven banking functionality and modern AI-powered interfaces for interacting with financial data.

### Core Architecture

\`\`\`
Frontend
   │
   ↓
Next.js + React + Tailwind CSS
   │
   ↓
REST API
   │
   ↓
Express.js Backend
   │
   ├───────────────┐
   ↓               ↓
MySQL          AI / NLP Layer
Database           │
   │               ├── Text-to-SQL
   │               ├── Customer Insights
   │               └── Banking Assistant
   │
   └───────────────┘
          ↓
   Banking Analytics
\`\`\`

---

## Project Highlights

### Database

- MySQL 8.0+
- Relational database architecture
- Primary and foreign key constraints
- Indexed database fields
- Connection pooling
- Structured banking schema

### SQL

- Complex queries
- Nested subqueries
- CTEs
- Joins
- Aggregations
- Financial analysis queries

### Backend

- Node.js
- Express.js
- RESTful APIs
- JSON-based communication
- Database connection management

### Frontend

- Next.js 16
- React
- Tailwind CSS
- Recharts
- Interactive dashboards
- Form validation
- Persistent AI assistant interface

### AI & NLP

- Natural-language database querying
- Dynamic Text-to-SQL generation
- AI customer financial insights
- Conversational banking assistant
- Natural-language responses
- AI-powered financial analysis

---

## Conclusion

**IntelliBank - AI-Powered Banking Management & Analytics System** extends a traditional Bank Management System with modern AI and Natural Language Processing capabilities.

Instead of limiting users to predefined database operations, IntelliBank allows them to interact with banking information using natural language while still providing powerful DBMS functionality, advanced SQL analytics, data management, and interactive visualizations.

The combination of **MySQL, Express.js, Next.js, advanced SQL, NLP, Text-to-SQL, AI customer insights, and a conversational banking assistant** makes IntelliBank a comprehensive full-stack banking and AI project.

---

Built with **Next.js, React, Express.js, MySQL, NLP, Text-to-SQL, and AI** for the DBMS Mini Project.
