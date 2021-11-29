import express from 'express';
import { SERVER_CONFIGS } from './configuration/configuration';


// app setup
const app = express();

//--routes
app.get('/status', (_req: any, res: any) => {
  res.send('up');
});

app.get('/n4j', (req: any, res: any) => {
  res.send('n4j');
});

//--start listening
app.listen(SERVER_CONFIGS.PORT, () => {
  console.log(`Example app listening at http://localhost:${SERVER_CONFIGS.PORT}`);
});