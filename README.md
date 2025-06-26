# FullStack_Intern_Coding_Challenge

<pre>
- Steps to Run the Project:
  1. Clone the Repository: https://github.com/suryatop/FullStack_Intern_Coding_Challenge.git
  2. cd FullStack_Intern_Coding_Challenge
- Install Dependencies for Frontend:
  1. cd frontend
  2. npm install
  3. npm install axios react-router-dom tailwindcss@3 postcss autoprefixer
  4. npx tailwindcss init -p
  5. npm run dev
- Install Dependencies for Server:
  1. cd server
  2. npm init -y
  3. npm install express cors bcrypt jsonwebtoken mysql2 nodemon
- Install DB MySQL: 
  1. create a file in server ".env"
  
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=authentication
JWT_KEY=supersecretkey
  
</pre>
     
</br>
Tech Stack:
<pre>Backend: Any one of backend framework from this ExpressJs/Loopback/NestJs
Database: PostgreSQL/MySQL
Frontend: ReactJs
</pre>

User Roles:
<pre>1. System Administrator
2. Normal User
3. Store Owner
</pre>

Entity-Relationship diagram: 
<pre>
<img width="535" alt="Screenshot 2025-06-26 at 12 03 06 PM" src="https://github.com/user-attachments/assets/b5c2514b-27e4-437b-bd54-e4b3faf6eeaa" />
  
**ER Diagram Description**
Entities and Attributes
users:
-id (Primary Key): INT
-username: VARCHAR(60)
-email: VARCHAR(100)
-password: VARCHAR(255)
-address: VARCHAR(400)
-role_id: INT (Foreign Key → roledb.id)
  
roledb:
-id (Primary Key): INT
-role_name: ENUM (e.g., 'admin', 'customer', etc.)

ratings:
-id (Primary Key): INT
-user_id: INT (Foreign Key → users.id)
-store_id: INT
-rating: FLOAT
-comment: TEXT
-created_at: TIMESTAMP

Relationships:
**users - roledb**
-One-to-Many relationship: A role (roledb) can be assigned to many users.
-Foreign key: users.role_id → roledb.id

**ratings - users**
- One-to-Many relationship: A user can give many ratings.
- Foreign key: ratings.user_id → users.id

</pre>

**Lobby Page:**
<img width="1440" alt="Screenshot 2025-06-26 at 11 50 31 AM" src="https://github.com/user-attachments/assets/5f5258dd-83fe-4873-8375-5b559bd1c475" />

# System Administrator:
**Admin Login Page:**
<img width="1440" alt="Screenshot 2025-06-26 at 11 51 33 AM" src="https://github.com/user-attachments/assets/2929c72a-499b-430a-9abc-7b5b873b1d0d" />

**Admin Register Page:**
support all validations:-</br>
<pre>
Name: Min 20 characters, Max 60 characters.
Address: Max 400 characters.
Password: 8-16 characters, must include at least one uppercase letter and one
special character.
Email: Must follow standard email validation rules.
</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 12 24 26 PM" src="https://github.com/user-attachments/assets/7cc3efe6-f1a1-41f3-83c1-cf82c83fecf7" />
</br>
</br>

**Admin Home Page:**
<img width="1440" alt="Screenshot 2025-06-26 at 12 54 18 PM" src="https://github.com/user-attachments/assets/0a67b4af-6b78-46c1-b3cf-0197efbc31ac" />
<img width="1440" alt="Screenshot 2025-06-26 at 12 45 34 PM" src="https://github.com/user-attachments/assets/dc87c400-a44d-4385-ac06-0e24b3a4da64" />

**Admin Home Page:** 
- Can add new stores, normal users, and admin users.</br>
- Can add new users with the following details:
<pre>
Name
Email
Password
Address
</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 12 51 11 PM" src="https://github.com/user-attachments/assets/2d5ab176-da96-4a4a-a72f-40c6cfbb4577" />
</br>

- Updated Table in Admin Home Page:


<img width="1440" alt="Screenshot 2025-06-26 at 12 52 19 PM" src="https://github.com/user-attachments/assets/38cc0468-0117-46df-a651-2a12a8c0e36e" />

- Has access to a dashboard displaying:
- Can log out from the system.
<pre>
Total number of users
Total number of stores
Total number of submitted ratings
</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 12 56 44 PM" src="https://github.com/user-attachments/assets/bc8ad9c2-6cdc-47f3-8735-65fd506dc2c0" />

- Can view a list of stores with the following details:
<pre>
Name, Email, Address, Rating
</pre>
- Can view details of all users, including Name, Email, Address, and Role.</br>
  If the user is a Store Owner, their Rating should also be displayed.
  
<img width="1440" alt="Screenshot 2025-06-26 at 1 05 18 PM" src="https://github.com/user-attachments/assets/e09b9612-f05d-425d-9222-45d84dfbbebd" />

- Can view a list of normal and admin users with:
<pre>
Name, Email, Address, Role
</pre>

<img width="1440" alt="Screenshot 2025-06-26 at 1 05 48 PM" src="https://github.com/user-attachments/assets/78c711de-437e-4cb3-a1f8-965e1cea5c54" />

- Can apply filters on all listings based on Name, Email, Address, and Role.
  
<pre>Name:</pre>
<img width="1434" alt="Screenshot 2025-06-26 at 1 13 47 PM" src="https://github.com/user-attachments/assets/a5b2f86c-861a-4c26-873d-fd3adcb9af3f" />

