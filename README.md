Data

Watch
- Brand
- Model
- Has many prices


Quote
- Has one watch through source
- Price
- Date found
- Auction or not (buy it now, or from store, or bids)


Source - Place the watch is listed
- Has many watches
- URL


*** Tests

*** Get All Sites (GET)
curl localhost:3000/api/sites

*** Create Site (POST)
curl --data "name=testing website&url=www.testingsite.com" localhost:3000/api/site/create

*** Update Site Name (PUT)
curl -X PUT -d name='Update Name' localhost:3000/api/site/update/571be544ea5edb6d062c474c

*** Delete Site (DELETE)
curl -X "DELETE" localhost:3000/api/site/delete/571be544ea5edb6d062c474c


*** Get All Listings (GET)
curl localhost:3000/api/sites

*** Create Listing (POST)
curl --data "watch[brand]=rol&watch[model_name]=sub&price=2.99&date=2/2/14&url=www.ebay.com/item/123&type=Auction&state=New" localhost:3000/api/listing/create

*** Update Listing Price (PUT)
curl -X PUT -d price='3.56' localhost:3000/api/listing/update/571be809b86eb1220795673d

*** Delete Listing (DELETE)
curl -X "DELETE" localhost:3000/api/listing/delete/571be544ea5edb6d062c474c


*** Connect Listing to Site
