# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install root dependencies
RUN npm install

# Install client-side dependencies
RUN npm install --prefix client

# Copy the rest of your application code
COPY . .

# Run the build process (server and client)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
