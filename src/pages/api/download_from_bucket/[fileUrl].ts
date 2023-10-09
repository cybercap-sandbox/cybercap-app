import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type Readable } from "stream";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // get the filename for the file that the user is trying to download
  const fileUrl = req.query.fileUrl as string;
  // use axios to get a Readable stream response
  const { data } = await axios.get<Readable>(fileUrl, {
    responseType: "stream",
  });

  res.setHeader(
    "content-disposition",
    `attachment; filename="generatedImage.jpg"`
  );

  // pipe the data to the res object
  data.pipe(res);
}

export default handler;
