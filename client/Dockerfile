# Step 1: Use an official Node.js image as a base for building
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the application code
COPY . .

# Step 5: Expose the port for development (Vite default port is 5173)
EXPOSE 5173

# Step 6: Start the Vite development server
CMD ["npm", "run", "dev"]


