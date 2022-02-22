import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // Filter Image Endpoint
  // Download image public URL then return that image local path
  app.get( "/filteredimage", async ( req, res ) => {
    const { image_url } = req.query;

    if (!image_url) {
      return res.status(400).send('image_url is required');
    }

    try {
      const result = await filterImageFromURL(image_url);

      res.status(200).sendFile(result, () => {
        deleteLocalFiles([result]);
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();