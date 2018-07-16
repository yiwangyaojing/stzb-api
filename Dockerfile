FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:3.11.0-alpine
MAINTAINER zhoushunfa
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 2100
EXPOSE 2200
CMD node app.js