#!/bin/sh
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="latest"
else
    TAG="$TRAVIS_BRANCH"
fi
docker build -t $DOCKER_USER/$DOCKER_BACK_END_IMAGE:$TAG .
docker push $DOCKER_USER/$DOCKER_BACK_END_IMAGE:$TAG