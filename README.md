# jmhansen-atvise-frontend

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Default .env

```bash
NODE_ENV = development
IP = localhost
PORT = 8655
ATVISE_PROXY = http://10.2.250.206:81 # IP address of the Atvise web server
AUTH0_DOMAIN = jm-hansen.eu.auth0.com
AUTH0_CLIENT_ID = xxxxxxx
AUTH0_AUDIENCE = access.portal.jmhansen.no/api/
LOG_OUT_URL = http://localhost:8655
LOCAL = false # false: use AUTH0 login true: use atvise login
TITLE1 = PORTAL
TITLE2 = JMHANSEN
```

## Options in webmicfg

```
/* eslint-disable */
var webMIConfig = {
  //The configuration parameters are described in the atvise help section "Client/Browserside scripting reference -> Configuration".
  "frame.enableautofit": false, // keep this false for better alignment of svg
  "frame.alignment": "top",
  // Configuration below is for jmhansen-atvise-frontend
  // For more info please contact: jorgen.antonsen@ctrl.as
  nuxt: {
	  useUTC: true, // Show UTC time on alarms, events and trends
    alarms: {
      minPriority: 200, // The lowest priority to show in the alarm list
      viewer: 'SYSTEM.LIBRARY.ATVISE.OBJECTDISPLAYS._jmhVue.alarming.list' // Legacy, not in use	
    },
    home: {
      display: 'AGENT.DISPLAYS.Main', // First display to show
      base: 'AGENT.OBJECTS',    // Base address for the first display
      frame: 'visu' // Legacy, do not change
    },
    defaultDark: true, // Use dark theme as default
    navigationDrawer: { // Settings for the navigation drawer, on the left
      width: 300,
      color: '#4d4d4d',
      dark: true
    },
    alarmDrawer: { // Settings for the alarm drawer on the right
      disable: false, // If disabled the alarm status is only shown on the toolbar
      extraItems: [ // Extra buttons to show on the alarm-drawer
        {
          text: "All incidents", // The button text
          display: "AGENT.OBJECTS.incidentCentral.default", // Which display to open
          base: "AGENT.OBJECTS.incidentCentral", // What base address to set on the opened display
          iconComponent: "servicenowIcon" // Which icon component to use if you for example want to show number of events
        }
      ]
    },
    alarmList: {
		// Extra items/headers to show in the alarmlist
		extraItems: [
			{
					text: "Site",
					value: "siteName",
					width: 100
			},
			{
					text: "Building",
					value: "buildingName"
			},
			{
					text: "Room",
					value: "room",
			},
			{
					text: "System",
					value: "systemName"
			},
			{
					text: "Component",
					value: "componentName",
			}
		]    
    },
    alarmInfo: {
		// If not added it will show the same extraItems as in alarmList
		// If value is array, system will return the first value it finds
		extraItems: [
			{
					text: "Site",
					value: ["siteName", "site"]
			},
			{
					text: "Building",
					value: ["buildingName","building"]
			},
			{
					text: "Room",
					value: "room",
			},
			{
					text: "System",
					value: "systemName"
			},
			{
					text: "Component",
					value: "componentName",
			},
			{
					text: "Documentation ID",
					value: "documentationId"			
			}	
		]
    },
    login: {
	    logo: {
		    src: 'logos/logo.png' // Which logo to show on the login page
	    },
	    color: '#ff8000', 
	   dark: true,
	   text: 'Welcome!',
	    btnText: 'To login AAD >'
    },
    appBar: {
      time: {
        show: true
      },
	  logo: {
		  src: 'logos/logowhite.png',
		  position: 'right',	  
	  },
	  color: 'accent',
      dark: true
    }
  },
  intercom: {
		enable: true,
		appId: 'jktwl0q2'  
  }
};
```


## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `public`

This directory contains assets that should be served as-is. Each file inside this directory is mapped to `/` at runtime.

Example: `/public/robots.txt` is available as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxt.com/docs/guide/directory-structure/public).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).


# DOCKER
## Build
```
docker build -t jmhansenas/atvise-frontend:staging --cache-from jmhansenas/atvise-frontend:staging  .
```
Use this if ypu want to prebuild the frontend:
```
docker build -t jmhansenas/atvise-frontend:staging --build-arg prebuild=true --cache-from jmhansenas/atvise-frontend:staging  .

```
### Run
```
docker run -dit --restart=unless-stopped --name jmhansen-atvise-frontend  --network atvise-utilities_backend -p 3010:8654 jmhansenas/atvise-frontend:staging
```