<pre>Email:</pre>
<img width="1432" alt="Screenshot 2025-06-26 at 1 15 25 PM" src="https://github.com/user-attachments/assets/f05b12eb-555f-403d-ad53-e9f8d3953e60" />

<pre>Address:</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 1 15 59 PM" src="https://github.com/user-attachments/assets/76d30259-e14e-499a-9788-278b00ba8170" />

# Normal User

- Can sign up and log in to the platform.
  
<img width="1440" alt="Screenshot 2025-06-26 at 1 18 47 PM" src="https://github.com/user-attachments/assets/7ef7312f-34a9-412f-a94f-f818289ecc62" />

- Signup form fields:
<pre>
Name
Email
Address
Password
</pre>

- support all validations:-</br>
<pre>
Name: Min 20 characters, Max 60 characters.
Address: Max 400 characters.
Password: 8-16 characters, must include at least one uppercase letter and one
special character.
Email: Must follow standard email validation rules.
</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 1 19 33 PM" src="https://github.com/user-attachments/assets/f93d1a26-6fd5-4129-a649-189d5c5e5405" />

**User Home Page:**
<img width="1440" alt="Screenshot 2025-06-26 at 1 23 17 PM" src="https://github.com/user-attachments/assets/63f9b2c8-0893-45ef-ab21-daff7f9d4094" />
- Can update their password after logging in.
<img width="1440" alt="Screenshot 2025-06-26 at 1 25 58 PM" src="https://github.com/user-attachments/assets/f29928c5-3ff9-45ab-b5ad-5077e850ee0d" />

- Can view a list of all registered stores.
  
<img width="1440" alt="Screenshot 2025-06-26 at 1 27 07 PM" src="https://github.com/user-attachments/assets/7d1b7cdc-443c-4983-93fe-ca0a48e8cad3" />

- Can search for stores by Name and Address.
  
<pre>Name</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 1 28 22 PM" src="https://github.com/user-attachments/assets/66a8933c-1131-4cf6-b88d-392f3118cc3e" />

<pre>Address</pre>
<img width="1440" alt="Screenshot 2025-06-26 at 1 29 12 PM" src="https://github.com/user-attachments/assets/f655dc9b-77c7-4eaf-ae50-136cb53e5611" />

- Store listings should display:
- Can submit ratings (between 1 to 5) for individual stores.
<pre>
Store Name
Address
Overall Rating
User's Submitted Rating
Option to submit a rating
Option to modify their submitted rating
</pre>
<img width="1416" alt="Screenshot 2025-06-26 at 1 30 35 PM" src="https://github.com/user-attachments/assets/e362a319-ff7f-43b6-ad06-9c4f903731f3" />
<pre>modify their submitted rating</pre>
<img width="1426" alt="Screenshot 2025-06-26 at 1 34 12 PM" src="https://github.com/user-attachments/assets/d5d7a76d-5634-48f1-8968-24c6a7fdd0bf" />

- Can log out from the system.
<img width="1440" alt="Screenshot 2025-06-26 at 1 36 28 PM" src="https://github.com/user-attachments/assets/13530968-02d5-4072-b662-ce7becbd5f5c" />

# Store Owner

- Can log in to the platform.

<img width="1440" alt="Screenshot 2025-06-26 at 2 00 05 PM" src="https://github.com/user-attachments/assets/984e305c-face-4fc5-aa66-c50ef2e137f6" />
<img width="1440" alt="Screenshot 2025-06-26 at 12 36 08 PM" src="https://github.com/user-attachments/assets/8f782f68-d0d2-460b-b047-0e926edd259b" />

**User Home Page:**

<img width="1440" alt="Screenshot 2025-06-26 at 2 02 52 PM" src="https://github.com/user-attachments/assets/2fa4777f-c9fb-4621-812b-343aa078ad40" />

- Can update their password after logging in
- support all validations:
<pre>
Name: Min 20 characters, Max 60 characters.
Address: Max 400 characters.
Password: 8-16 characters, must include at least one uppercase letter and one
special character.
Email: Must follow standard email validation rules.
</pre>

<img width="1440" alt="Screenshot 2025-06-26 at 2 05 29 PM" src="https://github.com/user-attachments/assets/800ef312-5933-48cf-9c1b-90c384f6d01f" />

- Dashboard functionalities:
</br>

  -View a list of users who have submitted ratings for their store.</br>
  -See the average rating of their store.
  
<img width="1440" alt="Screenshot 2025-06-26 at 2 07 17 PM" src="https://github.com/user-attachments/assets/b6fa6c70-537e-4499-bb2d-9f0d9be2ce0e" />

- Can log out from the system
  
<img width="1440" alt="Screenshot 2025-06-26 at 2 08 06 PM" src="https://github.com/user-attachments/assets/0e1feadd-1634-47f4-8b57-f34a69b7ce73" />
To keep the GitHub repository clean, secure, and efficient, I have used a .gitignore file that:
<pre>
Ignore node_modules for both frontend and server
/frontend/node_modules
/server/node_modules

Ignore environment variables
/frontend/.env
/server/.env

Ignore build or dist folders (if any)
/frontend/build
/server/dist

Ignore log files
*.log

Ignore any specific IDE or editor files
.vscode/
.idea/
</pre>


