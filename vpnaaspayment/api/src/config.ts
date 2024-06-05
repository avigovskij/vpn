import fs from "fs";
import YAML from 'yaml';
import { IConfig } from "./types";

const file = fs.readFileSync('/Users/vigovskij/projects/infra/vpn/backend_config.yml', 'utf8')
const CONFIG: IConfig = YAML.parse(file);


export default CONFIG;