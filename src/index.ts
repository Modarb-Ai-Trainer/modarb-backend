import { app } from "./configs/app";

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is up and runing on port ${process.env.PORT}!`);
});
