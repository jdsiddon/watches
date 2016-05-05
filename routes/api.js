const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Listing = mongoose.model('Listing');
const Site = mongoose.model('Site');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

// Stores images attached in public folder.
var upload = multer({
  dest: 'public/uploads',
  limits: { fileSize: 1000000, files: 1 }
});

/* Get all current listings. */
router.get('/listings', function(req, res, next) {
  Listing.find(function(err, listings) {
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


/* Create new listing. */
router.post('/listing/create', upload.single('image'), (req, res, next) => {
  // Write image to file.


  console.log(__dirname);
  var imageName = shortid.generate();

  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
  fs.writeFile(imageName, new Buffer(req.body.img, 'base64'), (err) => {
    var newListing = req.body;


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


  // })




  // req.body.img = "/" + req.file.destination.split("/")[1] + "/" + req.file.filename;   // /uploads/[IMG_NAME]
});


/* Edit listing */
router.put('/listing/update/:id', function(req, res, next) {
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

/* Edit listing */
router.delete('/listing/delete/:id', function(req, res, next) {

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


//// Sites

/* Get all current sites. */
router.get('/sites', function(req, res, next) {
  Site.find(function(err, sites) {
    if(err) {
      res.json({
        success: 'false',
        message: err
      });
    }

    res.json({
      success: 'true',
      message: 'success',
      sites: sites
    });
  })
});


/* Create new site. */
router.post('/site/create', function(req, res, next) {
  site = Site.create(req.body, function(err, site) {
    if(err) {
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
    res.json({
      success: 'true',
      message: 'success',
      site: site
    });
  });
});


/* Edit site */
router.put('/site/update/:id', function(req, res, next) {
  site = Site.findById(req.params.id, function(err, site) {      // Find the site.
    if(err || !site) {
      res.json({ success: 'false', failure: (err ? err : 'site not found') });
    } else {

      site.update(req.body, function(err, site) {
        if(err) {
          res.json({
            success: 'false',
            failure: err
          });
        }

        res.json({
          success: 'true',
          message: 'successfully updated site',
          site: site
        });

      });
    }
  })
});


/* Edit site */
router.delete('/site/delete/:id', function(req, res, next) {
  site = Site.findById(req.params.id, function(err, site) {
    if(err || !site) {
      res.json({ success: 'false', failure: (err ? err : 'site not found') });
    } else {

      listings = Listing.remove({_site: req.params.id}, function(err, listings) {
        site.remove(function(err, result) {
          if(err) {
            res.json({
              success: 'false',
              message: err
            });
          }

          res.json({
            success: 'true',
            message: result,
            success: site
          });
        })
      });

    }

  });
});

module.exports = router;
