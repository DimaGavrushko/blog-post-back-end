FROM mhart/alpine-node:10.15
ENV APP_USER appuser
RUN addgroup -g 1000 $APP_USER && \
    adduser -D -u 1000 -G $APP_USER $APP_USER

COPY . /back-end
RUN chown $APP_USER:$APP_USER -R /back-end
USER $APP_USER
RUN cd back-end && npm i
CMD cd back-end && npm start