const User = require("../models/User");
const Order = require("../models/Order");
const RestaurantAddress = require("../models/restaurantAddressSchema");
const _ = require("lodash");
const requireLogin = require("../middlewares/requireLogin");

//consider to refactor the callback hell to await syntax later

module.exports = app => {
  app.post("/data/shoppingcart", requireLogin, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log("find the corresponding user error", err);
        next(err);
      } else if (user) {
        Array.prototype.push.apply(user.shoppingCart, req.body); //get array as parameter,merge two aray
        //user.shoppingCart.push(req.body); //since itemschema include a map array, here save should use set ,need test
        user.save(err => {
          if (err) {
            console.log("save shoppingcart error", err);
            next(err);
          } else {
            console.log("save item to shoppingCart success");
            res.send(user.shoppingCart);
          }
        });
      } else {
        console.log("can't find corresponding user");
        next(new Error("can't find corresponding user"));
        //res.status(401).send("can't find corresponding user");
      }
    });
  });
  app.post("/data/order", requireLogin, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log("find the corresponding user error", err);
        next(err);
      } else if (user) {
        let newOrder = new Order();
        //make order from body info
        newOrder._user = req.user._id;
        _.assign(newOrder, req.body); //since itemschema include a map array, here save should use set ,need test
        /*
        newOrder.totalPrice = req.body.totalPrice;
        newOrder.address = req.body.address;
        newOrder.items = req.body.items;
        newOrder.status = req.body.status;*/
        newOrder.save((err, order) => {
          if (err) {
            console.log("save order error", err);
            res.status(401).send("save order error");
          } else {
            console.log("save order success");
            //clean shopping cart,user is a mongoose instance without lean true option set
            user.set("shoppingCart", []); //can't user = ,otherwise will be set to null
            user.save(err => {
              if (err) {
                console.log("save shoppingcart error", err);
                next(err);
              } else {
                console.log(
                  "clear shoppingCart success,send user back to client"
                );
                res.send(req.user);
              }
            });
          }
        });
      } else {
        console.log("can't find corresponding user");
        res.status(401).send("can't find corresponding user");
      }
    });
  });

  app.get("/data/shoppingcart", requireLogin, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log("find the corresponding user error", err);
        next(err);
      } else if (user) {
        res.send(user.shoppingCart);
      } else {
        console.log("can't find corresponding user");
        next(new Error("can't find corresponding user"));
      }
    });
  });

  app.get("/data/order", requireLogin, (req, res, next) => {
    User.findById(req.user._id, (err, user) => {
      if (err) {
        console.log("find the corresponding user error", err);
        next(err);
      } else if (user) {
        Order.find(
          { _user: req.user.id },
          null,
          { lean: true },
          (err, docs) => {
            if (err) {
              console.log("find order error", err);
              ext(err);
            } else if (docs.length >= 0) {
              //may need debug for the return make sure it's an array of js object
              res.send(docs);
            } else {
              res.send();
            }
          }
        );
      } else {
        console.log("can't find corresponding user");
        next(new Error("can't find corresponding user"));
      }
    });
  });

  app.get("/data/restaurantlist/search", function(req, res) {
    RestaurantAddress.find(
      { address: { $regex: req.query.key, $options: "i" } },
      "-_id address lat lng menu",
      (err, addressList) => {
        if (err) {
          console.log("find the corresponding restaurantList error", err);
          next(err);
        } else if (addressList) {
          res.send(addressList);
        } else {
          console.log("find no corresponding restaurant list");
          next(new Error("find no corresponding restaurant list"));
        }
      }
    );
  });
};
