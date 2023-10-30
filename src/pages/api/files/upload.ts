/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { put } from "@vercel/blob";
import type { NextApiResponse, NextApiRequest } from "next";
import { nanoid } from "ai";
import axios from "axios";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const imageFormat = "jpg";
  const fileName = `${nanoid(15)}.${imageFormat}`;
  const { fileUrl } = request.body;

  const { data: file } = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  const blob = await put(fileName, file, {
    access: "public",
  });

  return response.json(blob);
}
