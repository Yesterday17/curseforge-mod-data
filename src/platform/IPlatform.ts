import { ModSource } from "..";

interface IPlatform {
  parse: (mod: ModSource) => string;
}

export default IPlatform;
