import { Request, Response } from "express";
import httpResp from "../lib/httpResp";
import { useBaseConfigStore } from "../../store/counter";
import { dialog } from "electron";
import { readFileContent } from "../../utils/file";

const TranslateController = {
  document: async (req: Request, res: Response) => {
    const defaultOutPutPath = useBaseConfigStore.get().defaultOutPutPath;
    const filePath = dialog.showOpenDialogSync({
      properties: ["openFile"],
    });

    readFileContent(filePath[0])
      .then((content) => {
        console.log("文件内容：", content.toString());
      })
      .catch((err) => {
        console.error("读取文件时出错：", err);
      });

    return httpResp(res).setData(defaultOutPutPath).send();
  },
};

export default TranslateController;
