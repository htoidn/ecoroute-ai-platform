FROM gcr.io/distroless/base-debian12:latest
ARG APP_NAME=ecoroute-ai-platform
ARG APP_FILE=build/native/nativeCompile/${APP_NAME}
COPY ${APP_FILE} ./app
EXPOSE 8080
ENTRYPOINT ["/app"]