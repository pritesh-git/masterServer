# MasterServer

This is an Express.js application that demonstrates basic CRUD (Create, Read, Update, Delete) operations for managing user data. It uses a MongoDB database to store user information.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [Endpoints](#endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (at least version 16.0.1)
- npm (Node Package Manager)
- MongoDB (installed and running)

### Installation

1. Clone the repository:

   ```bash
    git clone https://github.com/your-username/masterServer.git
   ```

2. Navigate to the project directory:
   ```bash
   cd masterServer
   ```
3. install the dependencies
   ```bash
   npm install
   ```
4. Rename .env.example to .env and configure the MongoDB connection URL.

## Usage

### Starting the Server

Run the following command to start the Express server:

```bash
 - npm run dev     //run in development mode
 - npm run prod    //run in production mode
```

The server will start on port 5000 by default. You can modify the port in the app.js file if needed.

## Endpoints

### The following endpoints are available:

<!-- [Download Postman Collection](MasterServer.collection.json) -->

## Database Schema

### The MongoDB schema for the user entity is as follows:

- **name**: User's name. Required.
- **phone_number**: User's phone number. Required.
- **email**: User's email address. Unique and not required by default.
- **password**: User's password. Required.
- **profile_pic**: Filename of the user's profile picture. Default is 'default_profile_pic.jpg'.
- **role**: User's role (enum). Default role is 'user'.
- **date_of_birth**: User's date of birth. Default is 0.
- **create_date**: Date when the user was created. Default is the current date and time.
- **otp**: User's One-Time Password (OTP). Default is '1111'.
- **verification_status**: Boolean indicating user verification status. Default is false.
- **active_status**: Boolean indicating user's active status. Default is true.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, follow the steps outlined in the CONTRIBUTING.md file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```bash
Remember to replace the placeholders such as `your-username`, `masterServer`, and others with your actual project details. If you want to provide more detailed guidelines and information about contributing and licensing, you can create `CONTRIBUTING.md` and `LICENSE` files as mentioned in the README.
```
