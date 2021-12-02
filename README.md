# **Catwalk Team-Ariel Products API**

### Table of contents:
---
1. [About This Project](#About-This-Project)
    * [Author Bio](#Author-Bio)
    * [Technologies used](#Technologies-used)
2. [Getting Started:](#Getting-Started)
    - [Prerequisites](#Prerequisites)
    - [Installation](#Installation)
3. [API Guide:](#API-Guide)
    - [GET /products](#Endpoints)
    - [GET /products/:product_id](#Endpoints)
    - [GET /products/:product_id/styles](#Endpoints)
    - [GET /products/:product_id/related](#Endpoints)
4. [Testing Guide](#Testing-Guide)
---
## About This Project
---

Project Catwalk is a complete remodeling of the backend server and database for a clothing outlet website. Our team was tasked with setting up multiple API endpoints allowing traffic up to 1000 requests per second with a latency of under 200ms per request. Using horizontally scaling architecture to construct our server system and database combined with Amazon Web Services EC2 cloud computing we created a flexible efficient system to access product data.

This repository is the API and database for the product information, Created by James Plier. https://github.com/Jplier

---

## Technologies used
---
  1. Nodejs: Provides an asynchronous event-driven runtime environment for building scalable network applications
  2. Express: Javascript module for enabling flexible HTTP routing methods
  3. Postgresql: A robuts and stable open source database management system
  4. Amazon Web Services EC2: Amazon's Free elastic Cloud Computing platform
  5. Nginx: Enables load balancing HTTP traffic between many different servers
  6. Loader.io: Stress testing application
  7. Jest:

## Author Bio
---
This is the capstone project of James Plier during his time at Hack Reactor software engineering immersive. Based in Richmond, Va. Upcoming software engineer.

## Getting Started
---
### Prerequisites
---
    * Nodejs
    * Git
    * Postgresql

  ---

## Installation:
---
1. To clone repository paste the following code in your directory using the terminal:
```
git clone https://github.com/Team-Ariel/James-Plier-SDC.git
```
2. To install dependencies:
```
npm install
```
3. To start server:
```
npm start
```
4. To access the database you will require an open version of postgreql. Navigate to the root of this repository and upload the postgres schema file using the following command. This will create the database and tables automtically.
```
node run server/PostgresqlSchema.js
```
5. To access the database through the server use a postman or other http mocking service at the provided localhost endpoints.
---

# API Guide
---

## Endpoints:
---
1. GET http://localhost:3000/products - Retrieves product information. Optional parameters: Page, Count. Defaults to count 5, page 0
2. GET http://localhost:3000/products/:product_id/styles - Retrieves style information based on product_id URL parameter
3. GET http://localhost:3000/products/:product_id - Retrieves information for single product including features.
4. GET http://localhost:3000/products/:product_id/related - Retrieves related productId information based on product_id URL parameter.

---

# Testing Guide:
---
To run local testing suite run the following command from the repository terminal:
```
npm test
```
This will run the jest server.spec file


