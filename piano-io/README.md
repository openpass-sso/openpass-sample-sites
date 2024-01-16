# OpenPass piano.io integration

* A simple reference example of a publisher site implementing the OpenPass SSO experience via a [piano.io](https://www.piano.io/) OpenPass affliate integration.

## piano.io integration

To integrate with [piano.io](https://www.piano.io/), simply add the piano.io integration JavaScript script as per the example html files in this example. Seach for `<!-- piano.io integration script -->` to find where this script was added. Refer to the [piano.io integration docs here](https://docs.piano.io/track/implementing-piano).

## Configuration

The following environment variables are supported:

* PORT -- The express server port

## How to run locally

You can run this project locally via `npm` or use docker (see section below).

```
git clone git@github.com:openpass-sso/openpass-sample-sites.git
cd openpass-js-test-site/piano-io

# to install dependencies
npm install

# to run the server with hot-reloading
npm run server
```

## Docker
To build the container from the Dockerfile:
```
docker build . -t openpass-sample-sites-piano-io:latest
```

To run the container in attached mode exposing port 3002 (this is the default port in the openpass-api allowed client redirect config, changing this will require you to change the api config as well):
```
# run the docker container with default config
docker run -p 3002:3002 --name openpass-sample-sites-piano-io openpass-sample-sites-piano-io:latest
```

For ease of local testing, it is recommended to leave the test site running in your local Docker instance in detached mode:
```
docker run -d -p 3002:3002 --name openpass-sample-sites-piano-io openpass-sample-sites-piano-io:latest
```

To remove the detached local testing container:
```
docker stop openpass-sample-sites-piano-io
docker rm openpass-sample-sites-piano-io
```

To remove the build image, you can run the following command, however this is not really required:
```
docker rm openpass-sample-sites-piano-io
```
