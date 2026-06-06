import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{n,t as r}from"./iframe-CISgnNV3.js";import{d as i,f as a,i as o,l as s,n as c,o as l,r as u,s as d,t as f,u as p}from"./useAutoSize-D-qkoCtK.js";import{r as m,t as h}from"./src-BB9HugtD.js";import{n as g,t as _}from"./useAnimatedValue-DThFBlZ4.js";function v(e,t,n,r){let i=t-r.left-r.right,a=n-r.top-r.bottom;if(!e||e.length===0)return{segments:[],connectors:[],bounds:{minX:0,maxX:i,minY:0,maxY:a},runningTotals:[]};let o=[],s=0;e.forEach(e=>{s+=e.value,o.push(s)});let c=[0,...o,...e.map(e=>e.value),...o.map((t,n)=>t-e[n].value)],l=Math.min(...c),u=Math.max(...c),d=(u-l)*.1,f=m().domain([l-d,u+d]).range([a,0]),p=m().domain([0,e.length-1]).range([0,i]),h=[],g=[],_=f(0);return e.forEach((e,t)=>{let n=p(t),r=e.value>=0;if(e.isTotal){let n=f(0),r=f(o[t]);h.push({label:e.label,startY:Math.min(n,r),endY:Math.max(n,r),height:Math.abs(r-n),isPositive:o[t]>=0,isTotal:!0}),_=r}else{let i=t===0?0:o[t-1],a=o[t],s=f(i),c=f(a);if(h.push({label:e.label,startY:Math.min(s,c),endY:Math.max(s,c),height:Math.abs(c-s),isPositive:r,isTotal:!1}),t>0){let e=p(t-1);g.push({x1:e,y1:_,x2:n,y2:s})}_=c}}),{segments:h,connectors:g,bounds:{minX:0,maxX:i,minY:0,maxY:a},runningTotals:o}}var y=t((()=>{h()})),b,x,S,C,w=t((()=>{a(),b=r(),x=30,S=15,C=({layout:e,data:t,colors:n,valueFormatter:r=e=>e.toFixed(0),activeIndex:a,onSegmentPress:o,theme:c})=>{if(e.segments.length===0)return(0,b.jsx)(l,{children:(0,b.jsx)(i,{x:0,y:0,fill:c.font.color,fontSize:c.font.size,children:`No segments to display`})});let u=(e.bounds.maxX-e.bounds.minX)/Math.max(1,e.segments.length);return(0,b.jsxs)(l,{children:[e.connectors.map((e,t)=>(0,b.jsx)(d,{x1:e.x1+x/2,y1:e.y1,x2:e.x2-x/2,y2:e.y2,stroke:c.grid.color,strokeWidth:1,opacity:.5,strokeDasharray:`4,4`},`connector-${t}`)),e.segments.map((e,d)=>{let f=u*d,p=e.isTotal,m=a===d,h=p?n[n.length-1]||n[0]:n[d%n.length],g=a===null?p?.8:.6:m?1:.3;return(0,b.jsxs)(l,{onPress:()=>o?.(d),children:[(0,b.jsx)(s,{x:f,y:e.startY,width:x,height:e.height,fill:h,opacity:g}),(0,b.jsx)(i,{x:f+x/2,y:e.endY+S,textAnchor:`middle`,fontSize:c.axis.labelSize,fill:c.axis.labelColor,children:e.label}),(0,b.jsx)(i,{x:f+x/2,y:e.startY-5,textAnchor:`middle`,fontSize:Math.max(c.axis.labelSize-1,8),fill:c.font.color,children:r(t[d].value)})]},`segment-${d}`)})]})},C.__docgenInfo={description:``,methods:[],displayName:`Waterfall`,props:{valueFormatter:{defaultValue:{value:`(v) => v.toFixed(0)`,computed:!1},required:!1}}}}));function T({data:e,width:t,height:n=`auto`,aspect:r=1.33,theme:a,colors:u,animate:d,valueFormatter:f=e=>e.toFixed(0)}){let m=o(a),h=c(t??`auto`,n,r),_=u??m.colors,[y,b]=(0,E.useState)(null),x=g({enabled:(d??m.animation.enabled)&&m.animation.enabled,durationMs:m.animation.durationMs}),S=(0,E.useMemo)(()=>Array.isArray(e)?e:[],[e]),w=(0,E.useMemo)(()=>v(S,h.width,h.height,O),[S,h.width,h.height]);return S.length===0?(0,D.jsxs)(p,{width:h.svgWidth,height:h.svgHeight,onLayout:h.onLayout,children:[(0,D.jsx)(s,{x:0,y:0,width:h.width,height:h.height,fill:m.background}),(0,D.jsx)(i,{x:h.width/2,y:h.height/2,textAnchor:`middle`,fill:m.font.color,fontSize:m.font.size,children:`No data available`})]}):(0,D.jsx)(p,{width:h.svgWidth,height:h.svgHeight,onLayout:h.onLayout,children:h.width>0&&(0,D.jsxs)(D.Fragment,{children:[m.background!==`transparent`&&(0,D.jsx)(s,{x:0,y:0,width:h.width,height:h.height,fill:m.background}),(0,D.jsx)(l,{transform:`translate(${O.left},${O.top}) scale(${.8+.2*x})`,opacity:x,children:(0,D.jsx)(C,{layout:w,data:S,colors:_,valueFormatter:f,activeIndex:y,onSegmentPress:e=>b(y===e?null:e),theme:m})})]})})}var E,D,O,k=t((()=>{E=e(n(),1),a(),u(),f(),_(),y(),w(),D=r(),O={top:20,right:20,bottom:40,left:60},T.displayName=`WaterfallChart`,T.__docgenInfo={description:`Waterfall chart. Self-contained (does not use the Cartesian frame). Shows the
cumulative effect of sequentially introduced positive and negative values.
Segments are connected by lines, and a total segment can be marked with \`isTotal\`.`,methods:[],displayName:`WaterfallChart`,props:{data:{required:!0,tsType:{name:`Array`,elements:[{name:`WaterfallDataPoint`}],raw:`WaterfallDataPoint[]`},description:`Array of data points with label and value.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent.`},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300.",defaultValue:{value:`'auto'`,computed:!1}},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio when height is 'auto'. Default 1.33.`,defaultValue:{value:`1.33`,computed:!1}},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:`Chart theme override.`},colors:{required:!1,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:`Override the categorical palette.`},animate:{required:!1,tsType:{name:`boolean`},description:`Show animations.`},valueFormatter:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(value: number) => string`,signature:{arguments:[{type:{name:`number`},name:`value`}],return:{name:`string`}}},description:`Format the numeric values displayed.`,defaultValue:{value:`(v) => v.toFixed(0)`,computed:!1}}}}})),A,j,M,N,P,F,I,L,R,z,B,V;t((()=>{k(),A=r(),j={title:`Charts/WaterfallChart`,component:T,tags:[`autodocs`],parameters:{layout:`centered`},args:{width:550,height:400},argTypes:{width:{control:{type:`range`,min:400,max:800,step:50}},height:{control:{type:`range`,min:300,max:600,step:50}},aspect:{control:{type:`range`,min:.5,max:3,step:.1}},animate:{control:`boolean`}}},M=[{label:`Start`,value:100},{label:`Revenue`,value:50},{label:`Costs`,value:-20},{label:`Net Income`,value:130,isTotal:!0}],N={args:{data:M,width:500,height:400}},P=[{label:`Q1 Revenue`,value:100},{label:`Q2 Revenue`,value:120},{label:`H1 Total`,value:220,isTotal:!0},{label:`Costs`,value:-50},{label:`H1 Net`,value:170,isTotal:!0}],F={args:{data:P,width:500,height:400}},I=[{label:`Starting Assets`,value:500},{label:`Market Loss`,value:-100},{label:`Recovery`,value:50},{label:`Net Assets`,value:450,isTotal:!0}],L={args:{data:I,width:500,height:400}},R=Array.from({length:50},(e,t)=>({label:`Step ${t+1}`,value:Math.random()*100-50,isTotal:(t+1)%10==0})),z={args:{data:R,width:800,height:500}},B={args:{data:M,width:`auto`,height:`auto`,aspect:2},render:e=>(0,A.jsx)(`div`,{style:{width:`100%`,maxWidth:`600px`,margin:`0 auto`},children:(0,A.jsx)(T,{...e})})},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    data: basicData,
    width: 500,
    height: 400
  }
}`,...N.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    data: multiStepData,
    width: 500,
    height: 400
  }
}`,...F.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    data: negativeData,
    width: 500,
    height: 400
  }
}`,...L.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: largeData,
    width: 800,
    height: 500
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    data: basicData,
    width: 'auto',
    height: 'auto',
    aspect: 2
  },
  render: args => <div style={{
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  }}>
      <WaterfallChart {...args} />
    </div>
}`,...B.parameters?.docs?.source}}},V=[`Basic`,`MultiStep`,`WithNegatives`,`LargeDataset`,`ResponsiveSizing`]}))();export{N as Basic,z as LargeDataset,F as MultiStep,B as ResponsiveSizing,L as WithNegatives,V as __namedExportsOrder,j as default};