import { writeFileSync } from 'fs';

const lrbt = ['left', 'right', 'top', 'bottom'];

const MPData = {
  margin: lrbt,
  padding: lrbt,
  'border-radius': ''
};

const steps = [0, 0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let res = '';
let doc = `
|Name                    |Description                                                                                     |
|------------------------|------------------------------------------------------------------------------------------------|
`;
function GenerateMP() {
  for (const step of steps) {
    for (const key in MPData) {
      if (MPData.hasOwnProperty(key)) {
        AddToDoc(`${key[0]}${GetStep(step)}`, key, `${step}rem`);
        res += `.${key[0]}${GetStep(step)}
  ${key}: ${step}rem !important
`;
        for (const prop of MPData[key]) {
          AddToDoc(`${key[0]}${prop[0]}${GetStep(step)}`, `${key}-${prop}`, `${step}rem`);
          res += `.${key[0]}${prop[0]}${GetStep(step)}
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
const flexDirs = ['row', 'row-reverse', 'column', 'column-reverse'];

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
  for (const dir of flexDirs) {
    AddToDoc(`flex-dir-${dir}`, 'flex-direction', dir);
    res += `.flex-dir-${dir}
  flex-direction: ${dir} !important
`;
  }
}

const posData = ['absolute', 'fixed', 'relative'];

function GeneratePos() {
  for (const value of posData) {
    AddToDoc(`pos-${value[0]}`, 'position', value);
    res += `.pos-${value[0]}
  position: ${value} !important
`;
  }
}

const cursorData = [
  'auto',
  'default',
  'none',
  'context-menu',
  'help',
  'pointer',
  'progress',
  'wait',
  'cell',
  'crosshair',
  'text',
  'vertical-text',
  'alias',
  'copy',
  'move',
  'no-drop',
  'not-allowed',
  'e-resize',
  'n-resize',
  'ne-resize',
  'nw-resize',
  's-resize',
  'se-resize',
  'sw-resize',
  'w-resize',
  'ew-resize',
  'ns-resize',
  'nesw-resize',
  'nwse-resize',
  'col-resize',
  'row-resize',
  'all-scroll',
  'zoom-in',
  'zoom-out',
  'grab',
  'grabbing'
];

function GenerateCursor() {
  for (const value of cursorData) {
    AddToDoc(`cursor-${value}`, 'cursor', value);
    res += `.cursor-${value}
  cursor: ${value} !important
`;
  }
}
const sizeTypes = ['height', 'width'];
const sizes = [
  {
    unit: 'rem',
    steps
  },
  {
    unit: '',
    steps: [0]
  },
  {
    unit: '%',
    steps: [10, 25, 50, 75, 100, 125, 150, 200]
  }
];
function GenerateSizeStuff() {
  for (const type of sizeTypes) {
    for (const size of sizes) {
      for (const step of size.steps) {
        AddToDoc(`${type}${GetStep(step)}${size.unit.replace('%', 'percent')}`, type, `${step}${size.unit}`);
        res += `.${type}${GetStep(step)}${size.unit.replace('%', 'percent')}
  ${type}: ${step}${size.unit} !important
`;
      }
    }
  }
}
const overflowData = ['visible', 'hidden', 'scroll', 'auto'];

function GenerateOverflow() {
  for (const type of overflowData) {
    AddToDoc(`overflow-${type[0]}`, 'overflow', type);
    res += `.overflow-${type[0]}
  overflow: ${type} !important
`;
  }
}
// don't add flex, its already handled by GenerateFlex, grid will be handled by its own func.
const displayData = [
  'none',
  'inline',
  'inline-block',
  'block',
  'contents',
  'flow-root',
  'inline-flex',
  'inline-flexbox',
  'flexbox',
  'inline-table',
  'list-item',
  'table',
  'table-caption',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-footer-group',
  'table-header-group',
  'table-row',
  'table-row-group'
];
function GenerateDisplay() {
  for (const type of displayData) {
    AddToDoc(`d-${type}`, 'display', type);
    res += `.d-${type}
  display: ${type} !important
`;
  }
}

GenerateMP();
GenerateFlex();
GeneratePos();
GenerateCursor();
GenerateSizeStuff();
GenerateOverflow();
GenerateDisplay();

function AddToDoc(name: string, prop: string, value: string) {
  const desc = `Sets the \`${prop}\` property to \`${value}\``;
  doc += `|${name}${' '.repeat(Math.max(0, 24 - name.length))}|${desc}${' '.repeat(Math.max(0, 96 - desc.length))}|
`;
}

function GetStep(step: number) {
  return step.toString().replace(/0\./, '-');
}

writeFileSync('./utils.sass', res);
writeFileSync('./README.md', doc);
