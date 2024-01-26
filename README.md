# OurTime Client
The OurTime Client is a React-based web application designed to facilitate video communication between users. It leverages the WebRTC technology for real-time communication and integrates with a SignalR server to manage signaling and call setup. The application allows users to log in, initiate video calls, receive incoming calls, send messages, and disconnect from calls.

## Application Structure
### Real-time Signaling (signalRService.js)
Handles the SignalR connection to the server for real-time signaling. 
Configures and manages a SignalR connection using the HubConnectionBuilder.
Provides a method (startConnection) to initiate and start the SignalR connection.
SignalR is utilized for real-time signaling to manage call setup, incoming call notifications, and message exchange. 
### Video Calling (simple-peer.js)
Manages the video calling functionality using WebRTC and SignalR. Users can make video calls to their friends by entering their friend's ID. WebRTC is used to exchange client audio/video media data between peers for communication.
Uses React state, effects, and refs for managing video call state.
Integrates the simple-peer library for peer-to-peer communication.
Implements a responsive UI for initiating, accepting, and disconnecting video calls.
### Simple-Peer Library
The simple-peer library is integrated to facilitate peer-to-peer webRTC communication, allowing video and audio streams to be exchanged between users. This abstracts under-the-hood webRTC code such as the formation and exchange of Stun/Turn Servers, Ice Candidates, and SDP Offers and Answers between peers which greatly streamlines the logic and clarity of the project.
### Login, Register, and Navbar
1. Login.js
Represents the login page of the application. Collects user credentials (username and password).
Dispatches an action to update the Redux store with the authentication token upon successful login.
Uses React Router for navigation.
2. Signup.js
Represents the signup page of the application. Collects user details for registration (username, email, and password).  Utilizes Axios for backend communication with .NET server to successfully register user into local MSSQL relational database. Will navigate client into login page upon successful registration completion
3. Navbar.js
Displays the navigation bar at the top of the application. Shows navigation links for Home, Mission, Contact Us, and Coming Soon.
Displays the current user's name through Redux by using React-Redux's UseSelector hook which allows for access of global state in Redux Store.
Includes a search bar and a logout button.
Utilizes React Router for navigation.
### Redux
The application supports user authentication using a login and signup system.
Redux is employed to manage the user's authentication token and credentials.
1. Redux for JWT (tokenSlice.js)
Manages the Redux state slice for user authentication tokens. Provides a reducer function (setToken) to update the current token.
2. Redux for User (userSlice.js)
Manages the Redux state slice for user information. Includes a reducer function (setCurrentUser) to update the current user.
3. Redux Store
Configures the Redux store by combining user and token slices. Uses configureStore from Redux Toolkit to create the store.
## Additional Notes
There is an outdated component (VideoRoom.js) which handled the video calling functionality of WebRTC through SignalR WITHOUT the simple-peer library. Therefore, it contains a more complicated version of the code as the component manually fetches a google stun server, generates and exchanges iceCandidates, SDP Offers, and SDP Answers.



