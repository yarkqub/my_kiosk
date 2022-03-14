

# my_kiosk

  

- Simple POS Sistem, just begining more to add later

This is the point of sale system for my kiosk. It is a simple POS system that will allow you to sell items to customers. This current progress only finished around 20% of it's funcionality. We will be adding more features to it as we go along. Also we will fix the bugs that we find.

for now this project is open source, so you can see the code and contribute to it.
[Preview](https://remarkable-magical-cake.glitch.me/)

  

## Requirements

* [Node.js](https://nodejs.org/)

  

## Instruction

* Install the dependencies (use the command `npm install`)

* Run the server (use the command `npm run start`)

* The kiosk will be running on port 3000

* You can setup the Kiosk by going to the 'localhost:3000/admin.html' and use password `123`

* You can change the password and port in file 'app.js'

  

## Extra info

* You can use the command `npm run build` to build the project for production

  

## To do

[ ] Fix code finder for cashier (on going)

[ ] Fix the bug the product quantity when product is added to the cart

[ ] Disable products that are out of stock

[ ] Generate sales report

[✅] Styling kitchen display (We left it here because we are still working on it)

[✅] Styling client display (We left it here because we will be adding more features to it)

[ ] Make receipt can be printed (Can print without prompt)

[ ] Make cashier can re-print recipt for customer

[ ] Admin can create cashier account

[ ] Make login for cashier

[ ] Add option for item and can set default


## Bugs fixed

[✅] Fix cashier select item that have subcategory

[✅] Fix bug select items in first layer subcategory
    - If this still bug, reset all items / re-create the items


## To do done

[✅] Add full size keyboard (alphabet) when cahier click on input

[✅] Add subcategory to the products

[✅] Delete the subcategory from the products

[✅] Edit selected product

[✅] Add back button at cashier?

[✅] Add function to client display

[✅] After client order, display the receipt 

[✅] Make individual item have status done or not done

[✅] Admin can add image to product



## Extra info

To initiate your product go to `https://localhost:3000/admin.html` and use password `123` to login. You can add, edit and delete products in that page as admin. If you need to reset your order or your list of items just edit file `item.json` and `order.json`, to make it empty make sure put [] in them, don't let the files empty. We notice for production we will require diffrent apps to handle the client side as this apps act as a server. We will be adding more features to this app as we go along.



Credits to:

* StackOverflow

* GitHub

* Copilot

* Google

* W3schools

* WebDevSimplified (YouTube)

## Contact

if you got any problem or question, please contact me at: telegram [@muhdyarkqub](https://t.me/MuhdYarkqub) | email: myarkqub@gmail.com