INSERT INTO customers (first_name,last_name,phone_number)
VALUES ('Asha','Patel','9000000001'),
       ('Rohit','Sharma','9000000002');

INSERT INTO addresses (customer_id,address_details,city,state,pin_code)
VALUES
  (1,'12 MG Road, Flat 3B','Pune','MH','411001'),
  (1,'221 Baker Street','Pune','MH','411002'),
  (2,'5 Park View','Hyderabad','TS','500081');
