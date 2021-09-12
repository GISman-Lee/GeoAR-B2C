# GeoAR-B2C
GeoAR-B2C Events Solutions for Esri Hackathon 2021

*There are two folders in this project, GeoAR-B2C-Admin and GeoAR-B2C-Client, respectivley.*

### How to install and use contents of GeoAR-B2C-Admin
*Inside GeoAR-B2C-Admin, you could find two subfolders which are MyLayers and MyEvents, they are my developed customised widgets of ArcGIS Experience Builder with ArcGIS API for Javascript and ReactJS, the steps we need to do are:*

*1. Download ArcGIS Experience Builder Developer Edition from Esri Official website: https://developers.arcgis.com/experience-builder/* </br>
*2. Install ArcGIS Experience Builder Developer Edition on your machine following the full official steps: https://developers.arcgis.com/experience-builder/guide/install-guide/* </br>
*3. Copy these two Folders under ($your_exb_root_folder)/client/your-extensions/widgets/* </br>
*4. Dir to ($your_exb_root_folder)/server/, and run **```npm start```**; Again, Dir to ($your_exb_root_folder)/client/, and run **```npm start```*** </br>
*5. Defaultly, the listenting port is 3001, so browse https://localhost:3001, login with your App ID and remote AGOL/Portal* (see step 2's link)*</br>
*6. Create a project or choose a template (see step 2's link), then on your left-hand side, you could see these two customised widgets are lying on the panel, then you could either drag or add these two customised widgets to your right-hand side content area to use them.* </br>
*7. Please pay attention that you also need to set the **Map Component** for both of the widgets on the right-hand side setting panel before you launch and run the app.* </br>
*8. When run and use the widgets, please make sure that use MyLayers Widget first and tick the Event_Layers before you use MyEvents Widget* </br>
*9. If you feel it too complex to integrate these two customised widgets into ArcGIS Experience Builder Developer Edition, you could just download **GeoAR-B2C-Admin-Built-Compress.zip** and upzip it, then put it under any HTTP hosting, or run SimpleHTTPServer locally e.g. **```python -m SimpleHTTPServer 3001```**, then go to step 5.*</br>

### How to deploy the contents of GeoAR-B2C-Admin on ArcGIS Online Experience Builder
*Instead of running it locally, we could also deploy the ArcGIS Experience Builder App with our customised widgets on ArcGIS Online. Though there is no official documents regarding how to do this at the moment, I found a creative trick to deploy it, please watch this video I made about how to deploy customised widgets of ArcGIS Experience Builder on ArcGIS Online/Portal: </br> https://www.youtube.com/watch?v=fDN7rr5259w*

### How to install and use GeoAR-B2C-Client
*As the GeoAR-B2C-Client is developed by pure HTML5 and Javascript, so no installation is required. What you would need to do is download it and Dir to GeoAR-B2C-Client Root folder like ./GeoAR-B2C-Client/, and then just run https server in it to host it e.g. **```python -m SimpleHTTPServer 8001```** that's it. You could also use IIS or other Html facilities to host it.* </br>

*By the way, as the folder contains 3D model assets which are big, so when you git it, it takes a while...*

*Inside GeoAR-B2C-Client folder, index.html is the main entry for the App, so when you run the program (or when you host GeoAR-B2C-Client on cloud) you should use like https://127.0.0.1:8001/index.html* </br>

*When you use the App, please make sure that you are outdoor, your mobile phone/Ipad's GPS is turn on and your camera is allowed to be used by permission settings.* </br>

*In ar.html, the attributes in <a-camera>: gps-camera="gpsMinDistance: 10; gpsTimeInterval: 6000; maxDistance: 65;" is used to stablise the GPS, depending on your location's datum/projection system as well as your mobile phone GPS's senstivie(accuracy) you would need to adjust it for better result (gpsMinDistance, maxDistance unit in m, gpsTimeInterval unit in msec)*
