const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Listing = mongoose.model('Listing');
const Site = mongoose.model('Site');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

// Stores images attached in public folder.
var upload = multer({
  dest: 'public/uploads',
  limits: { fileSize: 1000000, files: 1 }
});


/* Get all Listings. */
router.post('/',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
    Listing
    .find({ _user: req.user })
    .exec(function(err, listings) {
      if(err) {
        res.json({
          success: 'false',
          message: err
        });
      }

      res.json({
        success: 'true',
        message: 'success',
        listings: listings
      });
    })
  });

/* Get one Listing. */
router.post('/get',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
    console.log(req.body);
    Listing.findById(req.body.id, function(err, listing) {
      if(err) {
        res.json({
          success: 'false',
          message: err
        });
      }

      Site.findById(listing._site, function(err, site) {
        if(err) {
          res.json({
            success: 'false',
            message: err
          });
        }
        console.log(listing);
        console.log(site);
        res.json({
          success: 'true',
          message: 'success',
          listing: listing,
          site: site
        });
      })
    })
  });


/* Create new Listing. */
router.post('/new',
  passport.authenticate('local', { failureRedirect: '/login' }),
  upload.single('image'),
  function(req, res, next) {
    // Write image to file.
    console.log(__dirname);
    var imageName = shortid.generate();

    // => [Error: EISDIR: illegal operation on a directory, open <directory>]
    fs.writeFile(imageName, new Buffer(req.body.img, 'base64'), (err) => {
      var newListing = req.body;
      req.body._user = req.user._id;

      var oldPath = process.cwd() + '/' + imageName;
      var newPath = process.cwd() + '/public/uploads/' + imageName;

      fs.renameSync(oldPath, newPath);
      newListing.img = '/uploads/' + imageName;     // Link image up.

      // Now create the listing.
      Listing.create(req.body, function(err, listing) {
        if(err) {         // Validation messages.
          console.log(err);
          var simpleErr = new Array();

          for (var prop in err.errors) {
            simpleErr.push(err.errors[prop].message);
          }

          res.json({
            success: 'false',
            message: simpleErr
          });
          return;
        }

        // Link up the site.
        Site.findOne({"name": req.body.site}, function(err, site) {
          console.log(site);

          if(!site) {     // No site was found so create a new one.
            var newSite = {};
            newSite.name = req.body.site;
            newSite.url = "http://www." + req.body.site + ".com";

            Site.create(newSite, function(err, site) {
              newListing.site = site.id;

              listing._site = site._id;    // Connect the site to the listing.
              listing.save(function(err, listing) {
                res.json({
                  success: 'true',
                  message: 'success',
                  listing: listing
                });
              });

            });
          } else {

            listing._site = site._id;    // Connect the site to the listing.
            listing.save(function(err, listing) {
              res.json({
                success: 'true',
                message: 'success',
                listing: listing
              });
            });
          }

        });
      });
    });
});


/* Edit Listing */
router.put('/:id', function(req, res, next) {
  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err || !listing) {
      res.json({ success: 'false', failure: (err ? err : 'listing not found') });
    } else {

      if(req.body.site) {     // If user provided a site, link the site up.
        Site.findById(req.body.site, function(err, site) {
          listing._site = site._id;    // Connect the site to the listing.
          listing.save(function(err, listing) {
            res.json({
              success: 'true',
              message: 'success',
              listing: listing
            });
          })
        })
      } else {
        res.json({
          success: 'true',
          message: 'success',
          listing: listing
        });
      }

    }
  });
});

/* Delete Listing for Android */
router.post('/delete',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res, next) {
  listing = Listing.findById(req.body.id, function(err, listing) {      // Find the listing.
    if(err || !listing) {
      res.json({ success: 'false', failure: (err ? err : 'listing not found') });
    } else {

      listing.remove(function(err, result) {
        if(err) {
          res.json({
            success: 'false',
            message: err
          });
        }

        res.json({
          success: 'true',
          message: result,
          success: listing
        });
      });

    }
  });
});


/* Delete Listing */
router.delete('/:id', function(req, res, next) {
  listing = Listing.findById(req.params.id, function(err, listing) {      // Find the listing.
    if(err || !listing) {
      res.json({ success: 'false', failure: (err ? err : 'listing not found') });
    } else {

      listing.remove(function(err, result) {
        if(err) {
          res.json({
            success: 'false',
            message: err
          });
        }

        res.json({
          success: 'true',
          message: result,
          success: listing
        });
      });

    }
  });
});

module.exports = router;
