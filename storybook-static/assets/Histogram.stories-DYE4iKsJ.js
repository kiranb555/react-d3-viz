import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{n,t as r}from"./CartesianChart-BM9zuDDx.js";import{n as i,r as a}from"./accessors-DCkyJMEZ.js";import{o,s}from"./src-BB9HugtD.js";import{n as c,t as l}from"./Bar-Waw9sF31.js";function u(e,t=20){return s().thresholds(t)(e).map(e=>({x0:e.x0??0,x1:e.x1??0,count:e.length}))}var d=e((()=>{o()}));function f({values:e,data:t,value:n,bins:a=20,color:o,formatBin:s,...c}){let d=e??(t&&n?t.map((e,t)=>i(e,n,t)).filter(e=>Number.isFinite(e)):[]),f=s??(e=>String(Math.round(e*100)/100)),m=u(d,a).map(e=>({bin:f(e.x0,e.x1),count:e.count}));return(0,p.jsx)(r,{...c,data:m,x:`bin`,series:[{dataKey:`count`,label:`count`,color:o}],xScaleType:`band`,bandPadding:.05,showLegend:!1,renderSeries:()=>(0,p.jsx)(l,{animate:c.animate,groupGap:0,radius:1})})}var p,m=e((()=>{n(),c(),d(),a(),p=t(),f.__docgenInfo={description:`Histogram — bins a set of numeric values (via d3-array) and renders the
counts as bars. Reuses the bar renderer and Cartesian frame.`,methods:[],displayName:`Histogram`,props:{values:{required:!1,tsType:{name:`Array`,elements:[{name:`number`}],raw:`number[]`},description:"Raw numeric values to bin. Provide this OR `data` + `value`."},data:{required:!1,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:"Records to bin (used with `value`)."},value:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Accessor selecting the numeric value from each record.`},bins:{required:!1,tsType:{name:`number`},description:`Target number of bins (a hint to d3). Default 20.`,defaultValue:{value:`20`,computed:!1}},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:``},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:``},aspect:{required:!1,tsType:{name:`number`},description:``},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},color:{required:!1,tsType:{name:`string`},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:``},formatBin:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(x0: number, x1: number) => string`,signature:{arguments:[{type:{name:`number`},name:`x0`},{type:{name:`number`},name:`x1`}],return:{name:`string`}}},description:`Format a bin's lower-bound label.`}}}})),h,g,_,v,y,b,x,S,C;e((()=>{m(),h=Array.from({length:500},()=>{let e=0;for(let t=0;t<6;t++)e+=Math.random();return e/6*100}),g=Array.from({length:500},()=>Math.random()*100),_={title:`Charts/Histogram`,component:f,tags:[`autodocs`],parameters:{layout:`centered`},args:{values:h,bins:20,width:600,height:300},argTypes:{width:{control:{type:`range`,min:300,max:800,step:50}},height:{control:{type:`range`,min:200,max:500,step:50}},bins:{control:{type:`range`,min:5,max:50,step:1}},showGrid:{control:`boolean`},animate:{control:`boolean`}}},v={args:{showGrid:!0,showLegend:!1}},y={args:{bins:8,showGrid:!0}},b={args:{bins:40,showGrid:!0}},x={args:{values:g,bins:20,showGrid:!0}},S={args:{bins:50,showGrid:!0}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    showGrid: true,
    showLegend: false
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    bins: 8,
    showGrid: true
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    bins: 40,
    showGrid: true
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    values: uniformValues,
    bins: 20,
    showGrid: true
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    bins: 50,
    showGrid: true
  }
}`,...S.parameters?.docs?.source}}},C=[`Default`,`FewerBins`,`MoreBins`,`UniformDistribution`,`LargeHist`]}))();export{v as Default,y as FewerBins,S as LargeHist,b as MoreBins,x as UniformDistribution,C as __namedExportsOrder,_ as default};