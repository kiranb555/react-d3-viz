import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{n,t as r}from"./iframe-CISgnNV3.js";import{d as i,f as a,i as o,l as s,n as c,o as l,r as u,t as d,u as f}from"./useAutoSize-D-qkoCtK.js";import{i as p,r as m}from"./accessors-DCkyJMEZ.js";import{n as h,r as g,t as _}from"./bounds-Cmn3u3fx.js";import{i as v,t as y}from"./src-BB9HugtD.js";import{i as ee,n as te,r as b,t as x}from"./useAnimatedValue-DThFBlZ4.js";function ne(e,t,n){let[r,i]=e,a=i-r,o=e=>{let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[0,0,0]},s=(e,t,n)=>`#`+[e,t,n].map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,`0`)).join(``),[c,l,u]=o(t),[d,f,p]=o(n);return{interpolate:e=>{let t=a===0?0:(e-r)/a,n=Math.max(0,Math.min(1,t));return s(c+(d-c)*n,l+(f-l)*n,u+(p-u)*n)},domain:e}}function re(e,t,n,r){let[i,a]=e,o=(i+a)/2,s=e=>{let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[0,0,0]},c=(e,t,n)=>`#`+[e,t,n].map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,`0`)).join(``),[l,u,d]=s(t),[f,p,m]=s(n),[h,g,_]=s(r);return{interpolate:e=>{let t,n,r,s;return e<=o?(t=(e-i)/(o-i),n=l+(f-l)*t,r=u+(p-u)*t,s=d+(m-d)*t):(t=(e-o)/(a-o),n=f+(h-f)*t,r=p+(g-p)*t,s=m+(_-m)*t),c(n,r,s)},domain:e}}function ie(e,t,n,r){let i=[];for(let a=0;a<t.length;a++)for(let t=0;t<e.length;t++){let e=n[a]?.[t];e!=null&&Number.isFinite(e)&&i.push({x:t,y:a,value:e,color:r.interpolate(e)})}return i}function ae(e){let t=1/0,n=-1/0;for(let r of e)for(let e of r)Number.isFinite(e)&&(t=Math.min(t,e),n=Math.max(n,e));return[isFinite(t)?t:0,isFinite(n)?n:1]}var S=t((()=>{}));function C({data:e,rowKey:t,columnKey:n,valueKey:r,width:a=`auto`,height:u=`auto`,aspect:d=.75,margin:m,theme:g,showXLabels:y=!0,showYLabels:b=!0,showTooltip:x=!0,formatValue:S=e=>e.toFixed(2),colorScaleMode:C=`linear`,colorStart:E=`#e8eaf6`,colorEnd:D=`#1a237e`,colorMid:O=`#ffffff`,colorDomain:k,cellStroke:A=`#ffffff`,cellStrokeWidth:j=1,animate:M=!0}){let N=o(g),{width:P,height:F,svgWidth:I,svgHeight:L,onLayout:R}=c(a,u,d),[z,B]=(0,w.useState)(null),[V,oe]=(0,w.useState)({x:0,y:0}),H=h(P,F,{..._,...m}),U=(0,w.useMemo)(()=>p(t),[t]),W=(0,w.useMemo)(()=>p(n),[n]),G=(0,w.useMemo)(()=>p(r),[r]),K=(0,w.useMemo)(()=>{let t=new Set,n=[];for(let r=0;r<e.length;r++){let i=U(e[r],r);i!=null&&!t.has(i)&&(t.add(i),n.push(i))}return n},[e,U]),q=(0,w.useMemo)(()=>{let t=new Set,n=[];for(let r=0;r<e.length;r++){let i=W(e[r],r);i!=null&&!t.has(i)&&(t.add(i),n.push(i))}return n},[e,W]),J=(0,w.useMemo)(()=>{let t=Array(K.length).fill(null).map(()=>Array(q.length).fill(NaN));for(let n=0;n<e.length;n++){let r=U(e[n],n),i=W(e[n],n),a=G(e[n],n);if(r!=null&&i!=null&&Number.isFinite(a)){let e=K.indexOf(r),n=q.indexOf(i);e>=0&&n>=0&&(t[e][n]=a)}}return t},[e,U,W,G,q,K]),Y=k??ae(J),se=(0,w.useMemo)(()=>C===`diverging`?re(Y,E,O,D):ne(Y,E,D),[C,Y,E,D,O]),ce=(0,w.useMemo)(()=>ie(q,K,J,se),[q,K,J,se]),X=(0,w.useMemo)(()=>v().domain(Array.from({length:q.length},(e,t)=>t)).range([H.margin.left,H.margin.left+H.innerWidth]).padding(.05),[q.length,H]),Z=(0,w.useMemo)(()=>v().domain(Array.from({length:K.length},(e,t)=>t)).range([H.margin.top+H.innerHeight,H.margin.top]).padding(.05),[K.length,H]),le=te({enabled:M&&N.animation.enabled,durationMs:N.animation.durationMs}),Q=X.bandwidth(),$=Z.bandwidth();return(0,T.jsxs)(f,{width:I,height:L,onLayout:R,onMove:e=>{if(!x)return;let{x:t,y:n}=e;oe({x:t,y:n});for(let e of ce){let r=X(e.x)??0,i=Z(e.y)??0;if(t>=r&&t<r+Q&&n>=i&&n<i+$){B({x:e.x,y:e.y,value:e.value,color:e.color});return}}B(null)},onLeave:()=>B(null),children:[(0,T.jsx)(s,{x:0,y:0,width:P,height:F,fill:N.background}),(0,T.jsx)(l,{children:ce.map(e=>{let t=X(e.x)??0,n=Z(e.y)??0,r=ee(.7,z&&z.x===e.x&&z.y===e.y?1:.85,le);return(0,T.jsx)(s,{x:t,y:n,width:Q,height:$,fill:e.color,stroke:A,strokeWidth:j,opacity:r},`${e.x}-${e.y}`)})}),y&&(0,T.jsx)(l,{children:q.map((e,t)=>(0,T.jsx)(i,{x:(X(t)??0)+Q/2,y:H.margin.top-8,textAnchor:`middle`,fontSize:N.axis.labelSize,fill:N.axis.labelColor,verticalAnchor:`end`,children:e},`x-${t}`))}),b&&(0,T.jsx)(l,{children:K.map((e,t)=>{let n=Z(t)??0;return(0,T.jsx)(i,{x:H.margin.left-8,y:n+$/2,textAnchor:`end`,fontSize:N.axis.labelSize,fill:N.axis.labelColor,verticalAnchor:`middle`,children:e},`y-${t}`)})}),x&&z&&(0,T.jsx)(l,{children:(()=>{let e=K[z.y],t=q[z.x],n=S(z.value),r=`Row: ${e}`,a=`Col: ${t}`,o=`Val: ${n}`,c=16+Math.max(r.length,a.length,o.length)*11*.6,l=V.x-H.margin.left,u=V.y-H.margin.top,d=l+c+12>H.innerWidth,f=H.margin.left+(d?Math.max(0,l-c-12):Math.min(l+12,H.margin.left+H.innerWidth-c)),p=H.margin.top+Math.max(0,Math.min(u-70/2,H.innerHeight-70)),m=N.tooltip.background,h=N.tooltip.color;return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(s,{x:f,y:p,width:c,height:70,fill:m,stroke:N.tooltip.borderColor,strokeWidth:1,rx:4,opacity:.96}),(0,T.jsx)(i,{x:f+8,y:p+8+4,fontSize:11,fill:h,verticalAnchor:`start`,children:r}),(0,T.jsx)(i,{x:f+8,y:p+8+18,fontSize:11,fill:h,verticalAnchor:`start`,children:a}),(0,T.jsx)(i,{x:f+8,y:p+8+36,fontSize:12,fontWeight:`bold`,fill:h,verticalAnchor:`start`,children:o})]})})()})]})}var w,T,E=t((()=>{w=e(n(),1),y(),a(),d(),x(),u(),g(),b(),S(),m(),T=r(),C.__docgenInfo={description:`Heatmap chart. A 2D grid where each cell is colored based on its numeric value.
Rows and columns are categorical; values are color-encoded.`,methods:[],displayName:`HeatmapChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`Record`,elements:[{name:`string`},{name:`unknown`}],raw:`Record<string, unknown>`}],raw:`Datum[]`},description:`Data array where each element contains row/column/value info.`},rowKey:{required:!0,tsType:{name:`union`,raw:`Accessor<string> | string`,elements:[{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},{name:`string`}]},description:`Accessor to extract the row label (y-axis). Can be a string key or accessor function.`},columnKey:{required:!0,tsType:{name:`union`,raw:`Accessor<string> | string`,elements:[{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},{name:`string`}]},description:`Accessor to extract the column label (x-axis). Can be a string key or accessor function.`},valueKey:{required:!0,tsType:{name:`union`,raw:`Accessor<number> | string`,elements:[{name:`union`,raw:`string | ((d: Datum, index: number) => T)`,elements:[{name:`string`},{name:`unknown`}]},{name:`string`}]},description:`Accessor to extract the numeric value for coloring the cell. Can be a string key or accessor function.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent.`,defaultValue:{value:`'auto'`,computed:!1}},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel height, or 'auto' to derive from width via aspect. Default 400.`,defaultValue:{value:`'auto'`,computed:!1}},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio when height is 'auto'. Default 0.75.`,defaultValue:{value:`0.75`,computed:!1}},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:``},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:``},showXLabels:{required:!1,tsType:{name:`boolean`},description:`Show column labels.`,defaultValue:{value:`true`,computed:!1}},showYLabels:{required:!1,tsType:{name:`boolean`},description:`Show row labels.`,defaultValue:{value:`true`,computed:!1}},showTooltip:{required:!1,tsType:{name:`boolean`},description:`Show tooltip on hover.`,defaultValue:{value:`true`,computed:!1}},formatValue:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:`Format function for cell values in tooltip.`,defaultValue:{value:`(v) => v.toFixed(2)`,computed:!1}},colorScaleMode:{required:!1,tsType:{name:`union`,raw:`'linear' | 'diverging'`,elements:[{name:`literal`,value:`'linear'`},{name:`literal`,value:`'diverging'`}]},description:`Color scale mode: 'linear' or 'diverging'.`,defaultValue:{value:`'linear'`,computed:!1}},colorStart:{required:!1,tsType:{name:`string`},description:`Start color for linear scale (hex, default #e8eaf6).`,defaultValue:{value:`'#e8eaf6'`,computed:!1}},colorEnd:{required:!1,tsType:{name:`string`},description:`End color for linear scale or high color for diverging (hex, default #1a237e).`,defaultValue:{value:`'#1a237e'`,computed:!1}},colorMid:{required:!1,tsType:{name:`string`},description:`Middle color for diverging scale (hex, default #ffffff).`,defaultValue:{value:`'#ffffff'`,computed:!1}},colorDomain:{required:!1,tsType:{name:`tuple`,raw:`[number, number]`,elements:[{name:`number`},{name:`number`}]},description:`Explicit color domain [min, max]. If not provided, derived from data.`},cellStroke:{required:!1,tsType:{name:`string`},description:`Cell stroke color.`,defaultValue:{value:`'#ffffff'`,computed:!1}},cellStrokeWidth:{required:!1,tsType:{name:`number`},description:`Cell stroke width.`,defaultValue:{value:`1`,computed:!1}},animate:{required:!1,tsType:{name:`boolean`},description:`Enable enter animation.`,defaultValue:{value:`true`,computed:!1}}}}})),D,O,k,A,j,M,N,P,F,I,L,R,z;t((()=>{E(),D=[{hour:`00:00`,day:`Mon`,temp:15},{hour:`00:00`,day:`Tue`,temp:16},{hour:`00:00`,day:`Wed`,temp:14},{hour:`00:00`,day:`Thu`,temp:17},{hour:`00:00`,day:`Fri`,temp:18},{hour:`04:00`,day:`Mon`,temp:12},{hour:`04:00`,day:`Tue`,temp:13},{hour:`04:00`,day:`Wed`,temp:11},{hour:`04:00`,day:`Thu`,temp:14},{hour:`04:00`,day:`Fri`,temp:15},{hour:`08:00`,day:`Mon`,temp:18},{hour:`08:00`,day:`Tue`,temp:19},{hour:`08:00`,day:`Wed`,temp:17},{hour:`08:00`,day:`Thu`,temp:20},{hour:`08:00`,day:`Fri`,temp:21},{hour:`12:00`,day:`Mon`,temp:24},{hour:`12:00`,day:`Tue`,temp:25},{hour:`12:00`,day:`Wed`,temp:23},{hour:`12:00`,day:`Thu`,temp:26},{hour:`12:00`,day:`Fri`,temp:27},{hour:`16:00`,day:`Mon`,temp:26},{hour:`16:00`,day:`Tue`,temp:27},{hour:`16:00`,day:`Wed`,temp:25},{hour:`16:00`,day:`Thu`,temp:28},{hour:`16:00`,day:`Fri`,temp:29},{hour:`20:00`,day:`Mon`,temp:22},{hour:`20:00`,day:`Tue`,temp:23},{hour:`20:00`,day:`Wed`,temp:21},{hour:`20:00`,day:`Thu`,temp:24},{hour:`20:00`,day:`Fri`,temp:25}],O=[{x:`A`,y:`A`,value:1},{x:`B`,y:`A`,value:.85},{x:`C`,y:`A`,value:-.6},{x:`D`,y:`A`,value:.4},{x:`A`,y:`B`,value:.85},{x:`B`,y:`B`,value:1},{x:`C`,y:`B`,value:-.75},{x:`D`,y:`B`,value:.5},{x:`A`,y:`C`,value:-.6},{x:`B`,y:`C`,value:-.75},{x:`C`,y:`C`,value:1},{x:`D`,y:`C`,value:-.3},{x:`A`,y:`D`,value:.4},{x:`B`,y:`D`,value:.5},{x:`C`,y:`D`,value:-.3},{x:`D`,y:`D`,value:1}],k=[{product:`Laptop`,region:`North`,sales:450},{product:`Laptop`,region:`South`,sales:380},{product:`Laptop`,region:`East`,sales:520},{product:`Laptop`,region:`West`,sales:410},{product:`Tablet`,region:`North`,sales:320},{product:`Tablet`,region:`South`,sales:410},{product:`Tablet`,region:`East`,sales:280},{product:`Tablet`,region:`West`,sales:350},{product:`Phone`,region:`North`,sales:600},{product:`Phone`,region:`South`,sales:650},{product:`Phone`,region:`East`,sales:720},{product:`Phone`,region:`West`,sales:580},{product:`Watch`,region:`North`,sales:180},{product:`Watch`,region:`South`,sales:210},{product:`Watch`,region:`East`,sales:150},{product:`Watch`,region:`West`,sales:190}],A={title:`Charts/HeatmapChart`,component:C,tags:[`autodocs`],parameters:{layout:`centered`},args:{width:`auto`,height:400,showXLabels:!0,showYLabels:!0,showTooltip:!0,animate:!0},argTypes:{height:{control:{type:`range`,min:300,max:700,step:50}},showXLabels:{control:`boolean`},showYLabels:{control:`boolean`},showTooltip:{control:`boolean`},animate:{control:`boolean`},cellStrokeWidth:{control:{type:`range`,min:0,max:3,step:.5}}}},j={args:{data:D,rowKey:`day`,columnKey:`hour`,valueKey:`temp`,formatValue:e=>`${e}°C`,colorStart:`#4575b4`,colorEnd:`#d73027`}},M={args:{data:O,rowKey:`y`,columnKey:`x`,valueKey:`value`,formatValue:e=>e.toFixed(2),colorScaleMode:`diverging`,colorStart:`#d73027`,colorMid:`#f7f7f7`,colorEnd:`#4575b4`,colorDomain:[-1,1]}},N={args:{data:k,rowKey:`product`,columnKey:`region`,valueKey:`sales`,formatValue:e=>`$${e}`,colorStart:`#ffffcc`,colorEnd:`#003300`}},P={args:{data:D,rowKey:`day`,columnKey:`hour`,valueKey:`temp`,showXLabels:!1,showYLabels:!1}},F={args:{data:D,rowKey:`day`,columnKey:`hour`,valueKey:`temp`,showTooltip:!1}},I={args:{data:D,rowKey:`day`,columnKey:`hour`,valueKey:`temp`,animate:!1}},L={args:{data:k,rowKey:`product`,columnKey:`region`,valueKey:`sales`,cellStroke:`#cccccc`,cellStrokeWidth:2}},R={args:{data:Array.from({length:1e3},(e,t)=>({row:`R${Math.floor(t/50)}`,col:`C${t%50}`,val:Math.random()*100})),rowKey:`row`,columnKey:`col`,valueKey:`val`,height:600}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    formatValue: v => \`\${v}°C\`,
    colorStart: '#4575b4',
    colorEnd: '#d73027'
  }
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    data: correlationData,
    rowKey: 'y',
    columnKey: 'x',
    valueKey: 'value',
    formatValue: v => v.toFixed(2),
    colorScaleMode: 'diverging',
    colorStart: '#d73027',
    colorMid: '#f7f7f7',
    colorEnd: '#4575b4',
    colorDomain: [-1, 1]
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    data: salesData,
    rowKey: 'product',
    columnKey: 'region',
    valueKey: 'sales',
    formatValue: v => \`$\${v}\`,
    colorStart: '#ffffcc',
    colorEnd: '#003300'
  }
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    showXLabels: false,
    showYLabels: false
  }
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    showTooltip: false
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    data: temperatureData,
    rowKey: 'day',
    columnKey: 'hour',
    valueKey: 'temp',
    animate: false
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    data: salesData,
    rowKey: 'product',
    columnKey: 'region',
    valueKey: 'sales',
    cellStroke: '#cccccc',
    cellStrokeWidth: 2
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    data: Array.from({
      length: 1000
    }, (_, i) => ({
      row: \`R\${Math.floor(i / 50)}\`,
      col: \`C\${i % 50}\`,
      val: Math.random() * 100
    })),
    rowKey: 'row',
    columnKey: 'col',
    valueKey: 'val',
    height: 600
  }
}`,...R.parameters?.docs?.source}}},z=[`Temperature`,`Correlation`,`Sales`,`NoLabels`,`NoTooltip`,`NoAnimation`,`CustomCellStroke`,`LargeDataset`]}))();export{M as Correlation,L as CustomCellStroke,R as LargeDataset,I as NoAnimation,P as NoLabels,F as NoTooltip,N as Sales,j as Temperature,z as __namedExportsOrder,A as default};