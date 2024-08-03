# Use an official Node.js runtime as the base image
FROM public.ecr.aws/v7s7p8q8/node16:latest
RUN npm install pm2 -g

RUN ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 5014

CMD ["pm2-runtime", "npm", "--", "start"]



