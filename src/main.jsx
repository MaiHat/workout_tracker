import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import "./sass/main.scss";
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <App />
  //</StrictMode>,

);






/**
|--------------------------------------------------
| vscode es7 snippet shortcut list

cmmb: a comment block
imp: import moduleName from 'module'
imd: import {  } from '
clg: console.log(object)
clo: 
rfc: function comp
rfce: last line export
nfn: const name = (params) => { }
rxconst: export const constantName = 'constantName'


|--------------------------------------------------
*/
