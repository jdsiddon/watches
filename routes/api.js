const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Listing = mongoose.model('Listing');
const Site = mongoose.model('Site');
const multer = require('multer');

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
router.post('/listing/create', upload.single('image'), function(req, res, next) {

  req.body.img = req.file.path;     // Get image path.
  
  listing = Listing.create(req.body, function(err, listing) {
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
  });
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
