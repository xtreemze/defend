﻿# Test - Build - Submit

## Test

1. Your application uses the same rendering and JavaScript Engine as Microsoft Edge so most of you testing can be done on your website and in the browser.

2. To test your application on a device, download the PWA Builder test harness from the Store, and follow the directions. _Coming soon!_

3. To test locally, in the root folder for your app, type:

  ```
  pwabuilder run windows10
  ```

> **Note:** Looking for some debugging tools that work on all your platforms? Try [Vorlon.js](http://www.vorlonjs.com/). It makes mobile testing a breeze, and works inside the app PWA Builder apps.

## Build

### With PWA Builder
You can use PWA Builder to create an APPX package with your app contents for submission to the Windows Store, even on platforms that do not support installing the Windows SDK such as OS X and Linux.

To package your app, run the following command in the project's folder:

```
pwabuilder package
```

Or, to build the Windows platform only:

```
pwabuilder package -p windows10
```


### With Visual Studio

1. Download and install Visual Studio (community edition works fine) and open the source code folder.

2. Open the Project in Visual Studio.

3. Use the store commands from Visual Studio to create the app package.

### With the Windows 10 SDK

1. Download the [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296) (must be running Windows).

2. Build with [these instructions](https://msdn.microsoft.com/en-us/library/windows/desktop/hh446767.aspx) for MakeAppX.

## Submit to Store

1. Set up a Microsoft Developer account [here](http://dev.windows.com/en-us).

1. Reserve the name of your app and obtain its identity details (under **App management | App identity**), including _Name_, _Publisher_, and _PublisherDisplayName_.

1. Update the **appmanifest.xml** file located in the **_windows/manifest_** directory of the app with the identity details. PWA Builder has already included placeholders indicating where each piece of information needs to be replaced.

1. Build the APPX package, upload it to the Windows Store, and then complete the submission process.
