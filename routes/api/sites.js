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
router.post('/site', function(req, res, next) {
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
router.put('/site/:id', function(req, res, next) {
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


/* Delete site */
router.delete('/site/:id', function(req, res, next) {
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
