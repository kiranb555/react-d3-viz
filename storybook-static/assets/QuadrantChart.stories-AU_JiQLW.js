import{n as e}from"./chunk-DnJy8xQt.js";import{t}from"./iframe-CISgnNV3.js";import{a as n,d as r,f as i,l as a,o,s}from"./useAutoSize-D-qkoCtK.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./CartesianChart-BM9zuDDx.js";import{n as m,r as h}from"./accessors-DCkyJMEZ.js";import{n as g,t as _}from"./src-BB9HugtD.js";import{n as v,t as y}from"./useAnimatedValue-DThFBlZ4.js";import{n as b,t as x}from"./common-rqCLdXh_.js";function S({thresholdX:e,thresholdY:t,quadrantLabels:n,showQuadrantLabels:i=!0,quadrantStyles:c,xDomain:l,yDomain:u}){let{bounds:f,theme:p}=d(),m=f.innerWidth,h=f.innerHeight,g=l[1]-l[0],_=u[1]-u[0],v=0+(e-l[0])/g*(m-0),y=h-(t-u[0])/_*(h-0),b=Math.max(0,Math.min(m,v)),x=Math.max(0,Math.min(h,y)),S=[{x:0,y:0,width:b-0,height:x-0,labelX:0+(b-0)/2,labelY:0+(x-0)/2},{x:b,y:0,width:m-b,height:x-0,labelX:b+(m-b)/2,labelY:0+(x-0)/2},{x:0,y:x,width:b-0,height:h-x,labelX:0+(b-0)/2,labelY:x+(h-x)/2},{x:b,y:x,width:m-b,height:h-x,labelX:b+(m-b)/2,labelY:x+(h-x)/2}],w=p.axis.labelSize||12,T=p.axis.labelColor||`#666`;return(0,C.jsxs)(o,{children:[S.map((e,t)=>e.width<=0||e.height<=0?null:(0,C.jsx)(a,{x:e.x,y:e.y,width:e.width,height:e.height,fill:c[t].backgroundColor,fillOpacity:c[t].backgroundOpacity},`bg-${t}`)),(0,C.jsx)(s,{x1:b,y1:0,x2:b,y2:h,stroke:c[0].dividerStroke,strokeWidth:c[0].dividerStrokeWidth,strokeDasharray:`2,2`}),(0,C.jsx)(s,{x1:0,y1:x,x2:m,y2:x,stroke:c[0].dividerStroke,strokeWidth:c[0].dividerStrokeWidth,strokeDasharray:`2,2`}),i&&n&&S.map((e,t)=>e.width<=0||e.height<=0?null:(0,C.jsx)(r,{x:e.labelX,y:e.labelY,textAnchor:`middle`,verticalAnchor:`middle`,fontSize:w,fill:T,opacity:.6,children:n[t]},`label-${t}`))]})}var C,w=e((()=>{i(),c(),C=t(),S.__docgenInfo={description:`Quadrants component — renders 4 background rectangles, 2 divider lines, and optional labels.
Used by QuadrantChart to display the quadrant areas divided by X and Y thresholds.`,methods:[],displayName:`Quadrants`,props:{thresholdX:{required:!0,tsType:{name:`number`},description:`Threshold value on the X axis (in data coordinates)`},thresholdY:{required:!0,tsType:{name:`number`},description:`Threshold value on the Y axis (in data coordinates)`},quadrantLabels:{required:!1,tsType:{name:`tuple`,raw:`[string, string, string, string]`,elements:[{name:`string`},{name:`string`},{name:`string`},{name:`string`}]},description:`Optional labels for the 4 quadrants [TL, TR, BL, BR]`},showQuadrantLabels:{required:!1,tsType:{name:`boolean`},description:`Whether to show quadrant labels (default: true)`,defaultValue:{value:`true`,computed:!1}},quadrantStyles:{required:!0,tsType:{name:`Array`,elements:[{name:`QuadrantStyle`}],raw:`QuadrantStyle[]`},description:`Styling for all quadrants (dividers, background colors, opacity)`},xDomain:{required:!0,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:`X domain bounds [min, max] in data coordinates`},yDomain:{required:!0,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:`Y domain bounds [min, max] in data coordinates`}}}}));function T({series:e,size:t,radiusRange:r=[4,28],pointRadius:i,animate:a=!0}){let{data:s,xPixel:c,yPixel:u,theme:f,active:p}=d(),h=v({enabled:a&&f.animation.enabled,durationMs:f.animation.durationMs});if(e.hidden)return null;let _;if(t){let e=s.map((e,n)=>m(e,t,n));_=g().domain(l(e,{includeZero:!0,padTop:0})).range(r)}return(0,E.jsx)(o,{children:s.map((r,a)=>{let o=m(r,e.dataKey,a);if(!Number.isFinite(o))return null;let s=c(a),l=u(o),d=i??4;if(t&&_){let e=m(r,t,a);if(!Number.isFinite(e))return null;d=_(e)||4}d*=h;let f=p?.index===a;return(0,E.jsx)(n,{cx:s,cy:l,r:d,fill:e.color,fillOpacity:f?.8:.5,stroke:e.color,strokeWidth:1.5},a)})})}var E,D=e((()=>{i(),c(),y(),h(),f(),_(),E=t(),T.__docgenInfo={description:`Points component — renders circles for each data point in a quadrant chart.
Supports optional bubble sizing via a size accessor (sqrt scale).
Highlights points on hover and animates radius on mount.`,methods:[],displayName:`Points`,props:{series:{required:!0,tsType:{name:`ResolvedSeries`},description:``},size:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:``},radiusRange:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``,defaultValue:{value:`[4, 28]`,computed:!1}},pointRadius:{required:!1,tsType:{name:`number`},description:``},animate:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}}}}}));function O(e,t){if(e.length===0)return 0;if(t===`mean`)return e.reduce((e,t)=>e+t,0)/e.length;if(t===`median`){let t=[...e].sort((e,t)=>e-t),n=Math.floor(t.length/2);return t.length%2==0?(t[n-1]+t[n])/2:t[n]}return 0}function k(e){let t=e.grid.color,n=.1;return[{dividerStroke:t,dividerStrokeWidth:1,backgroundColor:e.colors[0],backgroundOpacity:n},{dividerStroke:t,dividerStrokeWidth:1,backgroundColor:e.colors[1],backgroundOpacity:n},{dividerStroke:t,dividerStrokeWidth:1,backgroundColor:e.colors[2],backgroundOpacity:n},{dividerStroke:t,dividerStrokeWidth:1,backgroundColor:e.colors[3],backgroundOpacity:n}]}var A=e((()=>{}));function j({thresholdMode:e=`mean`,thresholdX:t,thresholdY:n,quadrantLabels:r,showQuadrantLabels:i=!0,size:a,radiusRange:o,pointRadius:s,categoricalX:c=!1,quadrantStyles:u,series:d,y:f,...h}){let g=b(d,f);if(e===`custom`&&(t===void 0||n===void 0))throw Error(`QuadrantChart: thresholdMode="custom" requires both thresholdX and thresholdY`);return(0,M.jsx)(p,{...h,series:g,xScaleType:c?`point`:`linear`,renderSeries:c=>{let d=t??0,f=n??0;if(e!==`custom`){let t=c.data.map((e,t)=>m(e,c.x,t)),n=c.series.filter(e=>!e.hidden).flatMap(e=>c.data.map((t,n)=>m(t,e.dataKey,n)));d=O(t.filter(Number.isFinite),e),f=O(n.filter(Number.isFinite),e)}let p=c.data.map((e,t)=>m(e,c.x,t)),g=c.series.filter(e=>!e.hidden).flatMap(e=>c.data.map((t,n)=>m(t,e.dataKey,n))),_=l(p.filter(Number.isFinite),{padTop:0}),v=l(g.filter(Number.isFinite),{padTop:0}),y=k(c.theme).map((e,t)=>({...e,...u?.[t]}));return(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(S,{thresholdX:d,thresholdY:f,quadrantLabels:r,showQuadrantLabels:i,quadrantStyles:y,xDomain:_,yDomain:v}),c.series.map(e=>(0,M.jsx)(T,{series:e,size:a,radiusRange:o,pointRadius:s,animate:h.animate},e.seriesIndex))]})}})}var M,N=e((()=>{u(),w(),D(),x(),A(),h(),f(),M=t(),j.__docgenInfo={description:`Quadrant chart — 2D scatter plot divided into 4 quadrants by X and Y thresholds.
Supports automatic (mean/median) or custom threshold positioning, optional bubble sizing,
custom quadrant labels, and fully customizable styling.`,methods:[],displayName:`QuadrantChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:``},x:{required:!0,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`x accessor (category key for bar/line/area, numeric key for scatter).`},series:{required:!1,tsType:{name:`Array`,elements:[{name:`SeriesConfig`}],raw:`SeriesConfig[]`},description:"Multiple series. Mutually exclusive with the `y` shorthand."},y:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Single-series shorthand.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent and re-flow on resize.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300."},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio used when height is 'auto'. Default 2.`},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showGrid:{required:!1,tsType:{name:`boolean`},description:``},showXAxis:{required:!1,tsType:{name:`boolean`},description:``},showYAxis:{required:!1,tsType:{name:`boolean`},description:``},showTooltip:{required:!1,tsType:{name:`boolean`},description:``},showLegend:{required:!1,tsType:{name:`boolean`},description:``},xTickCount:{required:!1,tsType:{name:`number`},description:``},yTickCount:{required:!1,tsType:{name:`number`},description:``},formatX:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: unknown, index: number) => string`,signature:{arguments:[{type:{name:`unknown`},name:`value`},{type:{name:`number`},name:`index`}],return:{name:`string`}}},description:``},formatY:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:``},yDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:``},animate:{required:!1,tsType:{name:`boolean`},description:`Disable enter animation regardless of theme.`},thresholdMode:{required:!1,tsType:{name:`union`,raw:`'mean' | 'median' | 'custom'`,elements:[{name:`literal`,value:`'mean'`},{name:`literal`,value:`'median'`},{name:`literal`,value:`'custom'`}]},description:`Threshold positioning mode: 'mean' (default), 'median', or 'custom'.`,defaultValue:{value:`'mean'`,computed:!1}},thresholdX:{required:!1,tsType:{name:`number`},description:`Custom X threshold (required if thresholdMode='custom').`},thresholdY:{required:!1,tsType:{name:`number`},description:`Custom Y threshold (required if thresholdMode='custom').`},quadrantLabels:{required:!1,tsType:{name:`tuple`,raw:`[string, string, string, string]`,elements:[{name:`string`},{name:`string`},{name:`string`},{name:`string`}]},description:`Custom labels for quadrants: [top-left, top-right, bottom-left, bottom-right].`},showQuadrantLabels:{required:!1,tsType:{name:`boolean`},description:`Show quadrant labels (default true).`,defaultValue:{value:`true`,computed:!1}},size:{required:!1,tsType:{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},description:`Optional accessor for bubble size (third dimension).`},radiusRange:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:`Min/max bubble radius in px. Default [4, 28].`},pointRadius:{required:!1,tsType:{name:`number`},description:`Point radius if size not provided.`},categoricalX:{required:!1,tsType:{name:`boolean`},description:`Treat X as categorical (default false).`,defaultValue:{value:`false`,computed:!1}},quadrantStyles:{required:!1,tsType:{name:`Array`,elements:[{name:`Partial`,elements:[{name:`QuadrantStyle`}],raw:`Partial<QuadrantStyle>`}],raw:`Partial<QuadrantStyle>[]`},description:`Customize styling per quadrant.`}}}})),P,F,I,L,R,z,B,V,H,U,W,G;e((()=>{N(),P=(e=40)=>Array.from({length:e},()=>({x:Math.round(Math.random()*100),y:Math.round(Math.random()*100),size:Math.round(Math.random()*80+10)})),F={title:`Charts/QuadrantChart`,component:j,tags:[`autodocs`],parameters:{layout:`centered`},args:{data:P(40),x:`x`,y:`y`,width:500,height:400},argTypes:{width:{control:{type:`range`,min:300,max:700,step:50}},height:{control:{type:`range`,min:300,max:600,step:50}},thresholdMode:{control:{type:`select`,options:[`mean`,`median`,`custom`]}},thresholdX:{control:{type:`range`,min:0,max:100,step:5}},thresholdY:{control:{type:`range`,min:0,max:100,step:5}},showQuadrantLabels:{control:`boolean`},animate:{control:`boolean`}}},I={args:{thresholdMode:`mean`}},L={args:{thresholdMode:`median`}},R={args:{thresholdMode:`custom`,thresholdX:40,thresholdY:60}},z={args:{thresholdMode:`mean`,size:`size`,radiusRange:[6,35]}},B={args:{thresholdMode:`mean`,quadrantLabels:[`High Value
Low Risk`,`High Value
High Risk`,`Low Value
Low Risk`,`Low Value
High Risk`]}},V={args:{thresholdMode:`mean`,quadrantStyles:[{backgroundColor:`#dbeafe`,backgroundOpacity:.15,dividerStroke:`#3b82f6`,dividerStrokeWidth:2},{backgroundColor:`#fecaca`,backgroundOpacity:.15,dividerStroke:`#ef4444`,dividerStrokeWidth:2},{backgroundColor:`#d1fae5`,backgroundOpacity:.15,dividerStroke:`#10b981`,dividerStrokeWidth:2},{backgroundColor:`#fef3c7`,backgroundOpacity:.15,dividerStroke:`#f59e0b`,dividerStrokeWidth:2}]}},H={args:{thresholdMode:`mean`,series:[{dataKey:`y`,name:`Series A`,color:`#3b82f6`},{dataKey:`y2`,name:`Series B`,color:`#ef4444`}],data:P(40).map(e=>({...e,y2:Math.round(Math.random()*100)}))}},U={args:{thresholdMode:`mean`,animate:!1}},W={args:{thresholdMode:`mean`,showQuadrantLabels:!1}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean'
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'median'
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'custom',
    thresholdX: 40,
    thresholdY: 60
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    size: 'size',
    radiusRange: [6, 35]
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    quadrantLabels: ['High Value\\nLow Risk', 'High Value\\nHigh Risk', 'Low Value\\nLow Risk', 'Low Value\\nHigh Risk']
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    quadrantStyles: [{
      backgroundColor: '#dbeafe',
      backgroundOpacity: 0.15,
      dividerStroke: '#3b82f6',
      dividerStrokeWidth: 2
    }, {
      backgroundColor: '#fecaca',
      backgroundOpacity: 0.15,
      dividerStroke: '#ef4444',
      dividerStrokeWidth: 2
    }, {
      backgroundColor: '#d1fae5',
      backgroundOpacity: 0.15,
      dividerStroke: '#10b981',
      dividerStrokeWidth: 2
    }, {
      backgroundColor: '#fef3c7',
      backgroundOpacity: 0.15,
      dividerStroke: '#f59e0b',
      dividerStrokeWidth: 2
    }]
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    series: [{
      dataKey: 'y',
      name: 'Series A',
      color: '#3b82f6'
    }, {
      dataKey: 'y2',
      name: 'Series B',
      color: '#ef4444'
    }],
    data: generateData(40).map(d => ({
      ...d,
      y2: Math.round(Math.random() * 100)
    }))
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    animate: false
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  args: {
    thresholdMode: 'mean',
    showQuadrantLabels: false
  }
}`,...W.parameters?.docs?.source}}},G=[`Default`,`MedianThresholds`,`CustomThresholds`,`WithBubbleSize`,`WithCustomLabels`,`CustomStyling`,`MultipleSeries`,`NoAnimation`,`NoLabels`]}))();export{V as CustomStyling,R as CustomThresholds,I as Default,L as MedianThresholds,H as MultipleSeries,U as NoAnimation,W as NoLabels,z as WithBubbleSize,B as WithCustomLabels,G as __namedExportsOrder,F as default};