# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory in your Docker image
COPY package*.json ./

# Install the application’s dependencies inside the Docker image
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make port 443 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
