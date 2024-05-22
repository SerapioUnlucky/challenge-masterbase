FROM node

RUN mkdir -p /home/challenge-masterbase

COPY . /home/challenge-masterbase

EXPOSE 3000

CMD ["node", "/home/challenge-masterbase/src/index.js"]