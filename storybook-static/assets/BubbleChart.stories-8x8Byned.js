import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{a as n,f as r,o as i}from"./useAutoSize-D-qkoCtK.js";import{a,i as o,n as s,o as c,r as l,t as u}from"./CartesianChart-BM9zuDDx.js";import{n as d,r as f}from"./accessors-DCkyJMEZ.js";import{n as p,t as m}from"./src-BB9HugtD.js";import{n as h,t as g}from"./useAnimatedValue-DThFBlZ4.js";import{n as _,t as v}from"./common-rqCLdXh_.js";function y({size:e,radiusRange:t=[4,28],categoricalX:n=!1,series:r,y:i,...a}){let o=_(r,i);return(0,x.jsx)(u,{...a,series:o,xScaleType:n?`point`:`linear`,renderSeries:n=>n.series.map(n=>(0,x.jsx)(b,{series:n,size:e,radiusRange:t,animate:a.animate},n.seriesIndex))})}function b({series:e,size:t,radiusRange:r,animate:a=!0}){let{data:s,xPixel:l,yPixel:u,theme:f,active:m}=c(),g=h({enabled:a&&f.animation.enabled,durationMs:f.animation.durationMs});if(e.hidden)return null;let _=s.map((e,n)=>d(e,t,n)),v=p().domain(o(_,{includeZero:!0,padTop:0})).range(r);return(0,x.jsx)(i,{children:s.map((r,i)=>{let a=d(r,e.dataKey,i),o=d(r,t,i);if(!Number.isFinite(a)||!Number.isFinite(o))return null;let s=v(o)*g;return(0,x.jsx)(n,{cx:l(i),cy:u(a),r:s,fill:e.color,fillOpacity:m?.index===i?.55:.35,stroke:e.color,strokeWidth:1.5},i)})})}var x,S=e((()=>{r(),s(),a(),g(),f(),l(),m(),v(),x=t(),y.__docgenInfo={description:`Bubble chart — a scatter plot with a third dimension encoded as bubble area
(radius via a sqrt scale, so area is proportional to value).`,methods:[],displayName:`BubbleChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},size:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Accessor for each point's magnitude (mapped to bubble radius).`},radiusRange:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:`Min/max bubble radius in px. Default [4, 28].`,defaultValue:{value:`[4, 28]`,computed:!1}},categoricalX:{required:!1,tsType:{name:`boolean`},description:`Treat x as numeric (default) or categorical.`,defaultValue:{value:`false`,computed:!1}}}}})),C,w,T,E,D,O,k;e((()=>{S(),C={title:`Charts/BubbleChart`,component:y,tags:[`autodocs`],parameters:{layout:`centered`},args:{data:Array.from({length:40},()=>({x:Math.round(Math.random()*100),y:Math.round(Math.random()*100),size:Math.round(Math.random()*100+5),category:Math.random()>.5?`Premium`:`Standard`})),x:`x`,y:`y`,size:`size`,width:500,height:400},argTypes:{width:{control:{type:`range`,min:300,max:700,step:50}},height:{control:{type:`range`,min:300,max:600,step:50}},radiusRange:{control:`object`},showGrid:{control:`boolean`},showLegend:{control:`boolean`}}},w={args:{showGrid:!0,showLegend:!1}},T={args:{radiusRange:[8,50],showGrid:!0}},E={args:{radiusRange:[3,15],showGrid:!0}},D={args:{radiusRange:[6,35],showGrid:!0,showLegend:!0,theme:{colors:[`#ff6b6b`,`#4ecdc4`]}}},O={args:{radiusRange:[6,35],showGrid:!0,showLegend:!0}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    showGrid: true,
    showLegend: false
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    radiusRange: [8, 50],
    showGrid: true
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    radiusRange: [3, 15],
    showGrid: true
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    radiusRange: [6, 35],
    showGrid: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4']
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    radiusRange: [6, 35],
    showGrid: true,
    showLegend: true
  }
}`,...O.parameters?.docs?.source}}},k=[`Default`,`LargerBubbles`,`SmallBubbles`,`ThemedColors`,`WithGridAndLegend`]}))();export{w as Default,T as LargerBubbles,E as SmallBubbles,D as ThemedColors,O as WithGridAndLegend,k as __namedExportsOrder,C as default};