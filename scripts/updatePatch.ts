import pack from '../package.json';
import fs from 'fs';
import path from 'path';

const { version : oldVersion } = pack;

const splitted = oldVersion.split('.').map(e => +e);
splitted[2] += 1;

const newVersion = splitted.join('.');
pack.version = newVersion;

fs.rmSync(path.join(process.cwd(), 'package.json'));
fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(pack, null, 2));