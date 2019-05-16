import IPlatform from "../IPlatform";
import { ModSource } from "../..";

class CurseForge implements IPlatform {
  parse(mod: ModSource) {
    return "https://media.forgecdn.net/files/2708/657/simplelogin-0.2.8-stable-build20.jar";
  }
}

export default new CurseForge();
