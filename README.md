# CapstoneProject

An online music store offering a smooth shopping experience for guitarists and music lovers.

# ERD 4 Example

Table User {
id serial [pk]
username varchar
email varchar
password varchar
}

Table Category {
id serial [pk]
name varchar
description text
}

Table Product {
id serial [pk]
category_id int [ref: > Category.id]
name varchar
description text
price decimal
discount decimal
stock int
image varchar
}

Table PaymentMethod {
id serial [pk]
method varchar
}

Table "Order" {
id serial [pk]
user_id int [ref: > User.id]
payment_method_id int [ref: > PaymentMethod.id]
created_at timestamp
total_price decimal
is_paid boolean
is_delivered boolean
}

Table OrderItem {
id serial [pk]
order_id int [ref: > Order.id]
product_id int [ref: > Product.id]
quantity int
price decimal
}

Table Feedback {
id serial [pk]
user_id int [ref: > User.id]
comment text
rating int
created_at timestamp
}

#####

# User Stories

As a user, I want to browse the website without logging in so I can explore the available musical instruments.

As a user, I want to view product categories (Guitars, Pianos, Drums, Amplifiers, Strings, etc.) so I can find the type of instrument I’m looking for easily.

As a user, I want to view detailed product information (name, price, discount, description, image) before making a purchase.

As a user, I want to create a new account using my email and password so I can place orders in the future.

As a user, I want a search bar to search for a specific instrument.

As a user, I want to add products to my shopping cart so I can review and purchase them later.

As a user, I want to choose my preferred payment method (Cash on Delivery or Visa) to complete my purchase.

As a user, I want to receive confirmation when my order is successfully placed.

As a user, I want to leave feedback or comments about the product or my shopping experience.

# for Admin

As an admin, I want to manage categories (add, edit, delete) to organize products effectively.

As an admin, I want to add new products with their images, prices, and discounts to keep the catalog updated.

As an admin, I want to read user feedback to improve the store’s performance and user experience.
