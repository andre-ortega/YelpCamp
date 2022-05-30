# YelpCamp

## Background

The Colt Steele Web Development Bootcamp is a well-known program for teaching the fundamentals of web programming. This includes not only the HTML/CSS/Javascript base, but further technologies needed to create fully functioning web appications. The terminal, dynamic templating, routers, cookies, RestFul APIs, MongoDB, and many more technologies are present in the instructions of this course, and all of them are used to create the YelpCamp application. This was a truly fantastic course that was worth more than what I paid for, and provided a scope of knowledge that was lacking from my university-level courses.

## Intro

After many hours of lessons providing the logic on which the web operates, they all come together in creating YelpCamp. During my development of this application, I chose to add a degree of difficulty by deviating from the provided instructions given for a Windows or Mac development environment and instead decided to create the app using Linux. WSL2 for Windows now (to my amazement) provides all of the functionality needed to run native Linux programs that I enjoy using. Therefore, aside from the Javascript and web framework languages used to create YelpCamp, I was assisted by some of my Python and Bash scripts used to speed up the processes of file organization, terminal operations, and Git workflows.

## Technologies

The project uses many technologies that ensure that the app is fully functional and hosted entirely in the cloud. These services include

- [MongoDB ATLAS](https://www.mongodb.com/atlas/database) - Cloud database service used to store information regarding users, sessions, campgrounds, and reviews.
- [Mongoose](https://mongoosejs.com/docs/) - Object Data Modeling library used to simplify database operations via a data mapping layer to define relational models.
- [Cloudinary](https://cloudinary.com/) - Cloud image-hosting service used to store images of specific campgrounds, the links to which are stored on the Mongo Atlas database.
- [NodeJS](https://nodejs.org/en/) - The quintessential javascript runtime engine that runs the server code.
- [Express](https://expressjs.com/) - Lightweight yet robust web application framework that manages the requests, routes, and responses surrounding web traffic.
- [EJS](https://ejs.co/) - Templating framework used to dynamically render web pages that fluctuate based on the data received from other cloud services.
- [Passport]() -
- [Mapbox]() - 

## Live Demo

Please be respectful of data you input into the live demo.

The demo is available on one of my Heroku distros, [here](https://nameless-scrubland-88013.herokuapp.com/). You can operate the site just like you would to test the operations of a basic Yelp clone used specifically for campsites. You may create an account, create a site, edit/delete your own sites, and leave reviews on others.
