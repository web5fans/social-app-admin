FROM registry.devops.rivtower.com/library/nginx:alpine-amd64
COPY dist /usr/share/nginx/html
