import{a as e,n as t}from"./chunk-DnJy8xQt.js";import{n,t as r}from"./iframe-CISgnNV3.js";import{c as i,d as a,f as o,i as s,l as c,n as l,o as u,r as d,t as f,u as p}from"./useAutoSize-D-qkoCtK.js";import{n as m,t as h}from"./useAnimatedValue-DThFBlZ4.js";function g(e,t,n,r){let i=t-r.left-r.right,a=n-r.top-r.bottom;if(!e.nodes||e.nodes.length===0)return{nodes:[],links:[],bounds:{minX:0,maxX:i,minY:0,maxY:a}};let o=new Map;e.nodes.forEach(e=>o.set(e.id,e));let s=new Map;e.nodes.forEach(e=>{s.set(e.id,{in:0,out:0})}),e.links.forEach(e=>{let t=s.get(e.source)||{in:0,out:0},n=s.get(e.target)||{in:0,out:0};t.out+=e.value,n.in+=e.value,s.set(e.source,t),s.set(e.target,n)});let c=[],l=new Set,u=[];e.nodes.forEach(e=>{(s.get(e.id)||{in:0,out:0}).in===0&&u.push(e.id)});let d=0;for(;u.length>0&&d<e.nodes.length;){c.push([...u]),u.forEach(e=>l.add(e));let t=[],n=new Set;u.forEach(r=>{e.links.forEach(e=>{e.source===r&&!l.has(e.target)&&(n.has(e.target)||(t.push(e.target),n.add(e.target)))})}),u.length=0,u.push(...t),d++}let f=new Set(c.flat()),p=e.nodes.filter(e=>!f.has(e.id));p.length>0&&c.push(p.map(e=>e.id));let m=[],h=new Map;return c.forEach((e,t)=>{let n=c.length>1?i/(c.length-1)*t:i/2,r=e.reduce((e,t)=>{let n=s.get(t)||{in:0,out:0};return e+Math.max(n.in,n.out)},0),l=0;e.forEach(e=>{let t=s.get(e)||{in:0,out:0},i=Math.max(t.in,t.out),c=r>0?i/r*a:20,u=o.get(e),d={id:u.id,label:u.label,x:n,y:l,width:30,height:Math.max(c,20)};m.push(d),h.set(e,d),l+=d.height+10})}),{nodes:m,links:e.links.map(e=>{let t=h.get(e.source),n=h.get(e.target);if(!t||!n)return{source:e.source,target:e.target,value:e.value,path:``,sourceY:0,targetY:0};let r=t.y+t.height/2,i=n.y+n.height/2,a=t.x+(n.x-t.x)/2,o=`M ${t.x+t.width},${r} C ${a},${r} ${a},${i} ${n.x},${i}`;return{source:e.source,target:e.target,value:e.value,path:o,sourceY:r,targetY:i}}),bounds:{minX:0,maxX:i,minY:0,maxY:a}}}var _=t((()=>{})),v,y,b=t((()=>{o(),v=r(),y=({node:e,color:t,theme:n})=>(0,v.jsxs)(u,{onPress:()=>{},children:[(0,v.jsx)(c,{x:e.x,y:e.y,width:e.width,height:e.height,fill:t,rx:2,opacity:.8}),e.width>0&&e.height>0&&(0,v.jsx)(a,{x:e.x+e.width+5,y:e.y+e.height/2,fontSize:n.font.size,fontFamily:n.font.family,fill:n.font.color,textAnchor:`start`,verticalAnchor:`middle`,children:e.label})]}),y.__docgenInfo={description:``,methods:[],displayName:`SankeyNode`,props:{node:{required:!0,tsType:{name:`ComputedSankeyNode`},description:``},color:{required:!0,tsType:{name:`string`},description:``},theme:{required:!0,tsType:{name:`ChartTheme`},description:``}}}})),x,S,C=t((()=>{o(),x=r(),S=({link:e,opacity:t=.3})=>{let n=Math.max(2,Math.sqrt(Math.abs(e.value))/2);return(0,x.jsx)(i,{d:e.path,fill:`none`,stroke:`currentColor`,strokeWidth:n,opacity:t,strokeLinecap:`round`,strokeLinejoin:`round`})},S.__docgenInfo={description:``,methods:[],displayName:`SankeyLink`,props:{link:{required:!0,tsType:{name:`ComputedSankeyLink`},description:``},opacity:{required:!1,tsType:{name:`number`},description:``,defaultValue:{value:`0.3`,computed:!1}}}}}));function w({data:e,width:t=`auto`,height:n=`auto`,aspect:r=1.33,margin:i,theme:o,colors:d,animate:f=!0,nodeColors:h={}}){let _=s(o),v=l(t,n,r),b=d??_.colors,x=(0,T.useMemo)(()=>({...D,...i}),[i]),C=m({enabled:f&&_.animation.enabled,durationMs:_.animation.durationMs}),w=(0,T.useMemo)(()=>e&&Array.isArray(e.nodes)?e:{nodes:[],links:[]},[e]),O=(0,T.useMemo)(()=>g(w,v.width,v.height,x),[w,v.width,v.height,x]);return w.nodes.length===0?(0,E.jsxs)(p,{width:v.svgWidth,height:v.svgHeight,onLayout:v.onLayout,children:[_.background!==`transparent`&&(0,E.jsx)(c,{x:0,y:0,width:v.width,height:v.height,fill:_.background}),(0,E.jsx)(a,{x:v.width/2,y:v.height/2,textAnchor:`middle`,fill:_.font.color,fontSize:_.font.size,children:`No data available`})]}):(0,E.jsx)(p,{width:v.svgWidth,height:v.svgHeight,onLayout:v.onLayout,children:v.width>0&&(0,E.jsxs)(E.Fragment,{children:[_.background!==`transparent`&&(0,E.jsx)(c,{x:0,y:0,width:v.width,height:v.height,fill:_.background}),(0,E.jsxs)(u,{transform:`translate(${x.left},${x.top}) scale(${.8+.2*C})`,opacity:C,children:[O.links.map((e,t)=>(0,E.jsx)(S,{link:e,opacity:.3},`link-${t}`)),O.nodes.map((e,t)=>(0,E.jsx)(y,{node:e,color:h[e.id]||b[t%b.length],theme:_},`node-${t}`))]})]})})}var T,E,D,O=t((()=>{T=e(n(),1),_(),d(),f(),o(),h(),b(),C(),E=r(),D={top:20,right:20,bottom:20,left:20},w.displayName=`SankeyDiagram`,w.__docgenInfo={description:`Sankey diagram. Self-contained (does not use the Cartesian frame).
Shows flow relationships from source to target nodes with proportional link widths.`,methods:[],displayName:`SankeyDiagram`,props:{data:{required:!0,tsType:{name:`SankeyData`},description:`Nodes and links defining the Sankey flow.`},width:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:`Pixel width, or 'auto' (default) to fill the parent.`,defaultValue:{value:`'auto'`,computed:!1}},height:{required:!1,tsType:{name:`union`,raw:`number | 'auto'`,elements:[{name:`number`},{name:`literal`,value:`'auto'`}]},description:"Pixel height, or 'auto' to derive from width via `aspect`. Default 300.",defaultValue:{value:`'auto'`,computed:!1}},aspect:{required:!1,tsType:{name:`number`},description:`width / height ratio when height is 'auto'. Default 1.33.`,defaultValue:{value:`1.33`,computed:!1}},margin:{required:!1,tsType:{name:`Partial`,elements:[{name:`Margin`}],raw:`Partial<Margin>`},description:`Chart margin.`},theme:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{
  // Keep arrays (e.g. the colors palette) intact rather than widening their
  // elements to \`T | undefined\`; only plain objects get a shallow Partial.
  [P in keyof T]?: T[P] extends readonly unknown[]
    ? T[P]
    : T[P] extends object
      ? Partial<T[P]>
      : T[P];
}`,signature:{properties:[{key:{name:`ChartTheme`,required:!1},value:{name:`unknown`}}]}},description:`Chart theme override.`},colors:{required:!1,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:`Override the categorical palette.`},animate:{required:!1,tsType:{name:`boolean`},description:`Show animations.`,defaultValue:{value:`true`,computed:!1}},nodeColors:{required:!1,tsType:{name:`Record`,elements:[{name:`union`,raw:`string | number`,elements:[{name:`string`},{name:`number`}]},{name:`string`}],raw:`Record<string | number, string>`},description:`Optional: custom colors per node ID.`,defaultValue:{value:`{}`,computed:!1}}}}})),k,A,j,M,N,P,F,I,L,R,z,B,V;t((()=>{O(),k=r(),A={title:`Charts/SankeyDiagram`,component:w,tags:[`autodocs`],parameters:{layout:`centered`},args:{width:600,height:450},argTypes:{width:{control:{type:`range`,min:400,max:900,step:50}},height:{control:{type:`range`,min:300,max:700,step:50}},aspect:{control:{type:`range`,min:.5,max:2,step:.1}},animate:{control:`boolean`}}},j={nodes:[{id:`a`,label:`Source A`},{id:`b`,label:`Source B`},{id:`x`,label:`Sink X`},{id:`y`,label:`Sink Y`}],links:[{source:`a`,target:`x`,value:30},{source:`a`,target:`y`,value:20},{source:`b`,target:`x`,value:40},{source:`b`,target:`y`,value:60}]},M={args:{data:j,width:500,height:400}},N={nodes:[{id:`sales`,label:`Sales`},{id:`marketing`,label:`Marketing`},{id:`support`,label:`Support`},{id:`product-a`,label:`Product A`},{id:`product-b`,label:`Product B`},{id:`product-c`,label:`Product C`},{id:`retained`,label:`Retained Revenue`},{id:`churn`,label:`Churn`}],links:[{source:`sales`,target:`product-a`,value:50},{source:`sales`,target:`product-b`,value:40},{source:`marketing`,target:`product-a`,value:30},{source:`marketing`,target:`product-c`,value:50},{source:`support`,target:`product-b`,value:20},{source:`support`,target:`product-c`,value:30},{source:`product-a`,target:`retained`,value:70},{source:`product-a`,target:`churn`,value:10},{source:`product-b`,target:`retained`,value:55},{source:`product-b`,target:`churn`,value:5},{source:`product-c`,target:`retained`,value:75},{source:`product-c`,target:`churn`,value:5}]},P={args:{data:N,width:700,height:500}},F={nodes:[{id:`input`,label:`Input`},{id:`process1`,label:`Process 1`},{id:`process2`,label:`Process 2`},{id:`output1`,label:`Output 1`},{id:`output2`,label:`Output 2`},{id:`loss`,label:`Loss`}],links:[{source:`input`,target:`process1`,value:100},{source:`process1`,target:`process2`,value:80},{source:`process2`,target:`output1`,value:50},{source:`process2`,target:`output2`,value:20},{source:`process2`,target:`loss`,value:10}]},I={args:{data:F,width:500,height:400}},L={nodes:Array.from({length:50},(e,t)=>({id:`node-${t}`,label:`Node ${t}`})),links:Array.from({length:100},(e,t)=>({source:`node-${Math.floor(t/2)}`,target:`node-${25+Math.floor(t/2)}`,value:Math.random()*100}))},R={args:{data:L,width:800,height:600}},z={args:{data:j,width:500,height:400,nodeColors:{a:`#ff6b6b`,b:`#4ecdc4`,x:`#45b7d1`,y:`#96ceb4`}}},B={args:{data:j,width:`auto`,height:`auto`,aspect:1.5},render:e=>(0,k.jsx)(`div`,{style:{width:`100%`,maxWidth:`600px`,margin:`0 auto`},children:(0,k.jsx)(w,{...e})})},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    data: simpleData,
    width: 500,
    height: 400
  }
}`,...M.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    data: complexData,
    width: 700,
    height: 500
  }
}`,...P.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    data: unbalancedData,
    width: 500,
    height: 400
  }
}`,...I.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    data: largeData,
    width: 800,
    height: 600
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: simpleData,
    width: 500,
    height: 400,
    nodeColors: {
      a: '#ff6b6b',
      b: '#4ecdc4',
      x: '#45b7d1',
      y: '#96ceb4'
    }
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    data: simpleData,
    width: 'auto',
    height: 'auto',
    aspect: 1.5
  },
  render: args => <div style={{
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  }}>
      <SankeyDiagram {...args} />
    </div>
}`,...B.parameters?.docs?.source}}},V=[`Simple`,`Complex`,`UnbalancedFlow`,`LargeDataset`,`CustomColors`,`ResponsiveSizing`]}))();export{P as Complex,z as CustomColors,R as LargeDataset,B as ResponsiveSizing,M as Simple,I as UnbalancedFlow,V as __namedExportsOrder,A as default};