# Wanderlust

## Description

Wanderlust is a full-stack Vacation Rental Platform developed using MongoDB, Express.js, Node.js, Passport.js, EJS, and Bootstrap. It allows users to browse and book vacation rentals.

## Features

- **MVC Architecture:** Implemented MVC architecture for better code organization and maintainability.
- **User Authentication:** Utilized Passport.js for user authentication, ensuring secure access to user accounts and data.
- **Image Storage:** Integrated Cloudinary for storing and managing images of vacation rentals.
  
## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** EJS, Bootstrap
- **Authentication:** Passport.js
- **Image Storage:** Cloudinary

## Installation

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Define the following variables:
     - `ATLASTDB_URL` (MongoDB connection string)
     - `SECRET` (Secret key for session management)
4. Run the application: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to the developers of the following npm packages used in this project:
- [Passport.js](http://www.passportjs.org/)
- [Cloudinary](https://cloudinary.com/)
- [Express.js](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Bootstrap](https://getbootstrap.com/)
