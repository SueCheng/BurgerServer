# Burger 

Full stack JavaScript app that lets users log in to customize burger and order pizza at restaurants in specific suburb.

### User Stories

1. As an unauthenticated user, I can search restaurants in specific suburb.
2. As an unauthenticated user, I can customize burger and choose pizza menu items.
3. As an unauthenticated user, I can sign up locally, sign in locally or using facebook, google account.
4. As an unauthenticated user, I will be prompted to log in if I tried to order
5. As an authenticated user, I can add my customized burger and pizza menu items to shoppingcart.
6. As an authenticated user, I can view items in my shoppingcart.
7. As an authenticated user, I can fill my address to finalize buying.
8. As an authenticated user, I can view orders.
9. As an authenticated user, I can log out.
10. the GUI will display responsively on screen with different widths and height.
11. Any error(GUI error,network error,system error etc)will get immediately clear hint on the current page or a modal dialog

### animation of senario
![alt unauthorizeduser](https://github.com/SueCheng/BurgerServer/blob/master/unauthorizeduser.gif)
![alt authorizeduser](https://github.com/SueCheng/BurgerServer/blob/master/authorizeduser.gif)

### Technology Used:

#### Client
* Passport (Local/Google/Facebook)
* React
* Redux
* React-Redux
* Semantic-ui-react
* Redux Form
* React google maps
* React thunk
* Webpack
* Babel
* sass
* jest
* enzyme

#### Server
* Node
* Express
* MongoDB
* Mongoose


### Installation:

Provided node and NPM are installed, enter the following CLI command to install dependencies:
```
$ npm install
```

### Usage:
A Google app ID, Google app secret, Facebook app ID, Facebook app secret and valid Mongo URI are required. Check the respective documentation to set them up. 
these values could be set up at /config/dev.js for development version, at /config/prod.js for production version.

To run the server side,enter the following command:
```
$npm run start

```
To run the client side,enter the following command:
```
$npm run client

```
To run the whole project,enter the following command:
```
$npm run dev

```
### Heroku Demo:

You can view a live demo of the app at https://burgerserver.herokuapp.com/
