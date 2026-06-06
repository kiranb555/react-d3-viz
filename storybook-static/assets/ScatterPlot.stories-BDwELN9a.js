import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{a as n,f as r,o as i}from"./useAutoSize-D-qkoCtK.js";import{a,n as o,o as s,t as c}from"./CartesianChart-BM9zuDDx.js";import{n as l,r as u}from"./accessors-DCkyJMEZ.js";import{n as d,t as f}from"./useAnimatedValue-DThFBlZ4.js";import{n as p,t as m}from"./common-rqCLdXh_.js";function h({series:e,radius:t=4,animate:r=!0}){let{data:a,xPixel:o,yPixel:c,theme:u,active:f}=s(),p=d({enabled:r&&u.animation.enabled,durationMs:u.animation.durationMs});return e.hidden?null:(0,g.jsx)(i,{children:a.map((r,i)=>{let a=l(r,e.dataKey,i);if(!Number.isFinite(a))return null;let s=(f?.index===i?t+2:t)*p;return(0,g.jsx)(n,{cx:o(i),cy:c(a),r:s,fill:e.color,fillOpacity:.75,stroke:e.color,strokeWidth:1},i)})})}var g,_=e((()=>{r(),a(),f(),u(),g=t(),h.__docgenInfo={description:`Renders one series as scatter dots, fading/growing in. Reads chart context.`,methods:[],displayName:`Points`,props:{series:{required:!0,tsType:{name:`ResolvedSeries`},description:``},radius:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`4`,computed:!1}},animate:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}}}}}));function v({categoricalX:e=!1,pointRadius:t,series:n,y:r,...i}){let a=p(n,r);return(0,y.jsx)(c,{...i,series:a,xScaleType:e?`point`:`linear`,renderSeries:e=>e.series.map(e=>(0,y.jsx)(h,{series:e,radius:t,animate:i.animate},e.seriesIndex))})}var y,b=e((()=>{o(),_(),m(),y=t(),v.__docgenInfo={description:"Scatter plot. By default x is numeric (linear scale) and each series is drawn\nas dots. Set `categoricalX` for category-based scatter.",methods:[],displayName:`ScatterPlot`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},categoricalX:{required:!1,tsType:{name:`boolean`},description:`Treat x as numeric (linear scale, default) or categorical (point scale).`,defaultValue:{value:`false`,computed:!1}},pointRadius:{required:!1,tsType:{name:`number`},description:`Dot radius.`}}}})),x,S,C,w,T,E,D,O,k;e((()=>{b(),x=Array.from({length:60},()=>({x:Math.round(Math.random()*100),y:Math.round(Math.random()*100),size:Math.round(Math.random()*30+10),category:Math.random()>.5?`A`:`B`})),S=[{name:`Series A`,data:Array.from({length:30},()=>({x:Math.round(Math.random()*50+20),y:Math.round(Math.random()*50+30)}))},{name:`Series B`,data:Array.from({length:30},()=>({x:Math.round(Math.random()*50+30),y:Math.round(Math.random()*50+10)}))}],C={title:`Charts/ScatterPlot`,component:v,tags:[`autodocs`],parameters:{layout:`centered`},args:{data:x,x:`x`,y:`y`,width:500,height:400},argTypes:{width:{control:{type:`range`,min:300,max:700,step:50}},height:{control:{type:`range`,min:300,max:600,step:50}},pointRadius:{control:{type:`range`,min:2,max:10,step:1}},showGrid:{control:`boolean`},showLegend:{control:`boolean`}}},w={args:{showGrid:!0,showLegend:!1}},T={args:{pointRadius:7,showGrid:!0}},E={args:{showGrid:!0,showLegend:!1}},D={args:{showGrid:!0,showLegend:!0,theme:{colors:[`#ff6b6b`,`#4ecdc4`]}}},O={args:{data:S,x:`x`,y:`y`,series:[{dataKey:`data`,name:`Series A`},{dataKey:`data`,name:`Series B`}],showGrid:!0,showLegend:!0}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    showGrid: true,
    showLegend: false
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    pointRadius: 7,
    showGrid: true
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    showGrid: true,
    showLegend: false
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    showGrid: true,
    showLegend: true,
    theme: {
      colors: ['#ff6b6b', '#4ecdc4']
    }
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    data: multiSeriesData,
    x: 'x',
    y: 'y',
    series: [{
      dataKey: 'data',
      name: 'Series A'
    }, {
      dataKey: 'data',
      name: 'Series B'
    }],
    showGrid: true,
    showLegend: true
  }
}`,...O.parameters?.docs?.source}}},k=[`Default`,`LargerPoints`,`WithGrid`,`ThemedColors`,`MultiSeries`]}))();export{w as Default,T as LargerPoints,O as MultiSeries,D as ThemedColors,E as WithGrid,k as __namedExportsOrder,C as default};