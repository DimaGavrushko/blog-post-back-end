#!/bin/sh
echo "1"
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS
echo "1"
if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="latest"
else
    TAG="$TRAVIS_BRANCH"
fi
echo "1"
docker build -t $DOCKER_USER/$DOCKER_BACK_END_IMAGE:$TAG ..
echo "1"
docker push $DOCKER_USER/$DOCKER_BACK_END_IMAGE:$TAG