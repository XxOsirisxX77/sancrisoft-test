# Vehicle Display App - Sancrisoft Challenge

Welcome to the Vehicle Display App!  
This is an interview code challange to display vehicles

This project uses:

- [Node.js](https://nodejs.org/) for the backend
- [SQLite3](https://www.sqlite.org/) as the database engine
- [ReactJS](https://react.dev/) as the JavaScript library to render the frontend

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

## Features

- Migration tool to retrieve and store the vehicles data.
- Display a variety of vehicles with images and details.
- Fetch vehicle data from the local `Node.js` API.
- Delete and update vehicle data.
- Display detail data of the vehicle once you click on its image in the table.
- Simple and intuitive user interface.

## Getting Started

To get started with the Vehicle Display App, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your development machine.

### Installation

1. Clone this repository to your local machine:

```bash
git clone git@github.com:XxOsirisxX77/sancrisoft-test.git
```

2. Navigate to the project directory:

```bash
cd sancrisoft-test
```

3. Install the project dependencies using `package-lock.json`:

```bash
npm ci
```

4. Migrate the vehicles data:

```bash
node ./migration/migrate-vehicles.js
```

5. Run the `Node.js` server

```bash
node ./server/server.js
```

6. Run the frontend part of the application

```bash
npm start
```

7. At this point, you should be with your predetermined web browser at localhost with the web application running!
