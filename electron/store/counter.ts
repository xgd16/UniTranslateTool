import { useDb } from "./electronStore";

type baseConfigType = {
  defaultOutPutPath: string;
};

export const useBaseConfigStore = useDb<baseConfigType>("baseConfigStore");
