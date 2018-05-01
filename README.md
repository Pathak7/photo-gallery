
Photo gallery is webapp which is used for keeping all your precious memories and pictures. You can collect your favorite pictures and put them in one place.

The project uses Nodejs,Express,MongoDB,passportjs-local,expression session.

The following functionalities are implemented:
Albums 
1- Albums have a name,cover picture url,description(optional) 
2- Albums can be created only by a signed in user
3- Albums are editable only by the user who created them 
4- Albums can be deleted only by the user who created them 
5- Private albums can only be accessed by the user who created it 
6- Two visibility modes are provided for albums- public,private 
7- Albums have one to many association with pictures

Pictures
1- Pictures have a name,image source url,description (optional) 
2- Pictures can be added to albums only
3- Pictures can be deleted only be the owner of album

Users 
1-Users have username,First name,last name,email,profile picture url,gender.
2- Users can create albums only when signed in 
3- User can't visit a private album which he hasn't created
4- User has one to many relationship with albums
5- Users have a profile page 
6- Only can only update his own profile details(except the username)

Authentication 
1- Authentication is done using express-session and passportjs (local) module.
2- User can only view any album after logging in 
3- Public albums can be viewed and users can add pictures in them after logging in.
4- Every page is redirected to login page if the user is not signed in

RESTFul implentation is followed exactly as given in the requirements,routes are exactly in the RESTful way .

Running the application

1- Copy the complete repo in the laptop and run "node app.js " after installing all the dependencies . 2- Mlab is used the database which resides on cloud (Cloud as a service) so the project must not require mongo to be present on your system 3- To run locally,comment out the line where mongoose connects to mlab and comment in the localhost line. 4- The project has been deployed on heroku for easy view and run :

https://photogallery7.herokuapp.com

Following features couldn't be implemented due to time constraints:
1- Like button for pictures
2- Better frontend ( Needs lot of improvement)
3- Could have used angular but time constraint 
4- Using environment variables for production and test databases 
5- Code refactoring ( app.js file is too long and needs to be refactored ) 
6- Better schema modeling of albums and pictures.

Thank you
