# FX1 CMS

FX1 CMS is the official CMS tool for FX1 pips.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install FX1 CMS packages.

```bash
npm install
```

## Usage
1. Run `generate:nexus`
2. Before running `dev`, add the following environment variables. As for the value, consult one of the developers.

## Environment Variables
Key | Value | Description
--- | --- | ---
MONGODB_URI | *Ask the developers* | MongoDB host and options to be used
APP_ENV | **Local/Develop/Staging**: <br />`develop` <br /><br /> **Production**: <br />`production` | Indicate the environment server is running in
PORT | *By default: `8080`* | Server port
GOOGLE_APPLICATION_CREDENTIALS_CMS | *Ask the developers* | Service account in Base64
REDIRECTING_DOMAIN_CMS | *Ask the developers* | Redirecting Domain for CMS
SENDGRID_API_KEY | *Ask the developers* | SendGrid API Key
REDIRECTING_DOMAIN_FX1 | *Ask the developers* | Redirecting Domain for FX1
FIREBASE_CONFIG_CMS | *Ask the developers* | Firebase Configurations for CMS

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[ISC](https://choosealicense.com/licenses/isc/)
