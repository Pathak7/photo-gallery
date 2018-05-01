
Photo gallery is webapp which is used for keeping all your precious memories and pictures. You can collect your favorite pictures and put them in one place.

The project uses Nodejs,Express,MongoDB,passportjs-local,expression session.

The following functionalities are implemented:
<h2>Albums</h2>
<li>Albums have a name,cover picture url,description(optional) </li>
<li>Albums can be created only by a signed in user</li>
<li>Albums are editable only by the user who created them </li>
<li>Albums can be deleted only by the user who created them </li>
<li> Private albums can only be accessed by the user who created it </li>
<li> Two visibility modes are provided for albums- public,private </li>
<li>Albums have one to many association with pictures</li> 

<h2>Pictures</h2>
<li>Pictures have a name,image source url,description (optional) </li>
<li>Pictures can be added to albums only</li>
<li>Pictures can be deleted only be the owner of album</li>

<h2>Users</h2> 
<li>Users have username,First name,last name,email,profile picture url,gender.</li>
<li>Users can create albums only when signed in </li>
<li>User can't visit a private album which he hasn't created</li>
<li>User has one to many relationship with albums</li>
<li>Users have a profile page  </li>
<li>Only can only update his own profile details(except the username) </li>


<h2>Authentication</h2>
<li>Authentication is done using express-session and passportjs (local) module.</li>
<li> User can only view any album after logging in </li>
<li>Public albums can be viewed and users can add pictures in them after logging in.</li>
<li>Every page is redirected to login page if the user is not signed in</li>

RESTFul implementation is followed exactly as given in the requirements,routes are exactly in the RESTful way .

<h3>Running the application</h3>

<p> Copy the complete repo in the laptop and run "node app.js " after installing all the dependencies . 2- Mlab is used the database which resides on cloud (Cloud as a service) so the project must not require mongo to be present on your system 3- To run locally,comment out the line where mongoose connects to mlab and comment in the localhost line. 4- The project has been deployed on heroku for easy view and run : </p>

https://photogallery7.herokuapp.com

Following features couldn't be implemented due to time constraints:
<li> Like button for pictures </li>
<li> Better frontend ( Needs lot of improvement)</li>
<li> Could have used angular but time constraint </li>
<li> Using environment variables for production and test databases</li> 
<li> Code refactoring ( app.js file is too long and needs to be refactored )</li> 
<li> Better schema modeling of albums and pictures.</li>


