const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const upload = multer({dest:'uploads/'});

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing))

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//Edit route
router.get("/:id/edit",isLoggedIn,listingController.renderEditForm);

module.exports = router;