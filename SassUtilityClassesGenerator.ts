import { writeFileSync } from 'fs';

const lrbt = ['left', 'right', 'top', 'bottom'];

const MPData = {
  margin: lrbt,
  padding: lrbt
};

const steps = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let res = '';
let doc = `
|Name                    |Description                                                                                     |
|------------------------|------------------------------------------------------------------------------------------------|
`;
function GenerateMP() {
  for (const step of steps) {
    for (const key in MPData) {
      if (MPData.hasOwnProperty(key)) {
        AddToDoc(`${key[0]}${step.toString().replace(/0./, '-')}`, key, `${step}rem`);
        res += `.${key[0]}${step.toString().replace(/0./, '-')}
  ${key}: ${step}rem !important
`;
        for (const prop of MPData[key]) {
          AddToDoc(`${key[0]}${prop[0]}${step.toString().replace(/0./, '-')}`, `${key}-${prop}`, `${step}rem`);
          res += `.${key[0]}${prop[0]}${step.toString().replace(/0./, '-')}
  ${key}-${prop}: ${step}rem !important
`;
        }
      }
    }
  }
}

const flexProps = [['jc', 'justify-content'], ['ac', 'align-content'], ['ai', 'align-items'], ['ji', 'justify-items']];
const flexValues = [
  ['center', 'center'],
  ['between', 'space-between'],
  ['around', 'space-around'],
  ['stretch', 'stretch'],
  ['start', 'flex-start'],
  ['end', 'flex-end']
];

function GenerateFlex() {
  res += `.flex
  display: flex !important
`;
  AddToDoc('flex', 'display', 'flex');
  for (const prop of flexProps) {
    for (const value of flexValues) {
      AddToDoc(`flex-${prop[0]}-${value[0]}`, prop[1], value[1]);
      res += `.flex-${prop[0]}-${value[0]}
  ${prop[1]}: ${value[1]} !important
`;
    }
  }
}

const posData = ['absolute', 'fixed', 'relative', 'none'];

function GeneratePos() {
  for (const value of posData) {
    AddToDoc(`pos-${value[0]}`, 'position', value);
    res += `.pos-${value[0]}
  position: ${value} !important
`;
  }
}

GenerateMP();
GenerateFlex();
GeneratePos();

function AddToDoc(name: string, prop: string, value: string) {
  const desc = `Sets the \`${prop}\` property to \`${value}\``;
  doc += `|${name}${' '.repeat(Math.max(0, 24 - name.length))}|${desc}${' '.repeat(Math.max(0, 96 - desc.length))}|
`;
}
writeFileSync('./utils.sass', res);
writeFileSync('./README.md', doc);